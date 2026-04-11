'use client';

import { useActionState, useRef, useEffect } from 'react';
import { submitContactAction, type ActionResult } from '@/app/actions';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ContactFormProps {
  vehicleId?: number;
  inquiryType?: string;
}

export function ContactForm({ vehicleId, inquiryType }: ContactFormProps) {
  const t = useTranslations('contact.form');
  const tv = useTranslations('validation');
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitContactAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast.success(state.message || t('success'));
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const typeOptions = [
    { value: 'general', label: t('generalInquiry') },
    { value: 'test_drive', label: t('testDriveRequest') },
    { value: 'price_inquiry', label: t('priceInquiry') },
    { value: 'financing', label: t('financingRequest') },
  ];

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {/* Hidden fields */}
      <input type="hidden" name="type" value={inquiryType || 'general'} />
      {vehicleId && <input type="hidden" name="vehicle_id" value={vehicleId} />}

      {!inquiryType && (
        <Select
          label={t('inquiryType')}
          name="type"
          options={typeOptions}
          defaultValue="general"
          required
        />
      )}

      <Input
        label="Name"
        name="name"
        required
        autoComplete="name"
        error={state?.errors?.name?.[0]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t('email')}
          name="email"
          type="email"
          required
          autoComplete="email"
          error={state?.errors?.email?.[0]}
        />
        <Input
          label={t('phone')}
          name="phone"
          type="tel"
          autoComplete="tel"
          error={state?.errors?.phone?.[0]}
        />
      </div>

      {(inquiryType === 'test_drive') && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label={t('preferredDate')}
            name="preferred_date"
            type="date"
            min={new Date().toISOString().split('T')[0]}
          />
          <Input
            label={t('preferredTime')}
            name="preferred_time"
            type="time"
          />
        </div>
      )}

      <Textarea
        label={t('message')}
        name="message"
        required
        rows={5}
        error={state?.errors?.message?.[0]}
      />

      {/* Privacy */}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="privacy_accepted"
          name="privacy_accepted"
          value="true"
          required
          className="mt-1 h-4 w-4 rounded border-2 border-input-border accent-brand"
        />
        <label htmlFor="privacy_accepted" className="text-sm text-muted">
          {t.rich('privacy', {
            link: (chunks) => (
              <Link href="/datenschutz" className="text-link hover:underline">
                {chunks}
              </Link>
            ),
          })}
          {' *'}
        </label>
      </div>

      {/* Inline validation errors */}
      {state && !state.success && state.errors && (
        <div className="flex items-start gap-2 rounded-lg bg-error-bg p-4 text-sm text-error">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {tv('checkInputs')}
        </div>
      )}

      <Button type="submit" isLoading={isPending} size="lg" fullWidth>
        {isPending ? t('sending') : t('submit')}
      </Button>
    </form>
  );
}
