import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Simple test to verify our setup works
describe('Auth Setup Test', () => {
  it('should run basic test', () => {
    expect(true).toBe(true)
  })

  it('should render simple component', () => {
    const TestComponent = () => <div>Hello Test</div>
    render(<TestComponent />)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })
})