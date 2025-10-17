export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateFirstName = (firstName: string): ValidationResult => {
  if (!firstName) {
    return { isValid: false, message: 'First name is required' };
  }

  if (firstName.trim().length < 2) {
    return { isValid: false, message: 'First name must be at least 2 characters' };
  }

  return { isValid: true };
};

export const validateLastName = (lastName: string): ValidationResult => {
  if (!lastName) {
    return { isValid: false, message: 'Last name is required' };
  }

  if (lastName.trim().length < 2) {
    return { isValid: false, message: 'Last name must be at least 2 characters' };
  }

  return { isValid: true };
};

export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  // Only accept Gmail addresses
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(email)) {
    return { isValid: false, message: 'Only Gmail addresses are accepted' };
  }

  // Check for already registered email
  if (email.toLowerCase() === 'test@gmail.com') {
    return { isValid: false, message: 'This email address is already registered' };
  }

  return { isValid: true };
};

export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }

  if (password.length > 30) {
    return { isValid: false, message: 'Password must not exceed 30 characters' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (!hasNumber) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};
