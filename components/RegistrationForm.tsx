'use client';

import React, { useState } from 'react';
import { Input } from './Input';
import { Checkbox } from './Checkbox';
import { FormData, FieldError, FormState } from '@/lib/types';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDateOfBirth,
  validateTerms,
} from '@/lib/validation';

const initialFormData: FormData = {
  email: '',
  password: '',
  confirmPassword: '',
  dateOfBirth: '',
  termsAccepted: false,
};

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FieldError>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(new Set());
  const [formState, setFormState] = useState<FormState>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: keyof FormData, value: string | boolean): string | undefined => {
    let result;

    switch (name) {
      case 'email':
        result = validateEmail(value as string);
        break;
      case 'password':
        result = validatePassword(value as string);
        break;
      case 'confirmPassword':
        result = validateConfirmPassword(formData.password, value as string);
        break;
      case 'dateOfBirth':
        result = validateDateOfBirth(value as string);
        break;
      case 'termsAccepted':
        result = validateTerms(value as boolean);
        break;
      default:
        return undefined;
    }

    return result.isValid ? undefined : result.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof FormData;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));

    // Validate on change if field has been touched
    if (touchedFields.has(fieldName)) {
      const error = validateField(fieldName, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }

    // Also revalidate confirmPassword when password changes
    if (fieldName === 'password' && touchedFields.has('confirmPassword')) {
      const confirmError = validateConfirmPassword(value, formData.confirmPassword);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError.isValid ? undefined : confirmError.message,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name as keyof FormData;
    const fieldValue = type === 'checkbox' ? checked : value;

    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(fieldName));

    // Validate on blur
    const error = validateField(fieldName, fieldValue);
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FieldError = {};
    let hasErrors = false;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    setTouchedFields(new Set(Object.keys(formData) as Array<keyof FormData>));

    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setFormState('idle');

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      setFormState('failure');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    try {
      // Show warning state (simulating processing)
      setFormState('warning');

      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success (90% success rate)
      if (Math.random() > 0.1) {
        setFormState('success');
        // Reset form on success
        setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          setTouchedFields(new Set());
          setFormState('idle');
        }, 3000);
      } else {
        // Simulate server error
        setFormState('failure');
        setErrors({
          email: 'This email is already registered',
        });
      }
    } catch (error) {
      setFormState('failure');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyErrors = Object.values(errors).some((error) => error !== undefined);

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Create Your Account</h1>
        <p className="form-subtitle">Join us today and get started</p>

        <form onSubmit={handleSubmit} className="registration-form" noValidate>
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
              error={errors.email}
              touched={touchedFields.has('email')}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password <span className="required">*</span>
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
              error={errors.password}
              touched={touchedFields.has('password')}
              required
              autoComplete="new-password"
            />
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul className="requirements-list">
                <li className={/[A-Z]/.test(formData.password) ? 'requirement-met' : ''}>
                  At least one uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'requirement-met' : ''}>
                  At least one lowercase letter
                </li>
                <li className={/[0-9]/.test(formData.password) ? 'requirement-met' : ''}>
                  At least one number
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'requirement-met' : ''}>
                  At least one special character
                </li>
                <li className={formData.password.length >= 8 ? 'requirement-met' : ''}>
                  At least 8 characters long
                </li>
              </ul>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password <span className="required">*</span>
            </label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
              touched={touchedFields.has('confirmPassword')}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-field">
            <label htmlFor="dateOfBirth" className="form-label">
              Date of Birth <span className="required">*</span>
            </label>
            <Input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.dateOfBirth}
              touched={touchedFields.has('dateOfBirth')}
              required
              autoComplete="bday"
            />
          </div>

          <div className="form-field">
            <Checkbox
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              onBlur={handleBlur}
              label="I accept the terms and conditions"
              error={errors.termsAccepted}
              touched={touchedFields.has('termsAccepted')}
              required
            />
          </div>

          <div className={`form-status ${formState !== 'idle' ? `status-${formState}` : ''}`}>
            {formState === 'warning' && (
              <div className="status-message status-warning">
                <span className="status-icon">⏳</span>
                <span>Processing your registration...</span>
              </div>
            )}
            {formState === 'failure' && (
              <div className="status-message status-failure">
                <span className="status-icon">✕</span>
                <span>
                  {hasAnyErrors
                    ? 'Please fix the errors above and try again.'
                    : 'Registration failed. Please try again.'}
                </span>
              </div>
            )}
            {formState === 'success' && (
              <div className="status-message status-success">
                <span className="status-icon">✓</span>
                <span>Registration successful! Welcome aboard!</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? 'button-disabled' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="form-footer">
          Already have an account? <a href="#" className="form-link">Sign in</a>
        </p>
      </div>
    </div>
  );
};
