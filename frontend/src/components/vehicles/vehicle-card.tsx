'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn, formatPrice, formatMileage } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Vehicle } from '@/types';
import { Fuel, Gauge, Calendar, Zap, Camera, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
  priority?: boolean;
}

export function VehicleCard({ vehicle, className, priority = false }: VehicleCardProps) {
  const t = useTranslations('vehicles');
  const tc = useTranslations('vehicleCard');

  // Map DB snake_case values → translation keys
  const FUEL_KEY: Record<string, string> = {
    petrol: 'petrol', diesel: 'diesel', electric: 'electric', hybrid: 'hybrid',
    plug_in_hybrid: 'pluginHybrid', hydrogen: 'hydrogen', lpg: 'lpg', cng: 'cng',
  };

  const statusBadge = {
    available: { variant: 'success' as const, label: t('available') },
    reserved: { variant: 'warning' as const, label: t('reserved') },
    sold: { variant: 'error' as const, label: t('sold') },
    draft: { variant: 'secondary' as const, label: tc('draft') },
  };

  const fuelIcons: Record<string, typeof Fuel> = {
    electric: Zap,
    hybrid: Zap,
    plug_in_hybrid: Zap,
  };

  const FuelIcon = fuelIcons[vehicle.fuel_type] || Fuel;
  const status = statusBadge[vehicle.status];

  return (
    <Link
      href={`/fahrzeuge/${vehicle.slug}`}
      className={cn(
        'group block rounded-xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] overflow-hidden card-hover',
        'transition-all duration-300 hover:shadow-lg hover:border-[var(--border-secondary)]',
        'focus-visible:outline-2 focus-visible:outline-[var(--border-focus)] focus-visible:outline-offset-2',
        vehicle.status === 'sold' && 'opacity-75',
        className,
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-tertiary)]">
        {vehicle.thumbnail ? (
          <Image
            src={vehicle.thumbnail}
            alt={vehicle.full_name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--text-tertiary)]">
            <Gauge className="h-12 w-12" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {/* Featured badge */}
        {vehicle.is_featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="accent">★ {tc('premium')}</Badge>
          </div>
        )}

        {/* Image count */}
        {(vehicle as any).images_count > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="h-3 w-3" />
            {(vehicle as any).images_count}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--brand-primary)] transition-colors">
            {vehicle.full_name}
          </h3>
          {vehicle.variant && (
            <p className="text-sm text-[var(--text-secondary)] line-clamp-1">{vehicle.variant}</p>
          )}
        </div>

        {/* Quick specs */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)]">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {vehicle.year}
          </span>
          <span className="inline-flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="inline-flex items-center gap-1">
            <FuelIcon className="h-3.5 w-3.5" />
            {t(FUEL_KEY[vehicle.fuel_type] as any) || vehicle.fuel_type}
          </span>
          {vehicle.power_hp && (
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              {vehicle.power_hp} {t('hp')}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-primary)]">
          <div>
            {vehicle.price_on_request ? (
              <span className="text-sm font-medium text-[var(--text-secondary)]">{t('priceOnRequest')}</span>
            ) : (
              <span className="text-lg font-bold text-[var(--brand-primary)]">
                {formatPrice(vehicle.price)}
              </span>
            )}
          </div>
          <span className="text-xs text-[var(--brand-primary)] font-medium group-hover:underline">
            {t('details')} →
          </span>
        </div>

        {/* Buy button */}
        {vehicle.status === 'available' && !vehicle.price_on_request && (
          <div className="pt-2">
            <Button
              variant="accent"
              size="sm"
              fullWidth
              asChild
              className="pointer-events-auto"
              leftIcon={<ShoppingCart className="h-3.5 w-3.5" />}
            >
              <Link
                href={`/fahrzeuge/${vehicle.slug}/kaufen`}
                onClick={(e) => e.stopPropagation()}
              >
                {tc('buyNow')}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Link>
  );
}
