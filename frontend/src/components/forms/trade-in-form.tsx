'use client';

import { useActionState, useRef, useEffect } from 'react';
import { submitTradeInAction, type ActionResult } from '@/app/actions';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { AlertCircle, Upload } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function TradeInForm() {
  const t = useTranslations('tradeIn.form');
  const tv = useTranslations('validation');
  const tc = useTranslations('common');
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitTradeInAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      toast.success(state.message || t('submit'));
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const conditionOptions = [
    { value: 'excellent', label: t('conditionExcellent') },
    { value: 'good', label: t('conditionGood') },
    { value: 'fair', label: t('conditionFair') },
    { value: 'poor', label: t('conditionPoor') },
  ];

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {/* Personal info */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{t('contactData')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Name" name="name" required autoComplete="name" error={state?.errors?.name?.[0]} />
          <Input label={tc('email')} name="email" type="email" required autoComplete="email" error={state?.errors?.email?.[0]} />
          <Input label={tc('phone')} name="phone" type="tel" required autoComplete="tel" error={state?.errors?.phone?.[0]} />
        </div>
      </div>

      {/* Vehicle info */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">{t('vehicleData')}</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label={t('vehicleBrand')} name="trade_brand" required placeholder={t('brandPlaceholder')} error={state?.errors?.trade_brand?.[0]} />
          <Input label={t('vehicleModel')} name="trade_model" required placeholder={t('modelPlaceholder')} error={state?.errors?.trade_model?.[0]} />
          <Input label={t('vehicleYear')} name="trade_year" type="number" required min={1960} max={new Date().getFullYear() + 1} error={state?.errors?.trade_year?.[0]} />
          <Input label={t('vehicleMileage')} name="trade_mileage" type="number" required min={0} placeholder="km" error={state?.errors?.trade_mileage?.[0]} />
          <Select label={t('vehicleCondition')} name="trade_condition" options={conditionOptions} required error={state?.errors?.trade_condition?.[0]} />
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {t('photos')}
        </label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border-secondary rounded-xl cursor-pointer bg-secondary hover:bg-tertiary transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-sm text-muted">{t('photoUploadHint')}</span>
            <input
              type="file"
              name="photos"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Additional info */}
      <Textarea
        label={t('vehicleDescription')}
        name="trade_description"
        rows={4}
        placeholder={t('descriptionPlaceholder')}
      />

      <Textarea
        label={t('damageDescription')}
        name="damage_description"
        rows={3}
        placeholder={t('damagePlaceholder')}
      />

      {/* Privacy */}
      <div className="flex items-start gap-2">
        <input type="checkbox" id="trade_privacy" name="privacy_accepted" value="true" required className="mt-1 h-4 w-4 rounded border-2 border-input-border accent-brand" />
        <label htmlFor="trade_privacy" className="text-sm text-muted">
          {t.rich('privacy', {
            link: (chunks) => (
              <Link href="/datenschutz" className="text-link hover:underline">{chunks}</Link>
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
