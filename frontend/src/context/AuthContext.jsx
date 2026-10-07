import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const initialRegisteredAccounts = [
  {
    id: "demo-user-123",
    name: "Chandrika Sharma",
    email: "chandrika@example.com",
    password: "password123",
    role: "patient",
  },
  {
    id: "hosp-demo-apollo",
    name: "Apollo Multispeciality Hospital",
    email: "apollo@hospital.unicare",
    password: "password123",
    role: "hospital",
    hospitalDetails: {
      licenseNo: "NABH-KA-2023-881",
      address: "154/11, Bannerghatta Main Rd, Bengaluru",
      city: "Bangalore",
      lat: 12.8932,
      lng: 77.5975,
      phone: "+91 80 2630 4050",
      emergencyContact: "+91 80 2630 4055",
    },
  },
  {
    id: "hosp-demo-manipal",
    name: "Manipal Hospital",
    email: "manipal@hospital.unicare",
    password: "password123",
    role: "hospital",
    hospitalDetails: {
      licenseNo: "NABH-KA-2021-420",
      address: "98, HAL Old Airport Rd, Kodihalli, Bengaluru",
      city: "Bangalore",
      lat: 12.9592,
      lng: 77.6496,
      phone: "+91 80 2502 4444",
      emergencyContact: "+91 80 2502 4455",
    },
  },
  {
    id: "hosp-demo-fortis",
    name: "Fortis Hospital",
    email: "fortis@hospital.unicare",
    password: "password123",
    role: "hospital",
    hospitalDetails: {
      licenseNo: "NABH-KA-2022-109",
      address: "14, Cunningham Rd, Vasanth Nagar, Bengaluru",
      city: "Bangalore",
      lat: 12.9866,
      lng: 77.5982,
      phone: "+91 80 4199 4444",
      emergencyContact: "+91 80 4199 4400",
    },
  },
];

export function AuthProvider({ children }) {
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem("unicare_registered_accounts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure initial demo hospitals are included if not present
        const hasHospital = parsed.some((acc) => acc.role === "hospital");
        if (!hasHospital) {
          const merged = [...parsed, ...initialRegisteredAccounts.slice(1)];
          localStorage.setItem("unicare_registered_accounts", JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return initialRegisteredAccounts;
  });

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("unicare_registered_accounts", JSON.stringify(registeredAccounts));
  }, [registeredAccounts]);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const response = await api.post("/auth/login", { email: cleanEmail, password });
      const { token: resToken, user: resUser } = response.data;
      localStorage.setItem("token", resToken);
      localStorage.setItem("user", JSON.stringify(resUser));
      setToken(resToken);
      setUser(resUser);
      return { success: true, user: resUser };
    } catch (error) {
      // Backend error or offline fallback - check registered accounts
      const foundAccount = registeredAccounts.find(
        (acc) => acc.email.trim().toLowerCase() === cleanEmail
      );

      if (!foundAccount) {
        return {
          success: false,
          message: "Account not found. Please check your email or sign up first!",
        };
      }

      if (foundAccount.password && foundAccount.password !== password) {
        return {
          success: false,
          message: "Incorrect password. Please try again.",
        };
      }

      const loggedUser = {
        id: foundAccount.id,
        name: foundAccount.name,
        email: foundAccount.email,
        role: foundAccount.role || "patient",
        hospitalDetails: foundAccount.hospitalDetails || null,
      };

      const demoToken = "token-" + foundAccount.id;
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setToken(demoToken);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    }
  };

  const register = async (name, email, password, role = "patient", hospitalDetails = null) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check if already registered
    const existing = registeredAccounts.find(
      (acc) => acc.email.trim().toLowerCase() === cleanEmail
    );
    if (existing) {
      return {
        success: false,
        message: "Email is already registered! Please log in instead.",
      };
    }

    try {
      const payload = {
        name,
        email: cleanEmail,
        password,
        role,
        ...(role === "hospital" && hospitalDetails ? { hospitalDetails } : {}),
      };
      const response = await api.post("/auth/register", payload);
      const { token: resToken, user: resUser } = response.data;

      const newAcc = {
        id: resUser.id,
        name,
        email: cleanEmail,
        password,
        role,
        hospitalDetails,
      };
      setRegisteredAccounts((prev) => [...prev, newAcc]);

      localStorage.setItem("token", resToken);
      localStorage.setItem("user", JSON.stringify(resUser));
      setToken(resToken);
      setUser(resUser);
      return { success: true, user: resUser };
    } catch (error) {
      const newUserId = (role === "hospital" ? "hosp-" : "user-") + Date.now();
      const newUser = {
        id: newUserId,
        name: name || (role === "hospital" ? "Hospital Partner" : "User"),
        email: cleanEmail,
        role,
        hospitalDetails,
      };
      const newAcc = {
        id: newUserId,
        name: newUser.name,
        email: cleanEmail,
        password,
        role,
        hospitalDetails,
      };

      setRegisteredAccounts((prev) => [...prev, newAcc]);

      const demoToken = "token-" + newUserId;
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(demoToken);
      setUser(newUser);
      return { success: true, user: newUser };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isHospital: user?.role === "hospital",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
