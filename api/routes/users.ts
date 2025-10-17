import { Router, Request, Response } from 'express';
import { createUser, getAllUsers, deleteUserByEmail } from '../models/user';
import { validateRegistration } from '../middleware/validation';

const router = Router();

/**
 * POST /api/users/register
 * Register a new user
 */
router.post('/register', validateRegistration, async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = await createUser({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: user,
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(409).json({
        success: false,
        errors: [{ field: 'email', message: 'This email address is already registered' }],
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
    });
  }
});

/**
 * GET /api/users
 * Get all users (for testing/admin purposes)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching users',
    });
  }
});

/**
 * DELETE /api/users/:email
 * Delete a user by email (for testing purposes)
 */
router.delete('/:email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const deleted = await deleteUserByEmail(email);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Delete user error:', error);

    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting user',
    });
  }
});

export default router;
