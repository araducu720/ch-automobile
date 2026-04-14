'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { LOCALE_NAMES, type SupportedLocale } from '@/lib/constants';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale() as SupportedLocale;
  const t = useTranslations('accessibility');
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Show popular locales first, then rest alphabetically
  const popularLocales: SupportedLocale[] = ['de', 'en', 'fr', 'it', 'es', 'nl', 'pl'];
  const otherLocales = routing.locales.filter(
    (l) => !popularLocales.includes(l as SupportedLocale)
  ) as SupportedLocale[];
  const allLocales = [...popularLocales, ...otherLocales];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      const idx = allLocales.indexOf(locale);
      setActiveIndex(idx >= 0 ? idx : 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((newLocale: string) => {
    router.replace(pathname, { locale: newLocale as SupportedLocale });
    setOpen(false);
  }, [pathname, router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % allLocales.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + allLocales.length) % allLocales.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < allLocales.length) {
          handleChange(allLocales[activeIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(allLocales.length - 1);
        break;
    }
  }, [open, activeIndex, allLocales, handleChange]);

  // Scroll active option into view
  useEffect(() => {
    if (open && listRef.current && activeIndex >= 0) {
      const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  const renderOption = (l: SupportedLocale, globalIndex: number) => (
    <div
      key={l}
      role="option"
      aria-selected={l === locale}
      data-index={globalIndex}
      id={`lang-option-${l}`}
      className={cn(
        'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left cursor-pointer',
        'transition-colors',
        globalIndex === activeIndex && 'bg-secondary',
        l === locale
          ? 'bg-brand-light text-brand font-medium'
          : 'text-foreground hover:bg-secondary',
      )}
      onClick={() => handleChange(l)}
      onMouseEnter={() => setActiveIndex(globalIndex)}
    >
      <span className="uppercase text-xs w-5 text-muted-foreground">{l}</span>
      {LOCALE_NAMES[l]}
    </div>
  );

  return (
    <div className="relative" ref={ref} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm',
          'hover:bg-secondary transition-colors',
          'text-muted hover:text-foreground',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        )}
        aria-label={t('selectLanguage')}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? 'language-listbox' : undefined}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="uppercase font-medium">{locale}</span>
      </button>

      {open && (
        <div
          ref={listRef}
          id="language-listbox"
          role="listbox"
          aria-label={t('selectLanguage')}
          aria-activedescendant={activeIndex >= 0 ? `lang-option-${allLocales[activeIndex]}` : undefined}
          className="absolute right-0 top-full mt-1 z-50 w-48 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg"
        >
          {/* Popular languages */}
          <div className="p-1">
            {popularLocales.map((l, i) => renderOption(l, i))}
          </div>

          {/* Divider */}
          <div className="border-t border-border mx-2" role="separator" />

          {/* Other languages */}
          <div className="p-1">
            {otherLocales.map((l, i) => renderOption(l, popularLocales.length + i))}
          </div>
        </div>
      )}
    </div>
  );
}
