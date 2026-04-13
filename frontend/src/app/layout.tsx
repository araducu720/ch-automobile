import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { getLocale } from 'next-intl/server';
import { SITE_NAME, SITE_URL, COMPANY_INFO, SUPPORTED_LOCALES } from '@/lib/constants';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Premium-Fahrzeughändler in Friedberg`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Exklusive Premium- und Sportwagen in Friedberg. Persönliche Beratung, erstklassiger Service und faire Preise.',
  keywords: [
    'Premium Fahrzeuge',
    'Sportwagen',
    'Friedberg',
    'Gebrauchtwagen',
    'Luxusautos',
    'C-H Automobile',
    'Exclusive Cars',
    'Autohändler Hessen',
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Premium-Fahrzeughändler in Friedberg`,
    description:
      'Exklusive Premium- und Sportwagen in Friedberg. Persönliche Beratung, erstklassiger Service und faire Preise.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: 'Exklusive Premium- und Sportwagen in Friedberg.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((l) => [l, l === 'de' ? '/' : `/${l}`]),
    ),
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://c-h-automobile.on-forge.com" />
        <link rel="dns-prefetch" href="https://c-h-automobile.on-forge.com" />
        <meta name="theme-color" content="#1E40AF" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'AutoDealer',
              name: SITE_NAME,
              description:
                'Exklusive Premium- und Sportwagen in Friedberg, Deutschland.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: COMPANY_INFO.street,
                addressLocality: COMPANY_INFO.city,
                postalCode: COMPANY_INFO.zip,
                addressRegion: COMPANY_INFO.state,
                addressCountry: 'DE',
              },
              telephone: COMPANY_INFO.phone,
              email: COMPANY_INFO.email,
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ch-automobile.de',
              geo: {
                '@type': 'GeoCoordinates',
                latitude: COMPANY_INFO.coordinates.lat,
                longitude: COMPANY_INFO.coordinates.lng,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '09:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Saturday',
                  opens: '10:00',
                  closes: '14:00',
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
