export type FormState = 'idle' | 'warning' | 'failure' | 'success';

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface FieldError {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface FormStateData {
  state: FormState;
  errors: FieldError;
  touchedFields: Set<keyof FormData>;
}
