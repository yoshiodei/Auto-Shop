type RegisterCredentials = {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  password: string;
  confirmPassword: string;
};

export const validateRegisterCredentials = (credentials: RegisterCredentials): { isValid: boolean; error: string | null } => {
  const { fullName, email, phone, password, confirmPassword } = credentials;

  if (!fullName.trim())                        return {isValid: false, error: "Full name is required."};
  if (fullName.trim().length < 3)              return {isValid: false, error: "Full name must be at least 3 characters."};
  if (!email.trim())                           return {isValid: false, error: "Email is required."};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {isValid: false, error: "Enter a valid email address."};
  if (phone && !/^\+?[0-9\s\-]{7,15}$/.test(phone)) return {isValid: false, error: "Enter a valid phone number."};
  if (!password)                               return {isValid: false, error: "Password is required."};
  if (password.length < 6)                     return {isValid: false, error: "Password must be at least 6 characters."};
  if (password !== confirmPassword)            return {isValid: false, error: "Passwords do not match."};

  return {isValid: true, error: null}; // no errors
};