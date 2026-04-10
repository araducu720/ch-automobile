import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VehicleCard } from '@/components/vehicles/vehicle-card'
import type { Vehicle } from '@/types'

const mockVehicle: Vehicle = {
  id: 1,
  brand: 'BMW',
  model: '320i',
  variant: 'Sport Line',
  full_name: 'BMW 320i Sport Line',
  year: 2023,
  price: 35000,
  formatted_price: '35.000 €',
  formatted_mileage: '15.000 km',
  price_on_request: false,
  mileage: 15000,
  fuel_type: 'petrol',
  transmission: 'automatic',
  body_type: 'sedan',
  power_hp: 184,
  power_kw: 135,
  color: 'Schwarz',
  interior_color: null,
  engine_displacement: null,
  doors: 4,
  seats: 5,
  emission_class: null,
  co2_emissions: null,
  fuel_consumption_combined: null,
  fuel_consumption_urban: null,
  fuel_consumption_extra_urban: null,
  registration_date: null,
  tuv_until: null,
  previous_owners: null,
  accident_free: false,
  non_smoker: false,
  garage_kept: false,
  warranty: null,
  description: {},
  features: [],
  equipment: [],
  mobile_de_id: null,
  views_count: 0,
  images: [],
  condition: 'used',
  status: 'available',
  is_featured: false,
  slug: 'bmw-320i-2023',
  thumbnail: '/images/bmw-320i.jpg',
  main_image: '/images/bmw-320i-full.jpg',
  created_at: '2025-01-01T00:00:00Z',
  updated_at: '2025-01-01T00:00:00Z',
}

describe('VehicleCard', () => {
  it('renders vehicle name', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('BMW 320i Sport Line')).toBeInTheDocument()
  })

  it('renders variant', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('Sport Line')).toBeInTheDocument()
  })

  it('renders year', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('2023')).toBeInTheDocument()
  })

  it('renders formatted mileage', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    const mileageEl = screen.getByText(/15.*000.*km/i)
    expect(mileageEl).toBeInTheDocument()
  })

  it('renders fuel type label', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('Benzin')).toBeInTheDocument()
  })

  it('renders horsepower', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('184 PS')).toBeInTheDocument()
  })

  it('renders formatted price', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    const priceText = screen.getByText(/35.*000.*€/)
    expect(priceText).toBeInTheDocument()
  })

  it('renders price on request when flagged', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, price_on_request: true }} />)
    expect(screen.getByText('Preis auf Anfrage')).toBeInTheDocument()
  })

  it('renders available badge', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    expect(screen.getByText('Verfügbar')).toBeInTheDocument()
  })

  it('renders sold badge with reduced opacity', () => {
    const { container } = render(<VehicleCard vehicle={{ ...mockVehicle, status: 'sold' }} />)
    expect(screen.getByText('Verkauft')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('opacity-75')
  })

  it('renders reserved badge', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, status: 'reserved' }} />)
    expect(screen.getByText('Reserviert')).toBeInTheDocument()
  })

  it('renders featured badge', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, is_featured: true }} />)
    expect(screen.getByText('★ Premium')).toBeInTheDocument()
  })

  it('links to vehicle detail page', () => {
    render(<VehicleCard vehicle={mockVehicle} />)
    const links = screen.getAllByRole('link')
    const detailLink = links.find((l: HTMLElement) => l.getAttribute('href')?.includes('bmw-320i-2023'))
    expect(detailLink).toBeDefined()
    expect(detailLink).toHaveAttribute('href', '/fahrzeuge/bmw-320i-2023')
  })

  it('renders placeholder when no thumbnail', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, thumbnail: null }} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders Zap icon for electric vehicles', () => {
    render(<VehicleCard vehicle={{ ...mockVehicle, fuel_type: 'electric' }} />)
    expect(screen.getByText('Elektro')).toBeInTheDocument()
  })
})
