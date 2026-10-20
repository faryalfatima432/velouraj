import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      setLoading(false);
      return;
    }

    const getCurrentUser = async () => {
      try {
        const response = await API.get("/users/profile");

        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
          );
        }
      } catch (error) {
        console.error(
          "AUTH CHECK ERROR:",
          error.response?.data?.message || error.message
        );

        localStorage.removeItem("userToken");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const register = async (formData) => {
    const response = await API.post(
      "/auth/register",
      formData
    );

    if (response.data.requiresVerification) {
      return response.data;
    }

    const { token, user } = response.data;

    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return response.data;
  };

  const login = async (formData) => {
    const response = await API.post(
      "/auth/login",
      formData
    );

    const { token, user } = response.data;

    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}