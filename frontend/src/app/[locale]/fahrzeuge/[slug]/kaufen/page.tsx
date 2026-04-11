import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getVehicle } from '@/lib/api';
import type { Vehicle, ApiResponse } from '@/types';
import { PurchaseWizard } from '@/components/forms/purchase-wizard';
import { getTranslations } from 'next-intl/server';
import { ChevronLeft, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

interface PurchasePageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: PurchasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('purchase');
  const tv = await getTranslations('vehicles');
  try {
    const { data: vehicle } = await getVehicle(slug);
    return {
      title: `${t('metaTitle')} — ${vehicle.full_name}`,
      description: `${vehicle.full_name} • ${vehicle.formatted_price}`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: tv('notFound') };
  }
}

export default async function PurchasePage({ params }: PurchasePageProps) {
  const { slug } = await params;
  const t = await getTranslations('purchase');
  const tv = await getTranslations('vehicles');

  let vehicle: Vehicle;
  try {
    const response = await getVehicle(slug) as ApiResponse<Vehicle>;
    vehicle = response.data;
  } catch {
    notFound();
  }

  // Only allow purchase for available, non-price-on-request vehicles
  if (vehicle.status !== 'available' || vehicle.price_on_request) {
    return (
      <div className="py-16">
        <div className="container-main max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('unavailableTitle')}</h1>
          <p className="mt-4 text-muted">{t('unavailableDescription')}</p>
          <Link
            href={`/fahrzeuge/${vehicle.slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:text-brand-hover"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('backToVehicle')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/fahrzeuge" className="hover:text-brand transition-colors">
            {tv('title')}
          </Link>
          <span>/</span>
          <Link href={`/fahrzeuge/${vehicle.slug}`} className="hover:text-brand transition-colors">
            {vehicle.full_name}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{t('breadcrumb')}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left: Vehicle summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              {/* Vehicle image */}
              <div className="overflow-hidden rounded-xl border-2 border-border-secondary">
                {vehicle.main_image ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={vehicle.main_image}
                      alt={vehicle.full_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-tertiary text-muted-foreground">
                    <ShieldCheck className="h-16 w-16" />
                  </div>
                )}
              </div>

              {/* Vehicle info card */}
              <div className="rounded-xl border-2 border-border-secondary bg-secondary p-5 shadow-[var(--shadow-md)]">
                <h2 className="text-lg font-bold text-foreground">{vehicle.full_name}</h2>
                {vehicle.variant && (
                  <p className="mt-1 text-sm text-muted">{vehicle.variant}</p>
                )}
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-brand">
                    {vehicle.formatted_price}
                  </span>
                </div>

                {/* Key specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{tv('year')}</span>
                    <p className="font-medium text-foreground">{vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{tv('mileage')}</span>
                    <p className="font-medium text-foreground">{vehicle.formatted_mileage}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{tv('fuel')}</span>
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <p className="font-medium text-foreground">{tv(vehicle.fuel_type as any)}</p>
                  </div>
                  {vehicle.power_hp && (
                    <div>
                      <span className="text-muted-foreground">{tv('power')}</span>
                      <p className="font-medium text-foreground">{vehicle.power_hp} {tv('hp')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 rounded-xl border border-success bg-success-bg p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div>
                  <p className="text-sm font-semibold text-success">{t('secureTitle')}</p>
                  <p className="mt-1 text-xs text-muted">{t('secureDescription')}</p>
                </div>
              </div>

              {/* Back link */}
              <Link
                href={`/fahrzeuge/${vehicle.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-brand transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('backToVehicle')}
              </Link>
            </div>
          </div>

          {/* Right: Purchase wizard */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border-2 border-l-4 border-border-secondary border-l-brand bg-secondary p-6 shadow-[var(--shadow-md)] lg:p-8">
              <PurchaseWizard
                vehicleId={vehicle.id}
                vehicleName={vehicle.full_name}
                vehiclePrice={vehicle.formatted_price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
