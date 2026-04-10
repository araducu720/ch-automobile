import { COMPANY_INFO, SITE_URL, SITE_NAME } from '@/lib/constants';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    name: SITE_NAME,
    description: 'Premium & Exclusive Cars dealer in Friedberg, Germany',
    url: COMPANY_INFO.website,
    telephone: COMPANY_INFO.phone,
    email: COMPANY_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: COMPANY_INFO.street,
      addressLocality: COMPANY_INFO.city,
      addressRegion: COMPANY_INFO.state,
      postalCode: COMPANY_INFO.zip,
      addressCountry: 'DE',
    },
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
    image: `${SITE_URL}/images/logo.png`,
    priceRange: '€€€',
    sameAs: [],
  };

  return <JsonLd data={data} />;
}

interface BreadcrumbItem {
  name: string;
  href?: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return <JsonLd data={data} />;
}

interface VehicleJsonLdProps {
  name: string;
  description?: string;
  image?: string;
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  price?: number;
  currency?: string;
  url: string;
  condition?: string;
}

export function VehicleJsonLd({
  name,
  description,
  image,
  brand,
  model,
  year,
  mileage,
  fuelType,
  transmission,
  color,
  price,
  currency = 'EUR',
  url,
  condition,
}: VehicleJsonLdProps) {
  const itemCondition =
    condition === 'new'
      ? 'https://schema.org/NewCondition'
      : 'https://schema.org/UsedCondition';

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name,
    description,
    image,
    url: `${SITE_URL}${url}`,
    brand: brand ? { '@type': 'Brand', name: brand } : undefined,
    model,
    vehicleModelDate: year ? String(year) : undefined,
    mileageFromOdometer: mileage
      ? { '@type': 'QuantitativeValue', value: mileage, unitCode: 'KMT' }
      : undefined,
    fuelType,
    vehicleTransmission: transmission,
    color,
    itemCondition,
    offers: price
      ? {
          '@type': 'Offer',
          price,
          priceCurrency: currency,
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'AutoDealer',
            name: SITE_NAME,
          },
        }
      : undefined,
  };

  // Remove undefined keys
  const cleanData = JSON.parse(JSON.stringify(data));
  return <JsonLd data={cleanData} />;
}

interface ArticleJsonLdProps {
  title: string;
  description?: string;
  image?: string;
  author: string;
  publishedAt?: string;
  url: string;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  author,
  publishedAt,
  url,
}: ArticleJsonLdProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image,
    author: { '@type': 'Person', name: author },
    datePublished: publishedAt,
    url: `${SITE_URL}${url}`,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
  };

  const cleanData = JSON.parse(JSON.stringify(data));
  return <JsonLd data={cleanData} />;
}
