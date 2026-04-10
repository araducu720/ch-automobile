import { describe, it, expect } from 'vitest'
import {
  inquirySchema,
  tradeInSchema,
  reservationSchema,
  reviewSchema,
  newsletterSchema,
  contactSchema,
} from '@/lib/validations'

describe('inquirySchema', () => {
  const validData = {
    type: 'general' as const,
    name: 'Max Mustermann',
    email: 'max@example.com',
    message: 'Ich interessiere mich für ein Fahrzeug.',
    privacy_accepted: true as const,
  }

  it('accepts valid data', () => {
    const result = inquirySchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects missing name', () => {
    const result = inquirySchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid email', () => {
    const result = inquirySchema.safeParse({ ...validData, email: 'not-email' })
    expect(result.success).toBe(false)
  })

  it('rejects short message', () => {
    const result = inquirySchema.safeParse({ ...validData, message: 'kurz' })
    expect(result.success).toBe(false)
  })

  it('rejects invalid type', () => {
    const result = inquirySchema.safeParse({ ...validData, type: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejects without privacy', () => {
    const result = inquirySchema.safeParse({ ...validData, privacy_accepted: false })
    expect(result.success).toBe(false)
  })

  it('accepts optional vehicle_id', () => {
    const result = inquirySchema.safeParse({ ...validData, vehicle_id: 42 })
    expect(result.success).toBe(true)
  })

  it('accepts optional phone', () => {
    const result = inquirySchema.safeParse({ ...validData, phone: '+49 123 456789' })
    expect(result.success).toBe(true)
  })

  it('honeypot must be empty', () => {
    const result = inquirySchema.safeParse({ ...validData, website_url: 'https://spam.com' })
    expect(result.success).toBe(false)
  })
})

describe('tradeInSchema', () => {
  const validData = {
    name: 'Hans Müller',
    email: 'hans@example.com',
    phone: '+49 170 1234567',
    trade_brand: 'BMW',
    trade_model: '320i',
    trade_year: 2018,
    trade_mileage: 85000,
    trade_condition: 'good' as const,
    privacy_accepted: true as const,
  }

  it('accepts valid data', () => {
    const result = tradeInSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires phone', () => {
    const result = tradeInSchema.safeParse({ ...validData, phone: '' })
    expect(result.success).toBe(false)
  })

  it('requires trade_brand', () => {
    const result = tradeInSchema.safeParse({ ...validData, trade_brand: '' })
    expect(result.success).toBe(false)
  })

  it('validates trade_year range', () => {
    const tooOld = tradeInSchema.safeParse({ ...validData, trade_year: 1950 })
    expect(tooOld.success).toBe(false)
  })

  it('validates trade_condition enum', () => {
    const result = tradeInSchema.safeParse({ ...validData, trade_condition: 'terrible' })
    expect(result.success).toBe(false)
  })
})

describe('reservationSchema', () => {
  const validData = {
    vehicle_id: 1,
    customer_name: 'Max Mustermann',
    customer_email: 'max@example.com',
    customer_phone: '+49 170 1234567',
    privacy_accepted: true as const,
  }

  it('accepts valid data', () => {
    const result = reservationSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires vehicle_id', () => {
    const result = reservationSchema.safeParse({ ...validData, vehicle_id: undefined })
    expect(result.success).toBe(false)
  })

  it('requires customer_email', () => {
    const result = reservationSchema.safeParse({ ...validData, customer_email: '' })
    expect(result.success).toBe(false)
  })

  it('accepts optional billing address', () => {
    const result = reservationSchema.safeParse({
      ...validData,
      billing_street: 'Musterstraße 1',
      billing_city: 'Friedberg',
      billing_postal_code: '61169',
      billing_country: 'DE',
    })
    expect(result.success).toBe(true)
  })
})

describe('reviewSchema', () => {
  const validData = {
    customer_name: 'Maria Schmidt',
    rating: 5,
    comment: 'Sehr guter Service und freundliche Beratung!',
    privacy_accepted: true as const,
  }

  it('accepts valid data', () => {
    const result = reviewSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires rating', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: undefined })
    expect(result.success).toBe(false)
  })

  it('rejects rating below 1', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects rating above 5', () => {
    const result = reviewSchema.safeParse({ ...validData, rating: 6 })
    expect(result.success).toBe(false)
  })

  it('rejects comment under 20 chars', () => {
    const result = reviewSchema.safeParse({ ...validData, comment: 'Kurz' })
    expect(result.success).toBe(false)
  })

  it('accepts optional email', () => {
    const result = reviewSchema.safeParse({ ...validData, customer_email: 'maria@example.com' })
    expect(result.success).toBe(true)
  })

  it('accepts empty email string', () => {
    const result = reviewSchema.safeParse({ ...validData, customer_email: '' })
    expect(result.success).toBe(true)
  })
})

describe('newsletterSchema', () => {
  it('accepts valid email', () => {
    const result = newsletterSchema.safeParse({
      email: 'test@example.com',
      privacy_accepted: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = newsletterSchema.safeParse({
      email: 'invalid',
      privacy_accepted: true,
    })
    expect(result.success).toBe(false)
  })

  it('requires privacy acceptance', () => {
    const result = newsletterSchema.safeParse({
      email: 'test@example.com',
      privacy_accepted: false,
    })
    expect(result.success).toBe(false)
  })

  it('defaults locale to de', () => {
    const result = newsletterSchema.safeParse({
      email: 'test@example.com',
      privacy_accepted: true,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.locale).toBe('de')
    }
  })
})

describe('contactSchema', () => {
  const validData = {
    name: 'Max Mustermann',
    email: 'max@example.com',
    message: 'Ich möchte gerne einen Termin vereinbaren.',
    privacy_accepted: true as const,
  }

  it('accepts valid data', () => {
    const result = contactSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('requires name', () => {
    const result = contactSchema.safeParse({ ...validData, name: '' })
    expect(result.success).toBe(false)
  })

  it('requires email', () => {
    const result = contactSchema.safeParse({ ...validData, email: '' })
    expect(result.success).toBe(false)
  })

  it('requires message of 10+ chars', () => {
    const result = contactSchema.safeParse({ ...validData, message: 'Hallo' })
    expect(result.success).toBe(false)
  })

  it('honeypot blocks filled field', () => {
    const result = contactSchema.safeParse({ ...validData, website_url: 'spam' })
    expect(result.success).toBe(false)
  })
})
