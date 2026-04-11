import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('errors.404');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-black text-brand opacity-30 select-none">
        404
      </div>
      <h1 className="mt-4 text-2xl font-bold text-foreground">
        {t('title')}
      </h1>
      <p className="mt-2 text-muted max-w-md">
        {t('description')}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/fahrzeuge">
            <Search className="h-4 w-4" />
            {t('searchVehicles')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
