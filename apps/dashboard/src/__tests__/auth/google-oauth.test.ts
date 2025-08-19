import { describe, it, expect } from 'vitest'
import { authOptions } from '@/lib/auth'

describe('Google OAuth Configuration', () => {
  it('should have Google provider configured', () => {
    const googleProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'google'
    )
    
    expect(googleProvider).toBeDefined()
    expect(googleProvider!.name).toBe('Google')
    expect(googleProvider!.type).toBe('oauth')
  })

  it('should have required Google OAuth configuration', () => {
    const googleProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'google'
    ) as any
    
    expect(googleProvider).toBeDefined()
    expect(googleProvider!.wellKnown).toBe('https://accounts.google.com/.well-known/openid-configuration')
    expect(googleProvider!.authorization.params.scope).toBe('openid email profile')
    expect(googleProvider!.idToken).toBe(true)
  })

  it('should have both credentials and Google providers', () => {
    expect(authOptions.providers).toHaveLength(2)
    
    const providerIds = authOptions.providers.map((p: any) => p.id)
    expect(providerIds).toContain('credentials')
    expect(providerIds).toContain('google')
  })

  it('should have proper OAuth callback configuration', () => {
    // OAuth providers require additional callback configuration
    expect(authOptions.callbacks).toBeDefined()
    expect(authOptions.callbacks!.jwt).toBeDefined()
    expect(authOptions.callbacks!.session).toBeDefined()
  })
})