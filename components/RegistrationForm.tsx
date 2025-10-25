"use client";

import React, { useState } from "react";
import { Input } from "./Input";
import { FormData, FieldError, FormState } from "@/lib/types";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FieldError>({});
  const [touchedFields, setTouchedFields] = useState<Set<keyof FormData>>(
    new Set()
  );
  const [formState, setFormState] = useState<FormState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (
    name: keyof FormData,
    value: string
  ): string | undefined => {
    let result;

    switch (name) {
      case "firstName":
        result = validateFirstName(value);
        break;
      case "lastName":
        result = validateLastName(value);
        break;
      case "email":
        result = validateEmail(value);
        break;
      case "password":
        result = validatePassword(value);
        break;
      default:
        return undefined;
    }

    return result.isValid ? undefined : result.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Validate on change if field has been touched
    if (touchedFields.has(fieldName)) {
      const error = validateField(fieldName, value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;

    // Mark field as touched
    setTouchedFields((prev) => new Set(prev).add(fieldName));

    // Validate on blur
    const error = validateField(fieldName, value);
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
    setFormState("idle");

    // Validate all fields
    const isValid = validateForm();

    if (!isValid) {
      setFormState("failure");
      setIsSubmitting(false);
      return;
    }

    // Call the real API
    try {
      // Show warning state (processing)
      setFormState("warning");

      const response = await fetch(
        "http://localhost:5001/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        setFormState("success");
        // Reset form on success
        setTimeout(() => {
          setFormData(initialFormData);
          setErrors({});
          setTouchedFields(new Set());
          setFormState("idle");
        }, 3000);
      } else {
        // Handle validation errors from API
        setFormState("failure");
        if (data.errors && Array.isArray(data.errors)) {
          const newErrors: FieldError = {};
          data.errors.forEach((error: { field: string; message: string }) => {
            newErrors[error.field as keyof FormData] = error.message;
          });
          setErrors(newErrors);
        } else {
          setErrors({
            email: "An error occurred during registration",
          });
        }
      }
    } catch {
      // Network or other error
      setFormState("failure");
      setErrors({
        email: "Unable to connect to server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasAnyErrors = Object.values(errors).some(
    (err) => err !== undefined
  );

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="logo-container">
          <svg
            className="logo"
            viewBox="0 0 647 647"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#000000"
              d="M40.44,647h566.13c22.33,0,40.44-18.1,40.44-40.44H0c0,22.33,18.1,40.44,40.44,40.44ZM564.65,324.98H82.35c0,13.27,1.09,26.27,3.15,38.96H0v40.44h95.75c5.21,14.95,11.86,29.24,19.77,42.68H0v40.44h145.35c13.19,14.45,28.12,27.29,44.46,38.19H0v40.44h647v-40.44h-189.81c16.33-10.9,31.26-23.74,44.46-38.19h145.35v-40.44h-115.51c7.91-13.45,14.55-27.73,19.77-42.68h95.75v-40.44h-85.5c2.06-12.68,3.15-25.69,3.15-38.96ZM606.56,0H40.44C18.1,0,0,18.1,0,40.44v283.06h82.37c.8-132.5,108.44-239.67,241.13-239.67s240.33,107.17,241.13,239.67h82.37V40.44c0-22.33-18.1-40.44-40.44-40.44Z"
            />
          </svg>
          <span className="logo-text">Goldenset</span>
        </div>
        <h1 className="form-title">Create Your Account</h1>
        <p className="form-subtitle">
          Join us and unlock the full potential of your content
        </p>

        <form onSubmit={handleSubmit} className="registration-form" noValidate>
          <div className="form-field">
            <label htmlFor="firstName" className="form-label">
              First Name <span className="required">*</span>
            </label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John"
              error={errors.firstName}
              touched={touchedFields.has("firstName")}
              required
              autoComplete="given-name"
            />
          </div>

          <div className="form-field">
            <label htmlFor="lastName" className="form-label">
              Last Name <span className="required">*</span>
            </label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Doe"
              error={errors.lastName}
              touched={touchedFields.has("lastName")}
              required
              autoComplete="family-name"
            />
          </div>

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
              placeholder="you@gmail.com"
              error={errors.email}
              touched={touchedFields.has("email")}
              required
              autoComplete="email"
            />
            <p className="field-hint">
              Please use your Gmail address for registration
            </p>
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
              touched={touchedFields.has("password")}
              required
              autoComplete="new-password"
            />
            <div className="password-requirements">
              <p className="requirements-title">Password must contain:</p>
              <ul className="requirements-list">
                <li
                  className={
                    /[A-Z]/.test(formData.password) ? "requirement-met" : ""
                  }
                >
                  At least one uppercase letter
                </li>
                <li
                  className={
                    /[a-z]/.test(formData.password) ? "requirement-met" : ""
                  }
                >
                  At least one lowercase letter
                </li>
                <li
                  className={
                    /[0-9]/.test(formData.password) ? "requirement-met" : ""
                  }
                >
                  At least one number
                </li>
                <li
                  className={
                    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "requirement-met"
                      : ""
                  }
                >
                  At least one special character
                </li>
                <li
                  className={
                    formData.password.length >= 8 &&
                    formData.password.length <= 30
                      ? "requirement-met"
                      : ""
                  }
                >
                  Between 8 and 30 characters
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`form-status ${
              formState !== "idle" ? `status-${formState}` : ""
            }`}
          >
            {formState === "warning" && (
              <div className="status-message status-warning">
                <span className="status-icon">⏳</span>
                <span>Processing your registration...</span>
              </div>
            )}
            {formState === "failure" && (
              <div className="status-message status-failure">
                <span className="status-icon">✕</span>
                <span>
                  {hasAnyErrors
                    ? "Please check the information above and try again."
                    : "Registration failed. Please try again."}
                </span>
              </div>
            )}
            {formState === "success" && (
              <div className="status-message status-success">
                <span className="status-icon">✓</span>
                <span>
                  Welcome to Goldenset! Your account has been created
                  successfully!
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className={`submit-button ${isSubmitting ? "button-disabled" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="form-footer">
          By creating an account, you agree to Goldenset&apos;s Terms of Service
          and Privacy Policy.
        </p>
      </div>
    </div>
  );
};
