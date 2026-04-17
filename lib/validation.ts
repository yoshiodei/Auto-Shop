// Form validation utilities
// Provides validation functions for various form inputs

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one uppercase, one number)
export const validatePassword = (password: string): boolean => {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

// Phone number validation (basic international format)
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate sign up form
export const validateSignUp = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  location?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters',
    });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address',
    });
  }

  if (!data.password || !validatePassword(data.password)) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters with uppercase and number',
    });
  }

  if (data.password !== data.confirmPassword) {
    errors.push({
      field: 'confirmPassword',
      message: 'Passwords do not match',
    });
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Invalid phone number',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate sign in form
export const validateSignIn = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email address',
    });
  }

  if (!data.password || data.password.length === 0) {
    errors.push({
      field: 'password',
      message: 'Password is required',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate vehicle posting form
export const validateVehiclePosting = (data: {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  location: string;
  condition: string;
  transmission: string;
  fuelType: string;
  engine: string;
  seats: number;
  description: string;
  features: string[];
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.title || data.title.trim().length < 5) {
    errors.push({
      field: 'title',
      message: 'Title must be at least 5 characters',
    });
  }

  if (!data.brand || data.brand.trim().length === 0) {
    errors.push({
      field: 'brand',
      message: 'Brand is required',
    });
  }

  if (!data.model || data.model.trim().length === 0) {
    errors.push({
      field: 'model',
      message: 'Model is required',
    });
  }

  const currentYear = new Date().getFullYear();
  if (!data.year || data.year < 1980 || data.year > currentYear + 1) {
    errors.push({
      field: 'year',
      message: `Year must be between 1980 and ${currentYear + 1}`,
    });
  }

  if (!data.price || data.price <= 0) {
    errors.push({
      field: 'price',
      message: 'Price must be greater than 0',
    });
  }

  if (!data.mileage || data.mileage.trim().length === 0) {
    errors.push({
      field: 'mileage',
      message: 'Mileage is required',
    });
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.push({
      field: 'location',
      message: 'Location is required',
    });
  }

  if (!data.condition || !['new', 'pre-owned'].includes(data.condition)) {
    errors.push({
      field: 'condition',
      message: 'Please select a valid condition',
    });
  }

  if (!data.transmission || !['manual', 'automatic', 'electric'].includes(data.transmission)) {
    errors.push({
      field: 'transmission',
      message: 'Please select a valid transmission',
    });
  }

  if (!data.fuelType || !['petrol', 'diesel', 'electric', 'hybrid'].includes(data.fuelType)) {
    errors.push({
      field: 'fuelType',
      message: 'Please select a valid fuel type',
    });
  }

  if (!data.engine || data.engine.trim().length === 0) {
    errors.push({
      field: 'engine',
      message: 'Engine information is required',
    });
  }

  if (!data.seats || data.seats < 1 || data.seats > 10) {
    errors.push({
      field: 'seats',
      message: 'Seats must be between 1 and 10',
    });
  }

  if (!data.description || data.description.trim().length < 20) {
    errors.push({
      field: 'description',
      message: 'Description must be at least 20 characters',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate message form
export const validateMessage = (text: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!text || text.trim().length === 0) {
    errors.push({
      field: 'message',
      message: 'Message cannot be empty',
    });
  }

  if (text.length > 5000) {
    errors.push({
      field: 'message',
      message: 'Message cannot exceed 5000 characters',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate profile update form
export const validateProfileUpdate = (data: {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  if (data.name && data.name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters',
    });
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.push({
      field: 'phone',
      message: 'Invalid phone number',
    });
  }

  if (data.bio && data.bio.length > 500) {
    errors.push({
      field: 'bio',
      message: 'Bio cannot exceed 500 characters',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Get error message for field
export const getFieldError = (errors: ValidationError[], fieldName: string): string => {
  const error = errors.find((e) => e.field === fieldName);
  return error?.message || '';
};

// Check if field has error
export const hasFieldError = (errors: ValidationError[], fieldName: string): boolean => {
  return errors.some((e) => e.field === fieldName);
};
