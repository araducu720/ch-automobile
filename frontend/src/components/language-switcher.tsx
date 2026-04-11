'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { LOCALE_NAMES, type SupportedLocale } from '@/lib/constants';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations('accessibility');
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as SupportedLocale });
    setOpen(false);
  };

  // Show popular locales first, then rest alphabetically
  const popularLocales: SupportedLocale[] = ['de', 'en', 'fr', 'it', 'es', 'nl', 'pl'];
  const otherLocales = routing.locales.filter(
    (l) => !popularLocales.includes(l as SupportedLocale)
  ) as SupportedLocale[];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm',
          'hover:bg-secondary transition-colors',
          'text-muted hover:text-foreground',
        )}
        aria-label={t('selectLanguage')}
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase font-medium">{locale}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {/* Popular languages */}
          <div className="p-1">
            {popularLocales.map((l) => (
              <button
                key={l}
                onClick={() => handleChange(l)}
                className={cn(
                  'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left',
                  'hover:bg-secondary transition-colors',
                  l === locale
                    ? 'bg-brand-light text-brand font-medium'
                    : 'text-foreground',
                )}
              >
                <span className="uppercase text-xs w-5 text-muted-foreground">{l}</span>
                {LOCALE_NAMES[l]}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border mx-2" />

          {/* Other languages */}
          <div className="p-1">
            {otherLocales.map((l) => (
              <button
                key={l}
                onClick={() => handleChange(l)}
                className={cn(
                  'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left',
                  'hover:bg-secondary transition-colors',
                  l === locale
                    ? 'bg-brand-light text-brand font-medium'
                    : 'text-foreground',
                )}
              >
                <span className="uppercase text-xs w-5 text-muted-foreground">{l}</span>
                {LOCALE_NAMES[l]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
