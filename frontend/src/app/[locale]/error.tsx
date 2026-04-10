'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('errors.generic');

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
      <div className="text-6xl font-black text-[var(--status-error)] opacity-30 select-none">
        {t('label')}
      </div>
      <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
        {t('title')}
      </h1>
      <p className="mt-2 text-[var(--text-secondary)] max-w-md">
        {t('description')}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RefreshCw className="h-4 w-4" />
          {t('retry')}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            {t('backHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
