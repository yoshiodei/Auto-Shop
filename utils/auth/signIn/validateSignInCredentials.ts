type SignInCredentials = {
  email: string;
  password: string;
};

export const validateSignInCredentials = (credentials: SignInCredentials): string | null => {
  const { email, password } = credentials;

  if (!email.trim())                               return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  return "Enter a valid email address.";
  if (!password)                                   return "Password is required.";
  if (password.length < 6)                         return "Password must be at least 6 characters.";

  return null; // no errors
};