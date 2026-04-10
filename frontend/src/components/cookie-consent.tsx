'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const CONSENT_KEY = 'ch-auto-cookie-consent';

type ConsentState = 'undecided' | 'accepted' | 'essential-only';

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>('accepted'); // default hidden
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setConsent('undecided');
    } else {
      setConsent(stored as ConsentState);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
  };

  const acceptEssential = () => {
    localStorage.setItem(CONSENT_KEY, 'essential-only');
    setConsent('essential-only');
  };

  const t = useTranslations('cookie');
  const tc = useTranslations('common');

  if (!mounted || consent !== 'undecided') return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="mx-auto max-w-4xl rounded-2xl border border-[var(--border-primary)] bg-[var(--bg-elevated)] p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-[var(--brand-primary)]" />
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)]">
              {t('title')}
            </h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {t.rich('description', {
                link: (chunks) => (
                  <Link href="/datenschutz" className="text-[var(--text-link)] underline hover:text-[var(--text-link-hover)]">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={acceptAll}>
                {t('acceptAll')}
              </Button>
              <Button
                onClick={acceptEssential}
                variant="outline"
              >
                {t('essentialOnly')}
              </Button>
            </div>
          </div>
          <button
            onClick={acceptEssential}
            className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            aria-label={tc('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
