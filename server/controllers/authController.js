import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const token = (id, role = "patient") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, role = "patient", hospitalDetails } = req.body;
  const cleanEmail = email?.trim().toLowerCase();

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
