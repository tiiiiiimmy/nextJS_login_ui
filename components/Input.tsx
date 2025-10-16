import React from 'react';

interface InputProps {
  type: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  required,
  autoComplete,
}) => {
  const hasError = touched && error;

  return (
    <div className="input-wrapper">
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`input ${hasError ? 'input-error' : ''}`}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {hasError && (
        <span id={`${id}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
