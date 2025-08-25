import { validateEmail } from "@/lib/email-validation";

/**
 * Client-side hook for email validation
 */
export const useEmailValidation = () => {
  const validateAndSetError = (
    email: string,
    setError: (error: string) => void
  ): boolean => {
    const validation = validateEmail(email);
    
    if (!validation.isValid && validation.error) {
      setError(validation.error);
      return false;
    }
    
    return true;
  };

  return {
    validateEmail,
    validateAndSetError
  };
};