import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

// Component to protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // If still loading authentication status, return null to avoid rendering
  if (loading) return null;
  // If no user is authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
