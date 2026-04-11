'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const t = useTranslations('accessibility');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary transition-colors"
        aria-label={t('themeToggle')}
      >
        <span className="h-4 w-4" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const themeLabel = theme === 'light' ? t('themeLight') : theme === 'dark' ? t('themeDark') : t('themeSystem');

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'relative flex h-9 w-9 items-center justify-center rounded-lg',
        'border border-border bg-secondary',
        'transition-all duration-200',
        'hover:bg-tertiary hover:border-border-secondary',
        'focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
      )}
      aria-label={t('themeCurrent', { theme: themeLabel })}
      title={
        theme === 'light'
          ? t('themeSwitchToDark')
          : theme === 'dark'
            ? t('themeSwitchToSystem')
            : t('themeSwitchToLight')
      }
    >
      {theme === 'system' ? (
        <Monitor className="h-4 w-4 text-muted" />
      ) : resolvedTheme === 'dark' ? (
        <Moon className="h-4 w-4 text-accent" />
      ) : (
        <Sun className="h-4 w-4 text-accent" />
      )}
    </button>
  );
}

/**
 * Extended theme toggle with dropdown for explicit selection
 */
export function ThemeToggleDropdown() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('accessibility');
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const options = [
    { value: 'light', label: t('themeLight'), icon: Sun },
    { value: 'dark', label: t('themeDark'), icon: Moon },
    { value: 'system', label: t('themeSystem'), icon: Monitor },
  ] as const;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          'border border-border bg-secondary',
          'transition-all duration-200',
          'hover:bg-tertiary',
          'focus-visible:outline-2 focus-visible:outline-border-focus focus-visible:outline-offset-2',
        )}
        aria-label={t('themeSelect')}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {theme === 'dark' ? (
          <Moon className="h-4 w-4 text-accent" />
        ) : theme === 'system' ? (
          <Monitor className="h-4 w-4 text-muted" />
        ) : (
          <Sun className="h-4 w-4 text-accent" />
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className={cn(
              'absolute right-0 top-full z-50 mt-2 w-36',
              'rounded-lg border border-border bg-card',
              'shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
            )}
            role="listbox"
            aria-label={t('themeSelect')}
          >
            {options.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                role="option"
                aria-selected={theme === value}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors',
                  'first:rounded-t-lg last:rounded-b-lg',
                  theme === value
                    ? 'bg-brand-light text-brand font-medium'
                    : 'text-muted hover:bg-tertiary hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
