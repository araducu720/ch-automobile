'use client';

import { useActionState, useRef, useState, useCallback } from 'react';
import {
  submitReservationAction,
  confirmInvoiceAction,
  uploadSignedContractAction,
  uploadPaymentProofAction,
  type ActionResult,
} from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import {
  CheckCircle,
  AlertCircle,
  CreditCard,
  Car,
  Copy,
  Check,
  FileText,
  Upload,
  Download,
  FileCheck,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

/* ============================================
   Types
   ============================================ */

interface PurchaseWizardProps {
  vehicleId: number;
  vehicleName: string;
  vehiclePrice: string;
}

type WizardStep = 'details' | 'invoice' | 'signature' | 'payment' | 'completed';

interface ReservationData {
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
}

/* ============================================
   Step Indicator
   ============================================ */

const STEPS: WizardStep[] = ['details', 'invoice', 'signature', 'payment'];

function StepIndicator({
  currentStep,
  t,
}: {
  currentStep: WizardStep;
  t: ReturnType<typeof useTranslations<'reservation'>>;
}) {
  const stepLabels: Record<string, string> = {
    details: t('wizard.stepDetails'),
    invoice: t('wizard.stepInvoice'),
    signature: t('wizard.stepSignature'),
    payment: t('wizard.stepPayment'),
  };

  const stepIcons: Record<string, React.ReactNode> = {
    details: <Car className="h-4 w-4" />,
    invoice: <FileText className="h-4 w-4" />,
    signature: <FileCheck className="h-4 w-4" />,
    payment: <Upload className="h-4 w-4" />,
  };

  const currentIdx = currentStep === 'completed' ? 4 : STEPS.indexOf(currentStep);

  return (
    <div className="mb-6">
      {/* Step counter text */}
      <p className="mb-3 text-center text-xs font-medium text-muted-foreground">
        {currentStep !== 'completed' &&
          t('wizard.step', { current: currentIdx + 1, total: 4 })}
      </p>

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
              {/* Bar segment */}
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'bg-success'
                    : isCurrent
                      ? 'bg-brand'
                      : 'bg-border'
                }`}
              />
              {/* Label */}
              <div className="flex items-center gap-1">
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isCompleted
                      ? 'text-success'
                      : isCurrent
                        ? 'text-brand'
                        : 'text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="inline h-3 w-3" />
                  ) : (
                    stepIcons[step]
                  )}
                </span>
                <span
                  className={`hidden text-[10px] font-medium sm:inline ${
                    isCompleted
                      ? 'text-success'
                      : isCurrent
                        ? 'text-brand'
                        : 'text-muted-foreground'
                  }`}
                >
                  {stepLabels[step]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================
   Step 1: Personal Details
   ============================================ */

function StepDetails({
  vehicleId,
  vehicleName,
  vehiclePrice,
  onSuccess,
  t,
  tc,
}: {
  vehicleId: number;
  vehicleName: string;
  vehiclePrice: string;
  onSuccess: (data: ReservationData) => void;
  t: ReturnType<typeof useTranslations<'reservation'>>;
  tc: ReturnType<typeof useTranslations<'common'>>;
}) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
      const result = await submitReservationAction(null, formData);
      if (result.success && result.data) {
        onSuccess(result.data as ReservationData);
      }
      return result;
    },
    null,
  );

  return (
    <div>
      {/* Vehicle summary */}
      <div className="mb-5 rounded-lg bg-secondary p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Car className="h-4 w-4" />
          {t('reserveVehicle')}
        </div>
        <p className="mt-1 font-semibold text-foreground">{vehicleName}</p>
        <p className="text-sm text-muted">{vehiclePrice}</p>
        <p className="mt-2 text-xs text-muted-foreground">{t('deposit10Percent')}</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="vehicle_id" value={vehicleId} />

        {state && !state.success && (
          <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        <h4 className="font-medium text-foreground">{t('personalData')}</h4>

        <Input
          label="Name"
          name="customer_name"
          required
          error={state?.errors?.customer_name?.[0]}
        />

        <div className="grid gap-3 sm:grid-cols-2">
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

        <h4 className="pt-1 font-medium text-foreground">{t('billingAddress')}</h4>

        <Input
          label={t('street')}
          name="billing_street"
          error={state?.errors?.billing_street?.[0]}
        />

        <div className="grid gap-3 sm:grid-cols-3">
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
        <label className="flex items-start gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="privacy_accepted"
            value="true"
            required
            className="mt-1 h-4 w-4 rounded border-2 border-input-border accent-brand"
          />
          <span>
            {t.rich('privacyAndTerms', {
              privacyLink: (chunks) => (
                <Link
                  href="/datenschutz"
                  className="text-primary-600 underline hover:text-primary-700"
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
              termsLink: (chunks) => (
                <Link
                  href="/agb"
                  className="text-primary-600 underline hover:text-primary-700"
                  target="_blank"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={isPending} rightIcon={<ChevronRight className="h-4 w-4" />}>
          {isPending ? t('processing') : t('wizard.next')}
        </Button>
      </form>
    </div>
  );
}

/* ============================================
   Step 2: Invoice Review
   ============================================ */

function StepInvoice({
  data,
  onConfirm,
  t,
}: {
  data: ReservationData;
  onConfirm: () => void;
  t: ReturnType<typeof useTranslations<'reservation'>>;
}) {
  const [copiedRef, setCopiedRef] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const copyReference = async (ref: string) => {
    await navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const result = await confirmInvoiceAction(data.payment_reference);
      if (result.success) {
        onConfirm();
      }
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-foreground">
          {t('wizard.invoiceTitle')}
        </h4>
        <p className="mt-1 text-sm text-muted">
          {t('wizard.invoiceSubtitle')}
        </p>
      </div>

      {/* Vehicle info */}
      <div className="rounded-lg bg-secondary p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t('wizard.invoiceFor')}
        </p>
        <p className="mt-1 font-semibold text-foreground">
          {data.vehicle.brand} {data.vehicle.model} ({data.vehicle.year})
        </p>
        <div className="mt-2 flex justify-between text-sm">
          <span className="text-muted">{t('wizard.totalPrice')}:</span>
          <span className="font-semibold text-foreground">{data.vehicle.price}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-muted">{t('wizard.depositRequired')}:</span>
          <span className="font-bold text-brand">{data.formatted_deposit}</span>
        </div>
      </div>

      {/* Bank details */}
      <div className="rounded-lg bg-secondary p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <CreditCard className="h-4 w-4" />
          {t('paymentInfo')}
        </div>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">{t('reference')}:</span>
            <button
              onClick={() => copyReference(data.payment_reference)}
              className="flex items-center gap-1 font-mono font-bold text-brand hover:text-brand-hover"
            >
              {data.payment_reference}
              {copiedRef ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between">
            <span className="text-muted">{t('accountHolder')}:</span>
            <span className="text-foreground">{data.bank_details.account_holder}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('bank')}:</span>
            <span className="text-foreground">{data.bank_details.bank_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">IBAN:</span>
            <span className="font-mono text-foreground">{data.bank_details.iban}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">BIC:</span>
            <span className="font-mono text-foreground">{data.bank_details.bic}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{t('amount')}:</span>
            <span className="font-bold text-foreground">{data.formatted_deposit}</span>
          </div>
        </div>
      </div>

      {/* Payment method info */}
      <p className="text-xs text-muted-foreground">{t('wizard.paymentMethod')}</p>

      {/* Expiry notice */}
      <div className="rounded-lg border border-warning bg-warning-bg p-3 text-sm text-warning">
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

      <Button
        className="w-full"
        onClick={handleConfirm}
        disabled={isConfirming}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        {isConfirming ? t('processing') : t('wizard.confirmInvoice')}
      </Button>
    </div>
  );
}

/* ============================================
   Step 3: Contract Download & Signed Contract Upload
   ============================================ */

function StepSignature({
  reference,
  onSuccess,
  t,
}: {
  reference: string;
  onSuccess: () => void;
  t: ReturnType<typeof useTranslations<'reservation'>>;
}) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
      const result = await uploadSignedContractAction(null, formData);
      if (result.success) {
        onSuccess();
      }
      return result;
    },
    null,
  );

  const [fileName, setFileName] = useState<string | null>(null);
  const [contractDownloaded, setContractDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const contractUrl = `${apiUrl}/reservations/${reference}/contract`;

  const handleDownloadContract = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(contractUrl);
      if (!response.ok) throw new Error('Download fehlgeschlagen');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kaufvertrag-${reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setContractDownloaded(true);
    } catch {
      // fallback – open in new tab
      window.open(contractUrl, '_blank');
      setContractDownloaded(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setFileName(file.name);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-foreground">
          {t('wizard.contractTitle')}
        </h4>
        <p className="mt-1 text-sm text-muted">
          {t('wizard.contractSubtitle')}
        </p>
      </div>

      {/* Step A: Download Contract */}
      <div className="rounded-xl border-2 border-border bg-secondary p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white text-sm font-bold">
            1
          </div>
          <h5 className="font-semibold text-foreground">
            {t('wizard.downloadContractTitle')}
          </h5>
        </div>
        <p className="text-sm text-muted mb-4">
          {t('wizard.downloadContractDesc')}
        </p>
        <Button
          type="button"
          onClick={handleDownloadContract}
          disabled={isDownloading}
          className={`w-full ${contractDownloaded ? 'opacity-80' : ''}`}
          rightIcon={contractDownloaded ? <Check className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        >
          {isDownloading
            ? t('wizard.generatingContract')
            : contractDownloaded
              ? t('wizard.contractDownloaded')
              : t('wizard.downloadContract')}
        </Button>
        {contractDownloaded && (
          <p className="mt-2 flex items-center gap-1 text-xs text-success">
            <CheckCircle className="h-3.5 w-3.5" />
            {t('wizard.contractDownloadedHint')}
          </p>
        )}
      </div>

      {/* Step B: Upload Signed Contract */}
      <div className={`rounded-xl border-2 p-5 transition-all ${
        contractDownloaded
          ? 'border-brand bg-secondary'
          : 'border-border bg-secondary opacity-60'
      }`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
            contractDownloaded
              ? 'bg-brand text-white'
              : 'bg-border text-muted-foreground'
          }`}>
            2
          </div>
          <h5 className="font-semibold text-foreground">
            {t('wizard.uploadSignedTitle')}
          </h5>
        </div>
        <p className="text-sm text-muted mb-3">
          {t('wizard.uploadSignedDesc')}
        </p>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="reference" value={reference} />

          {state && !state.success && (
            <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{state.message}</span>
            </div>
          )}

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={contractDownloaded ? handleDrop : undefined}
            onClick={contractDownloaded ? () => fileInputRef.current?.click() : undefined}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              contractDownloaded
                ? 'cursor-pointer border-input-border bg-input hover:border-brand hover:bg-secondary'
                : 'cursor-not-allowed border-border bg-secondary'
            }`}
          >
            <FileCheck className="mb-3 h-10 w-10 text-muted-foreground" />
            {fileName ? (
              <p className="text-sm font-medium text-brand">
                {t('wizard.fileSelected', { name: fileName })}
              </p>
            ) : (
              <p className="text-sm text-muted">
                {t('wizard.dragOrClick')}
              </p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              {t('wizard.signedContractHint')}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              name="signed_contract"
              accept="image/png,image/jpeg,image/webp,application/pdf"
              onChange={handleFileChange}
              disabled={!contractDownloaded}
              className="hidden"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || !fileName || !contractDownloaded}
            rightIcon={<ChevronRight className="h-4 w-4" />}
          >
            {isPending ? t('wizard.uploading') : t('wizard.uploadSignedContract')}
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ============================================
   Step 4: Payment Proof Upload
   ============================================ */

function StepPayment({
  reference,
  onSuccess,
  t,
}: {
  reference: string;
  onSuccess: () => void;
  t: ReturnType<typeof useTranslations<'reservation'>>;
}) {
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    async (_prevState, formData) => {
      const result = await uploadPaymentProofAction(null, formData);
      if (result.success) {
        onSuccess();
      }
      return result;
    },
    null,
  );

  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
      setFileName(file.name);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-semibold text-foreground">
          {t('wizard.paymentTitle')}
        </h4>
        <p className="mt-1 text-sm text-muted">
          {t('wizard.paymentSubtitle')}
        </p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="reference" value={reference} />

        {state && !state.success && (
          <div className="flex items-start gap-2 rounded-lg bg-error-bg p-3 text-sm text-error">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-input-border bg-input p-8 transition-colors hover:border-brand hover:bg-secondary"
        >
          <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
          {fileName ? (
            <p className="text-sm font-medium text-brand">
              {t('wizard.fileSelected', { name: fileName })}
            </p>
          ) : (
            <p className="text-sm text-muted">
              {t('wizard.dragOrClick')}
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {t('wizard.paymentHint')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            name="payment_proof"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isPending || !fileName}
          rightIcon={<ChevronRight className="h-4 w-4" />}
        >
          {isPending ? t('wizard.uploading') : t('wizard.uploadPayment')}
        </Button>
      </form>
    </div>
  );
}

/* ============================================
   Step 5: Completed
   ============================================ */

function StepCompleted({
  reference,
  t,
}: {
  reference: string;
  t: ReturnType<typeof useTranslations<'reservation'>>;
}) {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
        <CheckCircle className="h-10 w-10 text-success" />
      </div>
      <h4 className="text-lg font-bold text-foreground">
        {t('wizard.completedTitle')}
      </h4>
      <p className="text-sm text-muted">
        {t('wizard.completedSubtitle')}
      </p>
      <div className="rounded-lg bg-secondary p-4">
        <p className="text-sm font-medium text-foreground">
          {t('wizard.completedRef', { reference })}
        </p>
      </div>

      {/* Admin confirmation notice */}
      <div className="rounded-lg border border-brand bg-secondary p-4 text-left">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-brand shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t('wizard.adminConfirmTitle')}
            </p>
            <p className="mt-1 text-xs text-muted">
              {t('wizard.adminConfirmDesc')}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {t('wizard.completedContact')}
      </p>
    </div>
  );
}

/* ============================================
   Main Wizard Component
   ============================================ */

export function PurchaseWizard({ vehicleId, vehicleName, vehiclePrice }: PurchaseWizardProps) {
  const t = useTranslations('reservation');
  const tc = useTranslations('common');
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);

  const handleDetailsSuccess = (data: ReservationData) => {
    setReservationData(data);
    setCurrentStep('invoice');
  };

  const handleInvoiceConfirm = () => {
    setCurrentStep('signature');
  };

  const handleSignatureSuccess = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSuccess = () => {
    setCurrentStep('completed');
  };

  return (
    <div>
      {/* Title */}
      <h3 className="mb-1 text-lg font-bold text-foreground">
        {t('wizard.title')}
      </h3>
      <p className="mb-4 text-sm text-muted">{t('subtitle')}</p>

      {/* Step indicator */}
      {currentStep !== 'completed' && (
        <StepIndicator currentStep={currentStep} t={t} />
      )}

      {/* Step content */}
      {currentStep === 'details' && (
        <StepDetails
          vehicleId={vehicleId}
          vehicleName={vehicleName}
          vehiclePrice={vehiclePrice}
          onSuccess={handleDetailsSuccess}
          t={t}
          tc={tc}
        />
      )}

      {currentStep === 'invoice' && reservationData && (
        <StepInvoice data={reservationData} onConfirm={handleInvoiceConfirm} t={t} />
      )}

      {currentStep === 'signature' && reservationData && (
        <StepSignature
          reference={reservationData.payment_reference}
          onSuccess={handleSignatureSuccess}
          t={t}
        />
      )}

      {currentStep === 'payment' && reservationData && (
        <StepPayment
          reference={reservationData.payment_reference}
          onSuccess={handlePaymentSuccess}
          t={t}
        />
      )}

      {currentStep === 'completed' && reservationData && (
        <StepCompleted reference={reservationData.payment_reference} t={t} />
      )}
    </div>
  );
}
