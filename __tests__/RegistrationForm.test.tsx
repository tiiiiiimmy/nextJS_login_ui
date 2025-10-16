import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegistrationForm } from '@/components/RegistrationForm';

describe('RegistrationForm', () => {
  it('should render all form fields', () => {
    render(<RegistrationForm />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accept the terms/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
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

  it('should show validation error for weak password on blur', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);

    await userEvent.type(passwordInput, 'weak');
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when passwords do not match', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(passwordInput, 'Password1!');
    await userEvent.type(confirmPasswordInput, 'Password2!');
    fireEvent.blur(confirmPasswordInput);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should update password requirements indicators as user types', async () => {
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
    expect(screen.getByText(/at least 8 characters long/i)).toHaveClass('requirement-met');
  });

  it('should show error when trying to submit with empty fields', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must accept the terms and conditions/i)).toBeInTheDocument();
    });
  });

  it('should show failure state on validation errors', async () => {
    render(<RegistrationForm />);
    const submitButton = screen.getByRole('button', { name: /create account/i });

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fix the errors above and try again/i)).toBeInTheDocument();
    });
  });

  it('should show warning state during form submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const termsCheckbox = screen.getByLabelText(/accept the terms/i);

    await userEvent.type(emailInput, 'test@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');
    await userEvent.type(confirmPasswordInput, 'Password1!');
    await userEvent.type(dobInput, '1990-01-01');
    await userEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/processing your registration/i)).toBeInTheDocument();
    });
  });

  it('should show success state on successful submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const termsCheckbox = screen.getByLabelText(/accept the terms/i);

    await userEvent.type(emailInput, 'test@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');
    await userEvent.type(confirmPasswordInput, 'Password1!');
    await userEvent.type(dobInput, '1990-01-01');
    await userEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should disable submit button during submission', async () => {
    render(<RegistrationForm />);

    // Fill in valid form data
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const dobInput = screen.getByLabelText(/date of birth/i);
    const termsCheckbox = screen.getByLabelText(/accept the terms/i);

    await userEvent.type(emailInput, 'test@gmail.com');
    await userEvent.type(passwordInput, 'Password1!');
    await userEvent.type(confirmPasswordInput, 'Password1!');
    await userEvent.type(dobInput, '1990-01-01');
    await userEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  it('should validate date of birth for minimum age requirement', async () => {
    render(<RegistrationForm />);
    const dobInput = screen.getByLabelText(/date of birth/i);

    // Enter a date less than 18 years ago
    const date = new Date();
    date.setFullYear(date.getFullYear() - 17);
    await userEvent.type(dobInput, date.toISOString().split('T')[0]);
    fireEvent.blur(dobInput);

    await waitFor(() => {
      expect(screen.getByText(/you must be at least 18 years old/i)).toBeInTheDocument();
    });
  });

  it('should revalidate confirm password when password changes', async () => {
    render(<RegistrationForm />);
    const passwordInput = screen.getByLabelText(/^password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    // Set matching passwords
    await userEvent.type(passwordInput, 'Password1!');
    await userEvent.type(confirmPasswordInput, 'Password1!');
    fireEvent.blur(confirmPasswordInput);

    // Change password
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'DifferentPass1!');

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});
