/// <reference types="vitest/globals" />
import '@testing-library/jest-dom/vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return <img {...rest} />
  },
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href as string} {...props}>{children}</a>
  ),
}))

// Mock next-intl with actual German messages
const { getNestedValue, loadedMessages } = vi.hoisted(() => {
  // Use fs to load messages since require may not resolve relative paths in vi.hoisted
  const fs = require('fs')
  const path = require('path')
  const messagesPath = path.resolve(__dirname, '../../messages/de.json')
  const rawMessages = fs.readFileSync(messagesPath, 'utf8')
  const messages: Record<string, unknown> = JSON.parse(rawMessages)

  function getNested(obj: Record<string, unknown>, keyPath: string): string {
    const parts = keyPath.split('.')
    let current: unknown = obj
    for (const part of parts) {
      if (current && typeof current === 'object') {
        current = (current as Record<string, unknown>)[part]
      } else {
        return keyPath
      }
    }
    return typeof current === 'string' ? current : keyPath
  }

  return { getNestedValue: getNested, loadedMessages: messages }
})

vi.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    const t = (key: string, params?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      let value = getNestedValue(loadedMessages, fullKey)
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v))
        }
      }
      return value
    }
    t.rich = (key: string, _params?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key
      return getNestedValue(loadedMessages, fullKey)
    }
    return t
  },
  useLocale: () => 'de',
}))

// Mock @/i18n/navigation (i18n-aware Link, useRouter, etc.)
vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href as string} {...props}>{children}</a>
  ),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  redirect: vi.fn(),
  getPathname: vi.fn(),
}))

// Mock server actions
vi.mock('@/app/actions', () => ({
  submitInquiryAction: vi.fn(),
  submitTradeInAction: vi.fn(),
  submitReservationAction: vi.fn(),
  submitReviewAction: vi.fn(),
  subscribeNewsletterAction: vi.fn(),
}))

// Suppress console.error in tests for expected validation errors
const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit')) {
      return
    }
    originalError(...args)
  }
})
afterAll(() => {
  console.error = originalError
})
