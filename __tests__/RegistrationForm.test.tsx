import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '@/components/RegistrationForm';

// Mock fetch API
global.fetch = jest.fn();

describe('RegistrationForm', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (global.fetch as jest.Mock).mockClear();

    // Default mock response for successful registration with delay
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve({
              ok: true,
              json: async () => ({ success: true, data: { id: 1, email: 'test@gmail.com' } }),
            }),
          100
        )
      )
    );
  });
  it('should render all form fields', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('should show validation error for empty first name on blur', async () => {
    render(<RegistrationForm />);
    const firstNameInput = screen.getByLabelText(/first name/i);

    fireEvent.blur(firstNameInput);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for empty last name on blur', async () => {
    render(<RegistrationForm />);
    const lastNameInput = screen.getByLabelText(/last name/i);

    fireEvent.blur(lastNameInput);

    await waitFor(() => {
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email on blur', async () => {
    render(<RegistrationForm />);
    const emailInput = screen.getByLabelText(/email address/i);

    await userEvent.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for non-Gmail address', async () => {
    render(<RegistrationForm />);
    const emailInput = screen.getByLabelText(/email address/i);

    await userEvent.type(emailInput, 'test@yahoo.com');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/only gmail addresses are accepted/i)).toBeInTheDocument();
    });
  });

  it('should show error for test@gmail.com as already registered', async () => {
    render(<RegistrationForm />);
    const emailInput = screen.getByLabelText(/email address/i);

    await userEvent.type(emailInput, 'test@gmail.com');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/this email address is already registered/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for weak password on blur', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(passwordInput, 'weak');
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for password over 30 characters', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(passwordInput, 'Password1!Password1!Password1!1');
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must not exceed 30 characters/i)).toBeInTheDocument();
    });
  });

  it('should update password requirements indicators in real-time as user types', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(passwordInput, 'P');
    expect(screen.getByText(/at least one uppercase letter/i)).toHaveClass('requirement-met');

    await userEvent.type(passwordInput, 'a');
    expect(screen.getByText(/at least one lowercase letter/i)).toHaveClass('requirement-met');

    await userEvent.type(passwordInput, '1');
    expect(screen.getByText(/at least one number/i)).toHaveClass('requirement-met');

    await userEvent.type(passwordInput, '!');
    expect(screen.getByText(/at least one special character/i)).toHaveClass('requirement-met');

    await userEvent.type(passwordInput, 'sswo');
    expect(screen.getByText(/between 8 and 30 characters/i)).toHaveClass('requirement-met');
  });

  it('should show error when trying to submit with empty fields', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should show failure state on validation errors', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please check the information above and try again/i)).toBeInTheDocument();
    });
  });

  it('should show warning state during form submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/processing your registration/i)).toBeInTheDocument();
    });
  });

  it('should show success state on successful submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/your account has been created successfully/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should disable submit button during submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(firstNameInput, 'John');
    await userEvent.type(lastNameInput, 'Doe');
    await userEvent.type(emailInput, 'john@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it('should accept valid Gmail addresses', async () => {
    render(<RegistrationForm />);
    const emailInput = screen.getByLabelText(/email address/i);

    await userEvent.type(emailInput, 'valid.user@gmail.com');
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.queryByText(/only gmail addresses are accepted/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
    });
  });

  it('should validate all password requirements correctly', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);

    // Test password with all requirements
    await userEvent.type(passwordInput, 'ValidPass1!');
    fireEvent.blur(passwordInput);

    // Check that all requirements are met (no error message, all requirements shown as met)
    await waitFor(() => {
      const allRequirements = screen.getAllByRole('listitem');
      allRequirements.forEach((item) => {
        expect(item).toHaveClass('requirement-met');
      });
    });
  });
});
