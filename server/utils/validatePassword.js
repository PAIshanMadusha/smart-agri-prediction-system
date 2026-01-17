export const ValidatePassword = (password) => {
  // Minimum six characters, at least one uppercase letter, one lowercase letter, and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};
