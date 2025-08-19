import { describe, it, expect } from 'vitest'
import { 
  validateEmail, 
  validatePassword, 
  hashPassword, 
  verifyPassword,
  validateLoginForm,
  validateRegistrationForm
} from '@/lib/auth-utils'

describe('Auth Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true)
      expect(validateEmail('user123@subdomain.example.org')).toBe(true)
    })

    it('should return false for invalid email addresses', () => {
      expect(validateEmail('')).toBe(false)
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('user@.com')).toBe(false)
      expect(validateEmail('user space@domain.com')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should return valid for strong passwords', () => {
      const result = validatePassword('SecurePass123!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should require minimum length', () => {
      const result = validatePassword('short')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
    })

    it('should require at least one uppercase letter', () => {
      const result = validatePassword('lowercase123!')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should require at least one lowercase letter', () => {
      const result = validatePassword('UPPERCASE123!')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should require at least one number', () => {
      const result = validatePassword('NoNumbers!')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    it('should require at least one special character', () => {
      const result = validatePassword('NoSpecialChar123')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one special character')
    })

    it('should return multiple errors for weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hashes are typically 60 chars
    })

    it('should produce different hashes for the same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2) // Different salts should produce different hashes
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password against hash', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)
      
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password against hash', async () => {
      const password = 'testpassword123'
      const wrongPassword = 'wrongpassword456'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)
      
      expect(isValid).toBe(false)
    })
  })

  describe('validateLoginForm', () => {
    it('should validate correct login form data', () => {
      const formData = {
        email: 'user@example.com',
        password: 'SecurePass123!'
      }
      
      const result = validateLoginForm(formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should return errors for invalid login form data', () => {
      const formData = {
        email: 'invalid-email',
        password: ''
      }
      
      const result = validateLoginForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('Please enter a valid email address')
      expect(result.errors.password).toBe('Password is required')
    })
  })

  describe('validateRegistrationForm', () => {
    it('should validate correct registration form data', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!'
      }
      
      const result = validateRegistrationForm(formData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should require all fields', () => {
      const formData = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      
      const result = validateRegistrationForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('Name is required')
      expect(result.errors.email).toBe('Email is required')
      expect(result.errors.password).toBe('Password is required')
      expect(result.errors.confirmPassword).toBe('Please confirm your password')
    })

    it('should validate password confirmation match', () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass456!'
      }
      
      const result = validateRegistrationForm(formData)
      expect(result.isValid).toBe(false)
      expect(result.errors.confirmPassword).toBe('Passwords do not match')
    })
  })
})