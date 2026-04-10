import { describe, it, expect } from 'vitest'
import {
  cn,
  formatPrice,
  formatMileage,
  formatDate,
  truncate,
  vehicleSlug,
  debounce,
  buildSearchParams,
  getInitials,
  fuelTypeLabels,
  transmissionLabels,
  bodyTypeLabels,
  conditionLabels,
} from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('merges conflicting tailwind utilities', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })
})

describe('formatPrice', () => {
  it('formats price in EUR', () => {
    const result = formatPrice(25000)
    expect(result).toContain('25')
    expect(result).toContain('000')
    expect(result).toContain('€')
  })

  it('formats zero price', () => {
    const result = formatPrice(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('formats large prices', () => {
    const result = formatPrice(150000)
    expect(result).toContain('150')
    expect(result).toContain('000')
  })
})

describe('formatMileage', () => {
  it('formats mileage with km suffix', () => {
    expect(formatMileage(85000)).toContain('85')
    expect(formatMileage(85000)).toContain('000')
    expect(formatMileage(85000)).toContain('km')
  })

  it('formats zero mileage', () => {
    const result = formatMileage(0)
    expect(result).toContain('0')
    expect(result).toContain('km')
  })
})

describe('formatDate', () => {
  it('formats a date string', () => {
    const result = formatDate('2024-06-15T12:00:00')
    expect(result).toContain('2024')
    expect(result).toContain('15')
  })

  it('formats a Date object', () => {
    const result = formatDate(new Date(2024, 0, 1))
    expect(result).toContain('2024')
  })
})

describe('truncate', () => {
  it('returns text unchanged when under limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('truncates with ellipsis when over limit', () => {
    expect(truncate('Hello World Foo', 10)).toBe('Hello Worl…')
  })

  it('returns text when equal to limit', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })
})

describe('vehicleSlug', () => {
  it('generates a slug', () => {
    expect(vehicleSlug('BMW', '320i', 2023)).toBe('bmw-320i-2023')
  })

  it('handles special characters', () => {
    expect(vehicleSlug('Mercedes-Benz', 'C-Klasse', 2022)).toBe('mercedes-benz-c-klasse-2022')
  })

  it('handles spaces', () => {
    expect(vehicleSlug('Land Rover', 'Range Rover', 2021)).toBe('land-rover-range-rover-2021')
  })
})

describe('debounce', () => {
  it('delays function execution', async () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    await new Promise((r) => setTimeout(r, 100))
    expect(fn).toHaveBeenCalledTimes(1)
  })
})

describe('buildSearchParams', () => {
  it('builds query string from object', () => {
    const result = buildSearchParams({ brand: 'BMW', page: 1 })
    expect(result).toBe('?brand=BMW&page=1')
  })

  it('skips undefined and null values', () => {
    const result = buildSearchParams({ brand: 'BMW', model: undefined, page: null })
    expect(result).toBe('?brand=BMW')
  })

  it('skips empty strings', () => {
    const result = buildSearchParams({ brand: '', model: 'Golf' })
    expect(result).toBe('?model=Golf')
  })

  it('returns empty string when no params', () => {
    expect(buildSearchParams({})).toBe('')
  })
})

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('Max Mustermann')).toBe('MM')
  })

  it('returns single initial from one word', () => {
    expect(getInitials('Max')).toBe('M')
  })

  it('caps at 2 characters', () => {
    expect(getInitials('Max Franz Mustermann')).toBe('MF')
  })
})

describe('label maps', () => {
  it('has all fuel type labels', () => {
    expect(fuelTypeLabels.petrol).toBe('Benzin')
    expect(fuelTypeLabels.diesel).toBe('Diesel')
    expect(fuelTypeLabels.electric).toBe('Elektro')
    expect(fuelTypeLabels.hybrid).toBe('Hybrid')
    expect(fuelTypeLabels.plug_in_hybrid).toBe('Plug-in-Hybrid')
  })

  it('has transmission labels', () => {
    expect(transmissionLabels.automatic).toBe('Automatik')
    expect(transmissionLabels.manual).toBe('Schaltgetriebe')
  })

  it('has body type labels', () => {
    expect(bodyTypeLabels.sedan).toBe('Limousine')
    expect(bodyTypeLabels.suv).toBe('SUV')
    expect(bodyTypeLabels.coupe).toBe('Coupé')
    expect(bodyTypeLabels.cabrio).toBe('Cabrio')
    expect(bodyTypeLabels.kombi).toBe('Kombi')
  })

  it('has condition labels', () => {
    expect(conditionLabels.new).toBe('Neuwagen')
    expect(conditionLabels.used).toBe('Gebrauchtwagen')
    expect(conditionLabels.classic).toBe('Oldtimer')
  })
})
