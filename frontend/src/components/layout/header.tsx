'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { COMPANY_INFO } from '@/lib/constants';
import {
  Menu,
  Phone,
  Car,
  FileText,
  MessageSquare,
  Star,
  ArrowLeftRight,
  Home,
  Info,
} from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('nav');
  const ta = useTranslations('accessibility');
  const tc = useTranslations('common');

  const navigation = [
    { href: '/' as const, label: t('home'), icon: Home },
    { href: '/fahrzeuge' as const, label: t('vehicles'), icon: Car },
    { href: '/ueber-uns' as const, label: t('about'), icon: Info },
    { href: '/inzahlungnahme' as const, label: t('tradeIn'), icon: ArrowLeftRight },
    { href: '/blog' as const, label: t('blog'), icon: FileText },
    { href: '/bewertungen' as const, label: t('reviews'), icon: Star },
    { href: '/kontakt' as const, label: t('contact'), icon: MessageSquare },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/de';
    return pathname.includes(href);
  };

  return (
    <>
      {/* Skip to content */}
      <a href="#main-content" className="skip-to-content">
        {ta('skipToContent')}
      </a>

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
          scrolled
            ? 'glass border-b border-[var(--border-primary)] shadow-sm'
            : 'bg-transparent',
        )}
        role="banner"
      >
        {/* Top bar */}
        <div
          className={cn(
            'hidden lg:block border-b border-[var(--border-primary)] transition-all duration-300',
            scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100',
          )}
        >
          <div className="container-main flex items-center justify-between py-1.5 text-xs text-[var(--text-secondary)]">
            <span>{COMPANY_INFO.street}, {COMPANY_INFO.zip} {COMPANY_INFO.city}</span>
            <div className="flex items-center gap-4">
              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className="inline-flex items-center gap-1 hover:text-[var(--brand-primary)] transition-colors"
              >
                <Phone className="h-3 w-3" />
                {COMPANY_INFO.phone}
              </a>
              <span>{tc('weekdays')}: {COMPANY_INFO.hours.weekdays} | {tc('saturday').slice(0, 2)}: {COMPANY_INFO.hours.saturday}</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-main">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
              aria-label={ta('homeLogo')}
            >
              <Car className="h-7 w-7 text-[var(--brand-primary)]" />
              <span className="hidden sm:inline">
                C-H <span className="text-[var(--brand-primary)]">Automobile</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label={ta('mainNavigation')}>
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(item.href)
                      ? 'text-[var(--brand-primary)] bg-[var(--brand-primary-light)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />

              <a
                href={`tel:${COMPANY_INFO.phone}`}
                className={cn(
                  'hidden md:flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium',
                  'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] transition-colors',
                )}
              >
                <Phone className="h-4 w-4" />
                {tc('phone')}
              </a>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={cn(
                  'lg:hidden flex h-9 w-9 items-center justify-center rounded-lg',
                  'border border-[var(--border-primary)] bg-[var(--bg-secondary)]',
                  'hover:bg-[var(--bg-tertiary)] transition-colors',
                )}
                aria-label={ta('openMenu')}
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5 text-[var(--text-primary)]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} title={ta('mainNavigation')} side="right">
        <nav className="flex flex-col gap-1" aria-label={ta('mainNavigation')}>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-[var(--brand-primary)] bg-[var(--brand-primary-light)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
                )}
                aria-current={isActive(item.href) ? 'page' : undefined}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-6 border-t border-[var(--border-primary)] space-y-4">
          <a
            href={`tel:${COMPANY_INFO.phone}`}
            className="flex items-center gap-3 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
          >
            <Phone className="h-4 w-4" />
            {COMPANY_INFO.phone}
          </a>
          <p className="text-xs text-[var(--text-tertiary)]">
            {COMPANY_INFO.street}, {COMPANY_INFO.zip} {COMPANY_INFO.city}
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            {tc('weekdays')}: {COMPANY_INFO.hours.weekdays}<br />
            {tc('saturday').slice(0, 2)}: {COMPANY_INFO.hours.saturday}
          </p>
        </div>
      </Sheet>

      {/* Spacer for fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
