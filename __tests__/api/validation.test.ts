import { Request, Response, NextFunction } from 'express';
import { validateRegistration } from '../../api/middleware/validation';

describe('API Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('validateRegistration', () => {
    it('should pass validation with valid data', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should reject when firstName is missing', () => {
      mockRequest.body = {
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'firstName',
            message: 'First name is required',
          }),
        ]),
      });
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should reject when firstName is too short', () => {
      mockRequest.body = {
        firstName: 'J',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'firstName',
            message: 'First name must be at least 2 characters',
          }),
        ]),
      });
    });

    it('should reject when lastName is missing', () => {
      mockRequest.body = {
        firstName: 'John',
        email: 'john.doe@gmail.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'lastName',
            message: 'Last name is required',
          }),
        ]),
      });
    });

    it('should reject when email is not Gmail', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@yahoo.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'Only Gmail addresses are accepted',
          }),
        ]),
      });
    });

    it('should reject test@gmail.com as already registered', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@gmail.com',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'email',
            message: 'This email address is already registered',
          }),
        ]),
      });
    });

    it('should reject when password is too short', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Pass1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must be at least 8 characters',
          }),
        ]),
      });
    });

    it('should reject when password is too long', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1!Password1!Password1!1',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must not exceed 30 characters',
          }),
        ]),
      });
    });

    it('should reject when password has no uppercase letter', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one uppercase letter',
          }),
        ]),
      });
    });

    it('should reject when password has no lowercase letter', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'PASSWORD1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one lowercase letter',
          }),
        ]),
      });
    });

    it('should reject when password has no number', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one number',
          }),
        ]),
      });
    });

    it('should reject when password has no special character', () => {
      mockRequest.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@gmail.com',
        password: 'Password1',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one special character',
          }),
        ]),
      });
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      mockRequest.body = {
        firstName: 'J',
        lastName: 'D',
        email: 'invalid-email',
        password: 'short',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ field: 'firstName' }),
          expect.objectContaining({ field: 'lastName' }),
          expect.objectContaining({ field: 'email' }),
          expect.objectContaining({ field: 'password' }),
        ]),
      });
    });

    it('should trim whitespace from valid inputs', () => {
      mockRequest.body = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        email: '  john.doe@gmail.com  ',
        password: 'Password1!',
      };

      validateRegistration(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.body.firstName).toBe('John');
      expect(mockRequest.body.lastName).toBe('Doe');
      expect(mockRequest.body.email).toBe('john.doe@gmail.com');
      expect(nextFunction).toHaveBeenCalled();
    });
  });
});
