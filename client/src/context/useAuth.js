import { useContext } from "react";
import { AuthContext } from "./auth-context";

// Custom hook to access authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
