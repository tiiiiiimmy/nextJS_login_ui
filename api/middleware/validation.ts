import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate first name
 */
const validateFirstName = (firstName: string): string | null => {
  if (!firstName || typeof firstName !== 'string') {
    return 'First name is required';
  }

  const trimmed = firstName.trim();
  if (trimmed.length < 2) {
    return 'First name must be at least 2 characters';
  }

  if (trimmed.length > 100) {
    return 'First name must not exceed 100 characters';
  }

  return null;
};

/**
 * Validate last name
 */
const validateLastName = (lastName: string): string | null => {
  if (!lastName || typeof lastName !== 'string') {
    return 'Last name is required';
  }

  const trimmed = lastName.trim();
  if (trimmed.length < 2) {
    return 'Last name must be at least 2 characters';
  }

  if (trimmed.length > 100) {
    return 'Last name must not exceed 100 characters';
  }

  return null;
};

/**
 * Validate email (Gmail only)
 */
const validateEmail = (email: string): string | null => {
  if (!email || typeof email !== 'string') {
    return 'Email is required';
  }

  const trimmed = email.trim();

  // Basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }

  // Gmail only
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
  if (!gmailRegex.test(trimmed)) {
    return 'Only Gmail addresses are accepted';
  }

  // Check for test@gmail.com (already registered for demo)
  if (trimmed.toLowerCase() === 'test@gmail.com') {
    return 'This email address is already registered';
  }

  return null;
};

/**
 * Validate password
 */
const validatePassword = (password: string): string | null => {
  if (!password || typeof password !== 'string') {
    return 'Password is required';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  if (password.length > 30) {
    return 'Password must not exceed 30 characters';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }

  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }

  if (!hasNumber) {
    return 'Password must contain at least one number';
  }

  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }

  return null;
};

/**
 * Middleware to validate registration request
 */
export const validateRegistration = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { firstName, lastName, email, password } = req.body;

  const errors: ValidationError[] = [];

  // Validate each field
  const firstNameError = validateFirstName(firstName);
  if (firstNameError) {
    errors.push({ field: 'firstName', message: firstNameError });
  }

  const lastNameError = validateLastName(lastName);
  if (lastNameError) {
    errors.push({ field: 'lastName', message: lastNameError });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.push({ field: 'email', message: emailError });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.push({ field: 'password', message: passwordError });
  }

  // If there are validation errors, return them
  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      errors,
    });
    return;
  }

  // Trim the input values
  req.body.firstName = firstName.trim();
  req.body.lastName = lastName.trim();
  req.body.email = email.trim();

  next();
};
