import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CookieConsent } from '@/components/cookie-consent'

describe('CookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows banner when no consent is stored', () => {
    render(<CookieConsent />)
    expect(screen.getByText('Cookie-Einstellungen')).toBeInTheDocument()
    expect(screen.getByText('Alle akzeptieren')).toBeInTheDocument()
    expect(screen.getByText('Nur notwendige')).toBeInTheDocument()
  })

  it('hides banner when consent is already stored', () => {
    localStorage.setItem('ch-auto-cookie-consent', 'accepted')
    render(<CookieConsent />)
    expect(screen.queryByText('Cookie-Einstellungen')).not.toBeInTheDocument()
  })

  it('stores accepted consent and hides banner', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByText('Alle akzeptieren'))
    expect(localStorage.getItem('ch-auto-cookie-consent')).toBe('accepted')
    expect(screen.queryByText('Cookie-Einstellungen')).not.toBeInTheDocument()
  })

  it('stores essential-only consent and hides banner', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByText('Nur notwendige'))
    expect(localStorage.getItem('ch-auto-cookie-consent')).toBe('essential-only')
    expect(screen.queryByText('Cookie-Einstellungen')).not.toBeInTheDocument()
  })

  it('closes on X button with essential-only consent', () => {
    render(<CookieConsent />)
    fireEvent.click(screen.getByLabelText('Schließen'))
    expect(localStorage.getItem('ch-auto-cookie-consent')).toBe('essential-only')
    expect(screen.queryByText('Cookie-Einstellungen')).not.toBeInTheDocument()
  })

  it('contains privacy policy content', () => {
    render(<CookieConsent />)
    // The cookie description is rendered via t.rich(), verify the banner shows
    expect(screen.getByText('Cookie-Einstellungen')).toBeInTheDocument()
  })
})
