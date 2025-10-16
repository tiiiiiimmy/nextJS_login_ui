export type FormState = 'idle' | 'warning' | 'failure' | 'success';

export interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  termsAccepted: boolean;
}

export interface FieldError {
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  termsAccepted?: string;
}

export interface FormStateData {
  state: FormState;
  errors: FieldError;
  touchedFields: Set<keyof FormData>;
}
