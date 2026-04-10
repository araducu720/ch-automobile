'use client';

import { useActionState, useRef, useEffect, useState } from 'react';
import { submitReservationAction, type ActionResult } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, CreditCard, Car, Copy, Check } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

interface ReservationFormProps {
  vehicleId: number;
  vehicleName: string;
  vehiclePrice: string;
}

export function ReservationForm({ vehicleId, vehicleName, vehiclePrice }: ReservationFormProps) {
  const t = useTranslations('reservation');
  const tc = useTranslations('common');
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    submitReservationAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  const copyReference = async (ref: string) => {
    await navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  // Show success state with bank details
  if (state?.success && state.data) {
    const data = state.data as {
      payment_reference: string;
      formatted_deposit: string;
      expires_at: string;
      bank_details: {
        bank_name: string;
        iban: string;
        bic: string;
        account_holder: string;
        reference: string;
        amount: string;
      };
      vehicle: {
        brand: string;
        model: string;
        year: number;
        price: string;
      };
    };

    return (
      <div className="rounded-xl border border-[var(--status-success)] bg-[var(--status-success-bg)] p-6">
        <div className="mb-4 flex items-center gap-2 text-[var(--status-success)]">
          <CheckCircle className="h-6 w-6" />
          <h3 className="text-lg font-semibold">{t('successTitle')}</h3>
        </div>

        <p className="mb-6 text-sm text-[var(--status-success)]">
          {state.message}
        </p>

        <div className="space-y-4">
          {/* Vehicle info */}
          <div className="rounded-lg bg-[var(--bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              <Car className="h-4 w-4" />
              {t('vehicle')}
            </div>
            <p className="mt-1 font-semibold text-[var(--text-primary)]">
              {data.vehicle.brand} {data.vehicle.model} ({data.vehicle.year})
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{data.vehicle.price}</p>
          </div>

          {/* Bank details */}
          <div className="rounded-lg bg-[var(--bg-elevated)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
              <CreditCard className="h-4 w-4" />
              {t('paymentInfo')}
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('amount')}:</span>
                <span className="font-bold text-[var(--text-primary)]">{data.formatted_deposit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">{t('reference')}:</span>
                <button
                  onClick={() => copyReference(data.payment_reference)}
                  className="flex items-center gap-1 font-mono font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                >
                  {data.payment_reference}
                  {copiedRef ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <hr className="border-[var(--border-primary)]" />
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('accountHolder')}:</span>
                <span className="text-[var(--text-primary)]">{data.bank_details.account_holder}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">{t('bank')}:</span>
                <span className="text-[var(--text-primary)]">{data.bank_details.bank_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">IBAN:</span>
                <span className="font-mono text-[var(--text-primary)]">{data.bank_details.iban}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">BIC:</span>
                <span className="font-mono text-[var(--text-primary)]">{data.bank_details.bic}</span>
              </div>
            </div>
          </div>

          {/* Expiry notice */}
          <div className="rounded-lg border border-[var(--status-warning)] bg-[var(--status-warning-bg)] p-3 text-sm text-[var(--status-warning)]">
            <strong>{t('importantNote')}</strong>{' '}
            {t('expiresOn', {
              date: new Date(data.expires_at).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Vehicle summary */}
      <div className="mb-6 rounded-lg bg-[var(--bg-secondary)] p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <Car className="h-4 w-4" />
          {t('reserveVehicle')}
        </div>
        <p className="mt-1 font-semibold text-[var(--text-primary)]">{vehicleName}</p>
        <p className="text-sm text-[var(--text-secondary)]">{vehiclePrice}</p>
        <p className="mt-2 text-xs text-[var(--text-tertiary)]">
          {t('deposit10Percent')}
        </p>
      </div>

      <form ref={formRef} action={formAction} className="space-y-5">
        <input type="hidden" name="vehicle_id" value={vehicleId} />

        {state && !state.success && (
          <div className="flex items-start gap-2 rounded-lg bg-[var(--status-error-bg)] p-3 text-sm text-[var(--status-error)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <h4 className="font-medium text-[var(--text-primary)]">{t('personalData')}</h4>

        <Input
          label="Name"
          name="customer_name"
          required
          error={state?.errors?.customer_name?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={tc('email')}
            name="customer_email"
            type="email"
            required
            error={state?.errors?.customer_email?.[0]}
          />
          <Input
            label={tc('phone')}
            name="customer_phone"
            type="tel"
            required
            error={state?.errors?.customer_phone?.[0]}
          />
        </div>

        <h4 className="pt-2 font-medium text-[var(--text-primary)]">{t('billingAddress')}</h4>

        <Input
          label={t('street')}
          name="billing_street"
          error={state?.errors?.billing_street?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label={t('zip')}
            name="billing_postal_code"
            error={state?.errors?.billing_postal_code?.[0]}
          />
          <div className="sm:col-span-2">
            <Input
              label={t('city')}
              name="billing_city"
              error={state?.errors?.billing_city?.[0]}
            />
          </div>
        </div>

        {/* Privacy */}
        <label className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <input
            type="checkbox"
            name="privacy_accepted"
            value="true"
            required
            className="mt-1 h-4 w-4 rounded border-2 border-[var(--border-input)] accent-[var(--brand-primary)]"
          />
          <span>
            {t.rich('privacyAndTerms', {
              privacyLink: (chunks) => (
                <Link href="/datenschutz" className="text-primary-600 underline hover:text-primary-700" target="_blank">
                  {chunks}
                </Link>
              ),
              termsLink: (chunks) => (
                <Link href="/agb" className="text-primary-600 underline hover:text-primary-700" target="_blank">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? t('processing') : t('submitBinding')}
        </Button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          {t('afterReservation')}
        </p>
      </form>
    </div>
  );
}
