import request from 'supertest';
import app from '../../api/server';
import { deleteUserByEmail } from '../../api/models/user';

// Mock the database operations
jest.mock('../../api/models/user', () => ({
  createUser: jest.fn(),
  getAllUsers: jest.fn(),
  deleteUserByEmail: jest.fn(),
}));

const { createUser, getAllUsers } = require('../../api/models/user');

describe('User API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user with valid data', async () => {
      const mockUser = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        createdAt: new Date(),
      };

      createUser.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'Password1!',
        })
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Registration successful',
        data: expect.objectContaining({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
        }),
      });

      expect(createUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
      });
    });

    it('should return 400 for invalid first name', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'J',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'Password1!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'firstName',
            message: 'First name must be at least 2 characters',
          }),
        ])
      );

      expect(createUser).not.toHaveBeenCalled();
    });

    it('should return 400 for invalid last name', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'D',
          email: 'john.doe@gmail.com',
          password: 'Password1!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'lastName',
            message: 'Last name must be at least 2 characters',
          }),
        ])
      );
    });

    it('should return 400 for non-Gmail email', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@yahoo.com',
          password: 'Password1!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Only Gmail addresses are accepted',
          }),
        ])
      );
    });

    it('should return 400 for test@gmail.com', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'test@gmail.com',
          password: 'Password1!',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'This email address is already registered',
          }),
        ])
      );
    });

    it('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 409 when email already exists in database', async () => {
      createUser.mockRejectedValue(new Error('Email already registered'));

      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'existing@gmail.com',
          password: 'Password1!',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toEqual([
        {
          field: 'email',
          message: 'This email address is already registered',
        },
      ]);
    });

    it('should return 500 for database errors', async () => {
      createUser.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .post('/api/users/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          password: 'Password1!',
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An error occurred during registration');
    });

    it('should handle missing fields', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toHaveLength(4);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'firstName' }),
          expect.objectContaining({ field: 'lastName' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'password' }),
        ])
      );
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const mockUsers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@gmail.com',
          createdAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@gmail.com',
          createdAt: new Date(),
        },
      ];

      getAllUsers.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@gmail.com',
          }),
          expect.objectContaining({
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@gmail.com',
          }),
        ]),
      });
    });

    it('should return empty array when no users exist', async () => {
      getAllUsers.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });
    });

    it('should return 500 on database error', async () => {
      getAllUsers.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An error occurred while fetching users');
    });
  });

  describe('DELETE /api/users/:email', () => {
    it('should delete a user by email', async () => {
      deleteUserByEmail.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/users/john.doe@gmail.com')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'User deleted successfully',
      });

      expect(deleteUserByEmail).toHaveBeenCalledWith('john.doe@gmail.com');
    });

    it('should return 404 when user not found', async () => {
      deleteUserByEmail.mockResolvedValue(false);

      const response = await request(app)
        .delete('/api/users/nonexistent@gmail.com')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'User not found',
      });
    });

    it('should return 500 on database error', async () => {
      deleteUserByEmail.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/api/users/john.doe@gmail.com')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('An error occurred while deleting user');
    });
  });

  describe('Health Check', () => {
    it('should return 200 for health check', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'API is running',
        timestamp: expect.any(String),
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Route not found',
      });
    });
  });
});
