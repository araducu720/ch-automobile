'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

const CONSENT_KEY = 'ch-auto-cookie-consent';

type ConsentState = 'undecided' | 'accepted' | 'essential-only';

export function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (!stored) {
        setConsent('undecided');
      } else {
        setConsent(stored as ConsentState);
      }
    } catch {
      // localStorage unavailable (private browsing, disabled cookies)
      setConsent('undecided');
    }
  }, []);

  const acceptAll = () => {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch { /* noop */ }
    setConsent('accepted');
  };

  const acceptEssential = () => {
    try { localStorage.setItem(CONSENT_KEY, 'essential-only'); } catch { /* noop */ }
    setConsent('essential-only');
  };

  const t = useTranslations('cookie');
  const tc = useTranslations('common');

  if (!mounted || consent !== 'undecided') return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 p-4"
      role="alertdialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
      aria-live="polite"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <Cookie className="mt-0.5 h-6 w-6 shrink-0 text-brand" aria-hidden="true" />
          <div className="flex-1">
            <h3 id="cookie-title" className="font-semibold text-foreground">
              {t('title')}
            </h3>
            <p id="cookie-description" className="mt-1 text-sm text-muted">
              {t.rich('description', {
                link: (chunks) => (
                  <Link href="/datenschutz" className="text-link underline hover:text-link-hover">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={acceptAll} autoFocus>
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
            className="text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-md"
            aria-label={tc('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
