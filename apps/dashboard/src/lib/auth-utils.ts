import bcrypt from "bcryptjs";

/**
 * Validates email format using regex
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim() === "") return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Password validation result
 */
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Hashes password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verifies password against hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Form validation result
 */
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Login form data
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Validates login form data
 */
export function validateLoginForm(data: LoginFormData): FormValidation {
  const errors: Record<string, string> = {};

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Registration form data
 */
export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Validates registration form data
 */
export function validateRegistrationForm(
  data: RegistrationFormData
): FormValidation {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Name is required";
  }

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.errors[0] ?? ""; // Show first error
    }
  }

  if (!data.confirmPassword || data.confirmPassword.trim() === "") {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
