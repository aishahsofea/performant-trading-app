/**
 * Email validation utility functions
 */

export type EmailValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Validates an email address with comprehensive checks
 */
export const validateEmail = (email: string): EmailValidationResult => {
  if (!email) {
    return {
      isValid: false,
      error: "Email address is required"
    };
  }

  if (typeof email !== 'string') {
    return {
      isValid: false,
      error: "Email must be a string"
    };
  }

  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      isValid: false,
      error: "Email address is required"
    };
  }

  // Basic email format validation
  if (!trimmedEmail.includes("@")) {
    return {
      isValid: false,
      error: "Please enter a valid email address"
    };
  }

  // More comprehensive email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: "Please enter a valid email address"
    };
  }

  // Check for reasonable email length
  if (trimmedEmail.length > 254) {
    return {
      isValid: false,
      error: "Email address is too long"
    };
  }

  return {
    isValid: true
  };
};

/**
 * Normalizes an email address (lowercase and trim)
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Combined validation and normalization
 */
export const validateAndNormalizeEmail = (email: string): { 
  isValid: boolean; 
  normalizedEmail?: string; 
  error?: string; 
} => {
  const validation = validateEmail(email);
  
  if (!validation.isValid) {
    return {
      isValid: false,
      error: validation.error
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalizeEmail(email)
  };
};