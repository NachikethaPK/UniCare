import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

const initialRegisteredAccounts = [
  {
    id: "demo-user-123",
    name: "Chandrika Sharma",
    email: "chandrika@example.com",
    password: "password123",
  },
];

export function AuthProvider({ children }) {
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    const saved = localStorage.getItem("unicare_registered_accounts");
    return saved ? JSON.parse(saved) : initialRegisteredAccounts;
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
      return { success: true };
    } catch (error) {
      // Backend error or offline fallback - strictly check registered accounts!
      const foundAccount = registeredAccounts.find(
        (acc) => acc.email.trim().toLowerCase() === cleanEmail
      );

      if (!foundAccount) {
        return {
          success: false,
          message: "Account not found. Only signed-up users can log in. Please sign up first!",
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
      };

      const demoToken = "token-" + foundAccount.id;
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setToken(demoToken);
      setUser(loggedUser);
      return { success: true };
    }
  };

  const register = async (name, email, password) => {
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
      const response = await api.post("/auth/register", { name, email: cleanEmail, password });
      const { token: resToken, user: resUser } = response.data;
      
      const newAcc = { id: resUser.id, name, email: cleanEmail, password };
      setRegisteredAccounts((prev) => [...prev, newAcc]);

      localStorage.setItem("token", resToken);
      localStorage.setItem("user", JSON.stringify(resUser));
      setToken(resToken);
      setUser(resUser);
      return { success: true };
    } catch (error) {
      const newUserId = "user-" + Date.now();
      const newUser = { id: newUserId, name: name || "User", email: cleanEmail };
      const newAcc = { id: newUserId, name: name || "User", email: cleanEmail, password };

      setRegisteredAccounts((prev) => [...prev, newAcc]);

      const demoToken = "token-" + newUserId;
      localStorage.setItem("token", demoToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(demoToken);
      setUser(newUser);
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
