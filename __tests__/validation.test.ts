import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDateOfBirth,
  validateTerms,
} from '@/lib/validation';

describe('validateEmail', () => {
  it('should return error for empty email', () => {
    const result = validateEmail('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Email is required');
  });

  it('should return error for invalid email format', () => {
    const invalidEmails = ['test', 'test@', 'test@domain', '@domain.com', 'test@.com'];
    invalidEmails.forEach((email) => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Please enter a valid email address');
    });
  });

  it('should return valid for correct email format', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.com',
      'user+tag@example.co.uk',
    ];
    validEmails.forEach((email) => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });
  });
});

describe('validatePassword', () => {
  it('should return error for empty password', () => {
    const result = validatePassword('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password is required');
  });

  it('should return error for password less than 8 characters', () => {
    const result = validatePassword('Pass1!');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must be at least 8 characters long');
  });

  it('should return error for password without uppercase letter', () => {
    const result = validatePassword('password1!');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must contain at least one uppercase letter');
  });

  it('should return error for password without lowercase letter', () => {
    const result = validatePassword('PASSWORD1!');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must contain at least one lowercase letter');
  });

  it('should return error for password without number', () => {
    const result = validatePassword('Password!');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must contain at least one number');
  });

  it('should return error for password without special character', () => {
    const result = validatePassword('Password1');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must contain at least one special character');
  });

  it('should return valid for password meeting all requirements', () => {
    const validPasswords = ['Password1!', 'MyP@ssw0rd', 'Secur3#Pass'];
    validPasswords.forEach((password) => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });
  });
});

describe('validateConfirmPassword', () => {
  it('should return error for empty confirm password', () => {
    const result = validateConfirmPassword('Password1!', '');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Please confirm your password');
  });

  it('should return error when passwords do not match', () => {
    const result = validateConfirmPassword('Password1!', 'Password2!');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Passwords do not match');
  });

  it('should return valid when passwords match', () => {
    const result = validateConfirmPassword('Password1!', 'Password1!');
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

describe('validateDateOfBirth', () => {
  it('should return error for empty date', () => {
    const result = validateDateOfBirth('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Date of birth is required');
  });

  it('should return error for invalid date format', () => {
    const result = validateDateOfBirth('invalid-date');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Please enter a valid date');
  });

  it('should return error for future date', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const result = validateDateOfBirth(futureDate.toISOString().split('T')[0]);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Date of birth must be in the past');
  });

  it('should return error for today\'s date', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = validateDateOfBirth(today);
    expect(result.isValid).toBe(false);
    // Today's date would make them 0 years old, which fails the age check
    expect(result.message).toBe('You must be at least 18 years old');
  });

  it('should return error for age less than 18', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 17);
    const result = validateDateOfBirth(date.toISOString().split('T')[0]);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('You must be at least 18 years old');
  });

  it('should return valid for date over 18 years ago', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 25);
    const result = validateDateOfBirth(date.toISOString().split('T')[0]);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });

  it('should return valid for someone exactly 18 years old', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    date.setDate(date.getDate() - 1); // One day past their 18th birthday
    const result = validateDateOfBirth(date.toISOString().split('T')[0]);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

describe('validateTerms', () => {
  it('should return error when terms are not accepted', () => {
    const result = validateTerms(false);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('You must accept the terms and conditions');
  });

  it('should return valid when terms are accepted', () => {
    const result = validateTerms(true);
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});
