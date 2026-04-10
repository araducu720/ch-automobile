import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { COMPANY_INFO } from '@/lib/constants';
import { Car, Phone, Mail, MapPin, Clock } from 'lucide-react';

export async function Footer() {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const tc = await getTranslations('common');

  const quickLinks = [
    { href: '/fahrzeuge' as const, label: tn('vehicles') },
    { href: '/ueber-uns' as const, label: tn('about') },
    { href: '/inzahlungnahme' as const, label: tn('tradeIn') },
    { href: '/blog' as const, label: tn('blog') },
    { href: '/bewertungen' as const, label: tn('reviews') },
    { href: '/kontakt' as const, label: tn('contact') },
  ];

  const legalLinks = [
    { href: '/impressum' as const, label: tn('imprint') },
    { href: '/datenschutz' as const, label: tn('privacy') },
    { href: '/agb' as const, label: tn('terms') },
  ];

  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]"
      role="contentinfo"
    >
      <div className="container-main py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-[var(--text-primary)]">
              <Car className="h-6 w-6 text-[var(--brand-primary)]" />
              C-H <span className="text-[var(--brand-primary)]">Automobile</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('about')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{tn('contact')}</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${COMPANY_INFO.street}, ${COMPANY_INFO.zip} ${COMPANY_INFO.city}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    {COMPANY_INFO.street}<br />
                    {COMPANY_INFO.zip} {COMPANY_INFO.city}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY_INFO.phone}`}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  <Phone className="h-4 w-4 shrink-0" />
                  {COMPANY_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  {COMPANY_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{tc('openingHours')}</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{tc('weekdays')}: {COMPANY_INFO.hours.weekdays}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock className="h-4 w-4 shrink-0 opacity-0" />
                <span>Sa: {COMPANY_INFO.hours.saturday}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Clock className="h-4 w-4 shrink-0 opacity-0" />
                <span>So: {COMPANY_INFO.hours.sunday}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border-primary)]">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-4 sm:flex-row">
          <p className="text-xs text-[var(--text-tertiary)]">
            {t('copyright', { year: String(year) })}
          </p>
          <div className="flex items-center gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
