import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/query-provider';
import { ToastProvider } from '@/components/ui/toast';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CookieConsent } from '@/components/cookie-consent';
import { ScrollToTop } from '@/components/scroll-to-top';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { routing } from '@/i18n/routing';
import { setApiLocale } from '@/lib/api';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  setApiLocale(locale);

  return (
    <NextIntlClientProvider locale={locale}>
      <ThemeProvider>
        <QueryProvider>
          <ToastProvider>
            <div id="top" className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1 page-transition">
                {children}
              </main>
              <Footer />
              <CookieConsent />
              <WhatsAppButton />
              <ScrollToTop />
            </div>
          </ToastProvider>
        </QueryProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
