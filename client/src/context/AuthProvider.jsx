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
        // Make a request to the server to check if the user is authenticated
        const res = await axios.get(`${BASE_URL}/api/auth/check-auth`, {
          withCredentials: true,
        });

        setUser(res.data.user);
      } catch (error) {
        setUser(null);
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };
    // Call the authentication check function
    checkAuth();
  }, []);

  // Function to log in the user by setting the user state
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out the user by clearing the user state and making a logout request to the server
  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
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
