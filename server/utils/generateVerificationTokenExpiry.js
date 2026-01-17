export const generateVerificationTokenExpiry = () => {
  return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
};
