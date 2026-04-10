import type { MetadataRoute } from 'next';
import { SITE_URL, API_URL, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@/lib/constants';

interface SitemapVehicle {
  slug: string;
  updated_at: string;
}

interface SitemapPost {
  slug: string;
  updated_at: string;
}

function safeDate(dateStr?: string | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Build hreflang alternates for all supported locales */
function buildAlternates(path: string) {
  return {
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map((locale) => [
        locale,
        locale === DEFAULT_LOCALE ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`,
      ]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    { path: '/', changeFrequency: 'daily' as const, priority: 1 },
    { path: '/fahrzeuge', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/kontakt', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/inzahlungnahme', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/bewertungen', changeFrequency: 'weekly' as const, priority: 0.6 },
    { path: '/ueber-uns', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/impressum', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/datenschutz', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/agb', changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const staticPages: MetadataRoute.Sitemap = staticPaths.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: buildAlternates(page.path),
  }));

  let vehiclePages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const vehiclesRes = await fetch(`${API_URL}/vehicles?per_page=100&fields=slug,updated_at`, {
      next: { revalidate: 3600 },
    });
    if (vehiclesRes.ok) {
      const vehiclesData = await vehiclesRes.json();
      vehiclePages = (vehiclesData.data || []).map((v: SitemapVehicle) => ({
        url: `${SITE_URL}/fahrzeuge/${v.slug}`,
        lastModified: safeDate(v.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.8,
        alternates: buildAlternates(`/fahrzeuge/${v.slug}`),
      }));
    }
  } catch {
    // API unavailable — skip dynamic vehicle pages
  }

  try {
    const postsRes = await fetch(`${API_URL}/blog/posts?per_page=100&fields=slug,updated_at`, {
      next: { revalidate: 3600 },
    });
    if (postsRes.ok) {
      const postsData = await postsRes.json();
      blogPages = (postsData.data || []).map((p: SitemapPost) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: safeDate(p.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
        alternates: buildAlternates(`/blog/${p.slug}`),
      }));
    }
  } catch {
    // API unavailable — skip dynamic blog pages
  }

  return [...staticPages, ...vehiclePages, ...blogPages];
}
