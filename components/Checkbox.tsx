import React from 'react';

interface CheckboxProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  label: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  onBlur,
  label,
  error,
  touched,
  required,
}) => {
  const hasError = touched && error;

  return (
    <div className="checkbox-wrapper">
      <div className="checkbox-container">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          className={`checkbox ${hasError ? 'checkbox-error' : ''}`}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
        <label htmlFor={id} className="checkbox-label">
          {label}
        </label>
      </div>
      {hasError && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
