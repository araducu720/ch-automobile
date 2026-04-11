import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getVehicle } from '@/lib/api';
import type { Vehicle, ApiResponse } from '@/types';
import { SafeHtml } from '@/components/ui/safe-html';
import { formatDate } from '@/lib/utils';
import { VehicleGallery } from '@/components/vehicles/vehicle-gallery';
import { VehicleActions } from '@/components/vehicles/vehicle-actions';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { ContactForm } from '@/components/forms/contact-form';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';
import { VehicleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import {
  Calendar, Gauge, Fuel, Settings2, Car, Palette, Users,
  Shield, FileCheck, Phone, Mail, MessageCircle, ChevronLeft,
  CheckCircle, XCircle, Leaf,
} from 'lucide-react';

interface VehicleDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: VehicleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('vehicles');
  try {
    const { data: vehicle } = await getVehicle(slug);
    return {
      title: `${vehicle.full_name} — C-H Automobile`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: `${vehicle.full_name} • ${vehicle.formatted_price} • ${vehicle.formatted_mileage} • ${t(vehicle.fuel_type as any)}`,
      openGraph: {
        images: vehicle.main_image ? [vehicle.main_image] : [],
      },
    };
  } catch {
    return { title: t('notFound') };
  }
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const { slug, locale } = await params;
  const t = await getTranslations('vehicles');
  const tn = await getTranslations('nav');

  let data;
  let related: Vehicle[] = [];
  try {
    const response = await getVehicle(slug) as ApiResponse<Vehicle> & { related?: Vehicle[] };
    data = response.data;
    related = response.related || [];
  } catch {
    notFound();
  }

  const vehicle = data;

  // Maps DB enum values → translation keys (snake_case → camelCase)
  const FUEL_KEY: Record<string, string> = {
    petrol: 'petrol', diesel: 'diesel', electric: 'electric', hybrid: 'hybrid',
    plug_in_hybrid: 'pluginHybrid', hydrogen: 'hydrogen', lpg: 'lpg', cng: 'cng',
  };
  const TRANS_KEY: Record<string, string> = {
    automatic: 'automatic', manual: 'manual', semi_automatic: 'semiAutomatic',
  };
  const BODY_KEY: Record<string, string> = {
    sedan: 'sedan', suv: 'suv', coupe: 'coupe', cabrio: 'convertible',
    kombi: 'wagon', hatchback: 'hatchback', van: 'van', pickup: 'pickup',
    roadster: 'roadster', limousine: 'sedan', other: 'other',
  };
  const COND_KEY: Record<string, string> = {
    new: 'newCar', used: 'usedCar', demonstration: 'demoVehicle', classic: 'classic',
  };

  const specs = [
    { icon: Calendar, label: t('firstRegistration'), value: vehicle.registration_date ? formatDate(vehicle.registration_date) : `${vehicle.year}` },
    { icon: Gauge, label: t('mileage'), value: vehicle.formatted_mileage },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { icon: Fuel, label: t('fuelType'), value: t(FUEL_KEY[vehicle.fuel_type] as any) || vehicle.fuel_type },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { icon: Settings2, label: t('transmission'), value: t(TRANS_KEY[vehicle.transmission] as any) || vehicle.transmission },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { icon: Car, label: t('bodyType'), value: t(BODY_KEY[vehicle.body_type] as any) || vehicle.body_type },
    { icon: Palette, label: t('color'), value: vehicle.color },
    vehicle.interior_color ? { icon: Palette, label: t('interiorColor'), value: vehicle.interior_color } : null,
    vehicle.power_hp ? { icon: Gauge, label: t('power'), value: `${vehicle.power_hp} ${t('hp')} (${vehicle.power_kw} ${t('kw')})` } : null,
    vehicle.engine_displacement ? { icon: Settings2, label: t('engineSize'), value: `${vehicle.engine_displacement} ${t('ccm')}` } : null,
    vehicle.doors ? { icon: Car, label: t('doors'), value: `${vehicle.doors}` } : null,
    vehicle.seats ? { icon: Users, label: t('seats'), value: `${vehicle.seats}` } : null,
    vehicle.previous_owners !== null && vehicle.previous_owners !== undefined
      ? { icon: Users, label: t('previousOwners'), value: `${vehicle.previous_owners}` }
      : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { icon: Shield, label: t('condition'), value: t(COND_KEY[vehicle.condition] as any) || vehicle.condition },
    vehicle.tuv_until ? { icon: FileCheck, label: t('inspectionUntil'), value: formatDate(vehicle.tuv_until) } : null,
    vehicle.warranty ? { icon: Shield, label: t('warranty'), value: vehicle.warranty } : null,
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string | null }[];

  const envSpecs = [
    vehicle.emission_class ? { label: t('emissionClass'), value: vehicle.emission_class } : null,
    vehicle.co2_emissions ? { label: t('co2'), value: `${vehicle.co2_emissions} g/km` } : null,
    vehicle.fuel_consumption_combined ? { label: t('consumptionCombined'), value: `${vehicle.fuel_consumption_combined} l/100km` } : null,
    vehicle.fuel_consumption_urban ? { label: t('consumptionCity'), value: `${vehicle.fuel_consumption_urban} l/100km` } : null,
    vehicle.fuel_consumption_extra_urban ? { label: t('consumptionHighway'), value: `${vehicle.fuel_consumption_extra_urban} l/100km` } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  const checkmarks = [
    { label: t('accidentFree'), value: vehicle.accident_free },
    { label: t('nonSmoker'), value: vehicle.non_smoker },
    { label: t('garagedKept'), value: vehicle.garage_kept },
  ];

  return (
    <div className="bg-background">
      <VehicleJsonLd
        name={vehicle.full_name}
        description={typeof vehicle.description === 'string' ? vehicle.description : (vehicle.description?.[locale] || vehicle.description?.de || undefined)}
        image={vehicle.images?.[0]?.large || vehicle.images?.[0]?.original || undefined}
        brand={vehicle.brand}
        model={vehicle.model}
        year={vehicle.year}
        mileage={vehicle.mileage}
        fuelType={vehicle.fuel_type}
        transmission={vehicle.transmission}
        color={vehicle.color || undefined}
        price={vehicle.price}
        url={`/fahrzeuge/${vehicle.slug}`}
        condition={vehicle.condition}
      />
      <BreadcrumbJsonLd items={[
        { name: t('breadcrumbHome'), href: '/' },
        { name: tn('vehicles'), href: '/fahrzeuge' },
        { name: vehicle.full_name },
      ]} />
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">{t('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href="/fahrzeuge" className="hover:text-foreground">{tn('vehicles')}</Link>
          <span>/</span>
          <span className="text-foreground">{vehicle.full_name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Back button */}
        <Link
          href="/fahrzeuge"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('backToOverview')}
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Gallery + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <VehicleGallery images={vehicle.images || []} vehicleName={vehicle.full_name} />

            {/* Title + Price (mobile) */}
            <div className="lg:hidden">
              <h1 className="text-2xl font-bold text-foreground">{vehicle.full_name}</h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">
                  {vehicle.price_on_request ? t('priceOnRequest') : vehicle.formatted_price}
                </span>
              </div>
              {vehicle.status !== 'available' && (
                <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                  {vehicle.status === 'reserved' ? t('reserved') : vehicle.status === 'sold' ? t('sold') : vehicle.status}
                </span>
              )}
            </div>

            {/* Key specs grid */}
            <div className="rounded-xl border border-border bg-secondary p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">{t('technicalData')}</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex items-start gap-3">
                    <spec.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                    <div>
                      <div className="text-xs text-muted-foreground">{spec.label}</div>
                      <div className="text-sm font-medium text-foreground">{spec.value || '—'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checkmarks */}
            <div className="flex flex-wrap gap-4">
              {checkmarks.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-1.5 text-sm"
                >
                  {item.value ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-gray-400" />
                  )}
                  <span className={item.value ? 'text-foreground' : 'text-muted-foreground'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Environmental specs */}
            {envSpecs.length > 0 && (
              <div className="rounded-xl border border-border bg-secondary p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Leaf className="h-5 w-5 text-green-600" />
                  {t('environmentConsumption')}
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {envSpecs.map((spec) => (
                    <div key={spec.label}>
                      <div className="text-xs text-muted-foreground">{spec.label}</div>
                      <div className="text-sm font-medium text-foreground">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="rounded-xl border border-border bg-secondary p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('description')}</h2>
                <SafeHtml
                  className="prose prose-sm max-w-none text-muted dark:prose-invert"
                  html={typeof vehicle.description === 'string'
                    ? vehicle.description
                    : (vehicle.description as Record<string, string>)?.de || ''}
                />
              </div>
            )}

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="rounded-xl border border-border bg-secondary p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('features')}</h2>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {vehicle.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Equipment */}
            {vehicle.equipment && vehicle.equipment.length > 0 && (
              <div className="rounded-xl border border-border bg-secondary p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">{t('accessories')}</h2>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {vehicle.equipment.map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-primary-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Title + Price (desktop) */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-bold text-foreground">{vehicle.full_name}</h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-600">
                  {vehicle.price_on_request ? t('priceOnRequest') : vehicle.formatted_price}
                </span>
              </div>
              {vehicle.status !== 'available' && (
                <span className="mt-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                  {vehicle.status === 'reserved' ? t('reserved') : vehicle.status === 'sold' ? t('sold') : vehicle.status}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <VehicleActions />
            </div>

            {/* Quick contact */}
            <div className="rounded-xl border-2 border-border-secondary bg-secondary p-6 shadow-[var(--shadow-md)]">
              <h3 className="mb-3 font-semibold text-foreground">{t('quickContact')}</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm text-muted hover:text-primary-600"
                >
                  <Phone className="h-4 w-4" />
                  {COMPANY_INFO.phone}
                </a>
                <a
                  href="mailto:info@ch-automobile.de"
                  className="flex items-center gap-2 text-sm text-muted hover:text-primary-600"
                >
                  <Mail className="h-4 w-4" />
                  info@ch-automobile.de
                </a>
                <a
                  href={`https://wa.me/4915175606841?text=${encodeURIComponent(t('whatsappMessage', { vehicle: vehicle.full_name }))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Buy now CTA (only for available vehicles) */}
            {vehicle.status === 'available' && !vehicle.price_on_request && (
              <div className="rounded-xl border-2 border-l-4 border-border-secondary border-l-brand bg-secondary p-6 shadow-[var(--shadow-md)]">
                <h3 className="mb-2 text-lg font-bold text-foreground">{t('buyThisVehicle')}</h3>
                <p className="mb-4 text-sm text-muted">{t('buyThisVehicleDesc')}</p>
                <Button variant="accent" size="lg" fullWidth asChild>
                  <Link href={`/fahrzeuge/${vehicle.slug}/kaufen`}>
                    {t('buyNowButton')}
                  </Link>
                </Button>
              </div>
            )}

            {/* Contact Form */}
            <div className="rounded-xl border-2 border-l-4 border-border-secondary border-l-brand bg-secondary p-6 shadow-[var(--shadow-md)]">
              <h3 className="mb-4 font-semibold text-foreground">{t('sendInquiry')}</h3>
              <ContactForm vehicleId={vehicle.id} inquiryType="price_inquiry" />
            </div>
          </div>
        </div>

        {/* Related vehicles */}
        {related && related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-foreground">{t('relatedVehicles')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((v: Vehicle) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
