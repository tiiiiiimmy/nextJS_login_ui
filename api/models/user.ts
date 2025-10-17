import { query } from '../db/connection';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Convert database user to response format (exclude password)
 */
const userToResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    createdAt: user.created_at,
  };
};

/**
 * Find a user by email
 */
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

/**
 * Create a new user
 */
export const createUser = async (input: CreateUserInput): Promise<UserResponse> => {
  // Check if user already exists
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash the password
  const hashedPassword = await hashPassword(input.password);

  // Insert the user
  const result = await query(
    `INSERT INTO users (first_name, last_name, email, password)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [
      input.firstName,
      input.lastName,
      input.email.toLowerCase(),
      hashedPassword,
    ]
  );

  const user = result.rows[0];
  return userToResponse(user);
};

/**
 * Get all users (for testing purposes - exclude password)
 */
export const getAllUsers = async (): Promise<UserResponse[]> => {
  const result = await query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows.map(userToResponse);
};

/**
 * Delete a user by email (for testing purposes)
 */
export const deleteUserByEmail = async (email: string): Promise<boolean> => {
  const result = await query(
    'DELETE FROM users WHERE email = $1',
    [email.toLowerCase()]
  );

  return (result.rowCount ?? 0) > 0;
};

/**
 * Verify password
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
