'use client';

import { useActionState } from 'react';
import { submitNewsletterAction, type ActionResult } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function NewsletterForm() {
  const t = useTranslations('newsletter');
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitNewsletterAction,
    null,
  );

  if (state?.success) {
    return (
      <div className="flex items-center gap-2 text-[var(--status-success)]">
        <CheckCircle className="h-5 w-5 shrink-0" />
        <p className="text-sm">{t('successMessage')}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="email"
            name="email"
            placeholder={t('emailPlaceholder')}
            required
            aria-label={t('emailPlaceholder')}
            className="w-full rounded-lg border-2 border-[var(--border-input)] bg-[var(--input-bg)] px-3 py-2 pl-9 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] shadow-[var(--input-shadow)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-[var(--border-focus)] transition-all duration-200"
          />
        </div>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? t('subscribing') : t('subscribe')}
        </Button>
      </div>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="newsletter_privacy"
          name="privacy_accepted"
          value="true"
          required
          className="mt-0.5 h-3.5 w-3.5 rounded border-2 border-[var(--border-input)] accent-[var(--brand-primary)]"
        />
        <label htmlFor="newsletter_privacy" className="text-xs text-[var(--text-tertiary)]">
          {t.rich('privacyAgree', {
            link: (chunks) => (
              <Link href="/datenschutz" className="text-[var(--text-link)] hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </label>
      </div>
      {state?.errors?.email && (
        <p className="text-xs text-[var(--status-error)]">{state.errors.email}</p>
      )}
      {state && !state.success && state.message && (
        <p className="text-xs text-[var(--status-error)]">{state.message}</p>
      )}
    </form>
  );
}
