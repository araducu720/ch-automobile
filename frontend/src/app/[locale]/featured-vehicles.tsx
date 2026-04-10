import { getFeaturedVehicles } from '@/lib/api';
import { VehicleCard } from '@/components/vehicles/vehicle-card';
import { getTranslations } from 'next-intl/server';

export async function FeaturedVehicles() {
  const t = await getTranslations('home.featured');

  try {
    const { data: vehicles } = await getFeaturedVehicles();

    if (!vehicles.length) {
      return (
        <div className="text-center py-12">
          <p className="text-[var(--text-secondary)]">
            {t('noVehicles')}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.slice(0, 6).map((vehicle, index) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            priority={index < 3}
          />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">
          {t('loadError')}
        </p>
      </div>
    );
  }
}
