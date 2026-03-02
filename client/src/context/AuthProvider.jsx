import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./auth-context";

// Use VITE_SERVER_URL from .env or default to localhost
const BASE_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

// AuthProvider component to manage authentication state and provide it to the app
const AuthProvider = ({ children }) => {
  // State to hold the authenticated user and loading status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("token");

        // If no token, user is not authenticated
        if (!token) {
          setLoading(false);
          return;
        }

        // Make API call to check authentication status
        const res = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // If successful, set the user data
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    // Call the authentication check function
    checkAuth();
  }, []);

  // Function to handle login, storing token and user data
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // Function to handle logout, clearing token and user data
  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  // Provide the authentication state and functions to the rest of the app
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
