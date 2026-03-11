export const generateResetPasswordTokenExpiry = () => {
  return new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
};
