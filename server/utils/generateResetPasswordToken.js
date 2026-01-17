import crypto from "crypto";

export const generateResetPasswordToken = () => {
  // Generate a secure random token
  return crypto.randomBytes(32).toString("hex");
};
