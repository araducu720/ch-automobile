'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { submitReviewAction, type ActionResult } from '@/app/actions';
import { Input, Textarea } from '@/components/ui/input';
import { StarRatingInput } from '@/components/ui/star-rating';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function ReviewForm() {
  const t = useTranslations('reviews.form');
  const tv = useTranslations('validation');
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitReviewAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [rating, setRating] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setRating(0);
      toast.success(state.message || t('success'));
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Honeypot — hidden from real users */}
      <input type="text" name="website_url" tabIndex={-1} autoComplete="off" className="absolute opacity-0 h-0 w-0 overflow-hidden pointer-events-none" aria-hidden="true" />
      <input type="hidden" name="rating" value={rating} />

      <StarRatingInput
        value={rating}
        onChange={setRating}
        label={t('rating')}
        error={state?.errors?.rating?.[0]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label={t('name')} name="customer_name" required autoComplete="name" error={state?.errors?.customer_name?.[0]} />
        <Input label={t('email')} name="customer_email" type="email" autoComplete="email" error={state?.errors?.customer_email?.[0]} hint={t('emailHint')} />
      </div>

      <Input label={t('title')} name="title" placeholder={t('titlePlaceholder')} error={state?.errors?.title?.[0]} />

      <Textarea
        label={t('content')}
        name="comment"
        required
        rows={5}
        placeholder={t('contentPlaceholder')}
        error={state?.errors?.comment?.[0]}
      />

      {/* Privacy */}
      <div className="flex items-start gap-2">
        <input type="checkbox" id="review_privacy" name="privacy_accepted" value="true" required className="mt-1 h-4 w-4 rounded border-2 border-input-border accent-brand" />
        <label htmlFor="review_privacy" className="text-sm text-muted">
          {t.rich('privacy', {
            link: (chunks) => (
              <Link href="/datenschutz" className="text-link hover:underline">{chunks}</Link>
            ),
          })}
          {' *'}
        </label>
      </div>

      <p className="text-xs text-muted-foreground">
        {t('moderationNote')}
      </p>

      {/* Inline validation errors */}
      {state && !state.success && state.errors && (
        <div className="flex items-start gap-2 rounded-lg bg-error-bg p-4 text-sm text-error">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {tv('checkInputs')}
        </div>
      )}

      <Button type="submit" isLoading={isPending} size="lg">
        {isPending ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
