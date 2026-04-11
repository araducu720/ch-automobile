import type { Metadata } from 'next';

import { getTranslations } from 'next-intl/server';
import { getVehicles, getVehicleBrands } from '@/lib/api';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { VehicleFilterBar } from '@/components/vehicles/vehicle-filter-bar';

import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { VehicleFilters } from '@/types';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vehicles');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function VehiclesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const t = await getTranslations('vehicles');
  const tp = await getTranslations('pagination');

  const filters: VehicleFilters = {
    brand: params.brand,
    fuel_type: params.fuel_type as VehicleFilters['fuel_type'],
    transmission: params.transmission as VehicleFilters['transmission'],
    body_type: params.body_type as VehicleFilters['body_type'],
    price_min: params.price_min ? Number(params.price_min) : undefined,
    price_max: params.price_max ? Number(params.price_max) : undefined,
    year_min: params.year_min ? Number(params.year_min) : undefined,
    year_max: params.year_max ? Number(params.year_max) : undefined,
    mileage_max: params.mileage_max ? Number(params.mileage_max) : undefined,
    search: params.search,
    sort: params.sort,
    page: params.page ? Number(params.page) : 1,
    per_page: 12,
  };

  let vehicles, brands;
  try {
    [vehicles, brands] = await Promise.all([
      getVehicles(filters),
      getVehicleBrands(),
    ]);
  } catch {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('noVehicles')}</p>
      </div>
    );
  }

  const { data: vehicleList, meta } = vehicles;
  const { data: rawBrands } = brands;
  // API returns { brand: string, count: number }[] — extract just the brand names
  const brandList: string[] = Array.isArray(rawBrands)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? rawBrands.map((b: any) => (typeof b === 'string' ? b : b.brand))
    : [];

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">{t('filterBy')}</h2>
              <VehicleFilterBar brands={brandList} totalResults={meta.total} />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Mobile filter bar */}
            <div className="lg:hidden mb-6">
              <VehicleFilterBar brands={brandList} totalResults={meta.total} />
            </div>

            {/* Results */}
            {vehicleList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {vehicleList.map((vehicle, index) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      priority={index < 3}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {meta.last_page > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {meta.current_page > 1 && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/fahrzeuge?${new URLSearchParams({
                            ...params,
                            page: String(meta.current_page - 1),
                          }).toString()}`}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          {tp('previous')}
                        </Link>
                      </Button>
                    )}

                    <span className="px-4 text-sm text-muted">
                      {tp('page', { current: meta.current_page, total: meta.last_page })}
                    </span>

                    {meta.current_page < meta.last_page && (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/fahrzeuge?${new URLSearchParams({
                            ...params,
                            page: String(meta.current_page + 1),
                          }).toString()}`}
                        >
                          {tp('next')}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-muted">
                  {t('noVehicles')}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link href="/fahrzeuge">{t('resetFilters')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
