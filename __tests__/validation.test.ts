import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
} from '@/lib/validation';

describe('validateFirstName', () => {
  it('should return error for empty first name', () => {
    const result = validateFirstName('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('First name is required');
  });

  it('should return error for first name less than 2 characters', () => {
    const result = validateFirstName('A');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('First name must be at least 2 characters');
  });

  it('should return valid for valid first name', () => {
    const result = validateFirstName('John');
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

describe('validateLastName', () => {
  it('should return error for empty last name', () => {
    const result = validateLastName('');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Last name is required');
  });

  it('should return error for last name less than 2 characters', () => {
    const result = validateLastName('D');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Last name must be at least 2 characters');
  });

  it('should return valid for valid last name', () => {
    const result = validateLastName('Doe');
    expect(result.isValid).toBe(true);
    expect(result.message).toBeUndefined();
  });
});

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

  it('should return error for non-Gmail addresses', () => {
    const nonGmailEmails = [
      'test@example.com',
      'user.name@yahoo.com',
      'user+tag@outlook.com',
      'test@hotmail.com',
    ];
    nonGmailEmails.forEach((email) => {
      const result = validateEmail(email);
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Only Gmail addresses are accepted');
    });
  });

  it('should return error for test@gmail.com (already registered)', () => {
    const result = validateEmail('test@gmail.com');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('This email address is already registered');
  });

  it('should return valid for other Gmail addresses', () => {
    const validGmailEmails = [
      'user@gmail.com',
      'user.name@gmail.com',
      'user+tag@gmail.com',
      'another.user@gmail.com',
    ];
    validGmailEmails.forEach((email) => {
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
    expect(result.message).toBe('Password must be at least 8 characters');
  });

  it('should return error for password more than 30 characters', () => {
    const result = validatePassword('Password1!Password1!Password1!1');
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Password must not exceed 30 characters');
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
    const validPasswords = ['Password1!', 'MyP@ssw0rd', 'Secur3#Pass', 'Test123!'];
    validPasswords.forEach((password) => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
      expect(result.message).toBeUndefined();
    });
  });
});
