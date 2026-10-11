import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { validateEmailLegitimacy } from "../utils/emailValidator.js";

const token = (id, role = "patient") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "7d" });

export const validateEmail = async (req, res) => {
  const { email } = req.body;
  const result = await validateEmailLegitimacy(email);
  res.json(result);
};

export const register = async (req, res) => {
  const { name, email, password, role = "patient", hospitalDetails } = req.body;
  const cleanEmail = email?.trim().toLowerCase();

  // Validate email legitimacy (syntax, disposable filter, and DNS MX record)
  const emailValidation = await validateEmailLegitimacy(cleanEmail);
  if (!emailValidation.valid) {
    return res.status(400).json({
      message: emailValidation.reason,
      details: emailValidation.details,
    });
  }

  if (await User.findOne({ email: cleanEmail })) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    email: cleanEmail,
    password: hashedPassword,
    role: role || "patient",
    hospitalDetails: role === "hospital" ? hospitalDetails : undefined,
  });

  res.status(201).json({
    token: token(user.id, user.role),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hospitalDetails: user.hospitalDetails,
    },
  });
};

export const login = async (req, res) => {
  const cleanEmail = req.body.email?.trim().toLowerCase();
  const user = await User.findOne({ email: cleanEmail });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: token(user.id, user.role),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "patient",
      hospitalDetails: user.hospitalDetails,
    },
  });
};
