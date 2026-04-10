import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';
import { Link } from '@/i18n/navigation';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('newsletter.confirmed');
  return {
    title: `${t('metaTitle')} – ${SITE_NAME}`,
    description: t('metaDescription'),
    robots: { index: false, follow: false },
  };
}

export default async function NewsletterConfirmedPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const isSuccess = status === 'success';
  const t = await getTranslations('newsletter.confirmed');
  const tc = await getTranslations('common');

  return (
    <div className="py-16 lg:py-24">
      <div className="container-main max-w-lg text-center">
        {isSuccess ? (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
              {t('success')}
            </h1>
            <p className="mt-3 text-[var(--text-secondary)]">
              {t('successMessage')}
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-[var(--text-primary)]">
              {t('failed')}
            </h1>
            <p className="mt-3 text-[var(--text-secondary)]">
              {t('failedMessage')}
            </p>
          </>
        )}

        <div className="mt-8">
          <Button variant="primary" asChild>
            <Link href="/">{t('backHome')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
