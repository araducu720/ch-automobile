import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { FormErrorBoundary } from '@/components/ui/form-error-boundary'

function ThrowingChild(): React.ReactNode {
  throw new Error('Test crash')
}

describe('FormErrorBoundary', () => {
  // Suppress console.error for expected errors in tests
  const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  it('renders children when no error', () => {
    render(
      <FormErrorBoundary>
        <div>Hello</div>
      </FormErrorBoundary>,
    )
    expect(screen.getByText('Hello')).toBeTruthy()
  })

  it('renders fallback on error', () => {
    render(
      <FormErrorBoundary>
        <ThrowingChild />
      </FormErrorBoundary>,
    )
    expect(screen.getByText(/Fehler aufgetreten/)).toBeTruthy()
  })

  it('renders custom fallback message', () => {
    render(
      <FormErrorBoundary fallbackMessage="Custom error text">
        <ThrowingChild />
      </FormErrorBoundary>,
    )
    expect(screen.getByText('Custom error text')).toBeTruthy()
  })

  consoleSpy.mockRestore?.()
})
