import { describe, it, expect } from 'vitest'
import { authOptions } from '@/lib/auth'

describe('NextAuth.js Configuration', () => {
  it('should have auth options defined', () => {
    expect(authOptions).toBeDefined()
    expect(authOptions.providers).toBeDefined()
    expect(authOptions.pages).toBeDefined()
    expect(authOptions.callbacks).toBeDefined()
  })

  it('should have credentials provider configured', () => {
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    )
    expect(credentialsProvider).toBeDefined()
    expect(credentialsProvider!.name).toBe('Credentials')
    expect(credentialsProvider!.type).toBe('credentials')
  })

  it('should have custom login page configured', () => {
    expect(authOptions.pages?.signIn).toBe('/auth/login')
  })

  it('should have JWT strategy configured', () => {
    expect(authOptions.session?.strategy).toBe('jwt')
  })
})