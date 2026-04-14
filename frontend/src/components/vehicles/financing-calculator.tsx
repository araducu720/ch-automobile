'use client';

import { useState, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/utils';
import { Calculator, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── PMT formula: monthly payment for an annuity loan ──────────────────────
function calcMonthlyRate(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const LOAN_TERMS = [12, 24, 36, 48, 60, 72, 84];
const DEFAULT_RATE = 5.99; // % p.a. — current market rate April 2026

interface FinancingCalculatorProps {
  vehiclePrice?: number;
  /** compact = sidebar widget, full = dedicated page */
  variant?: 'compact' | 'full';
  vehicleName?: string;
  vehicleSlug?: string;
}

export function FinancingCalculator({
  vehiclePrice,
  variant = 'compact',
  vehicleName,
  vehicleSlug,
}: FinancingCalculatorProps) {
  const t = useTranslations('financing');

  const [price, setPrice] = useState<number>(vehiclePrice ?? 25000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [termMonths, setTermMonths] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_RATE);

  const downPaymentEur = useMemo(
    () => Math.round((price * downPaymentPct) / 100),
    [price, downPaymentPct],
  );
  const loanAmount = useMemo(() => Math.max(0, price - downPaymentEur), [price, downPaymentEur]);
  const monthly = useMemo(
    () => calcMonthlyRate(loanAmount, interestRate, termMonths),
    [loanAmount, interestRate, termMonths],
  );
  const totalAmount = useMemo(() => monthly * termMonths + downPaymentEur, [monthly, termMonths, downPaymentEur]);
  const totalInterest = useMemo(() => Math.max(0, totalAmount - price), [totalAmount, price]);

  const financingRequestParams = useMemo(() => {
    const base = vehicleSlug ? `/fahrzeuge/${vehicleSlug}` : '/kontakt';
    return `${base}?type=financing&monthly=${Math.round(monthly)}&term=${termMonths}&down=${downPaymentEur}`;
  }, [vehicleSlug, monthly, termMonths, downPaymentEur]);

  const handlePriceChange = useCallback((val: string) => {
    const n = parseInt(val.replace(/\D/g, ''), 10);
    if (!isNaN(n)) setPrice(n);
  }, []);

  if (variant === 'compact') {
    return (
      <div className="rounded-xl border border-border bg-secondary p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Calculator className="h-4 w-4 text-brand" />
          {t('calculator')}
        </h3>

        <div className="space-y-4">
          {/* Down payment % slider */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{t('downPayment')}</span>
              <span className="font-medium text-foreground">
                {downPaymentPct}% — {formatPrice(downPaymentEur)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand"
              aria-label={t('downPayment')}
              aria-valuetext={`${downPaymentPct}% — ${formatPrice(downPaymentEur)}`}
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
              <span>0%</span><span>80%</span>
            </div>
          </div>

          {/* Loan term */}
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">{t('loanTerm')}</label>
            <div className="flex flex-wrap gap-1.5">
              {LOAN_TERMS.map((m) => (
                <button
                  key={m}
                  onClick={() => setTermMonths(m)}
                  className={cn(
                    'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                    termMonths === m
                      ? 'border-brand bg-brand text-white'
                      : 'border-border bg-background text-muted-foreground hover:border-brand hover:text-brand',
                  )}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>

          {/* Interest rate */}
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>{t('interestRateLabel')}</span>
              <span className="font-medium text-foreground">{interestRate.toFixed(2)} %</span>
            </div>
            <input
              type="range"
              min={1.99}
              max={12.99}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand"
              aria-label={t('interestRate')}
              aria-valuetext={`${interestRate.toFixed(2)}% p.a.`}
            />
            <div className="mt-0.5 flex justify-between text-[10px] text-muted-foreground">
              <span>1,99%</span><span>12,99%</span>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-lg border border-brand/20 bg-brand/5 p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 text-center">
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t('monthlyRate')}</div>
                <div className="text-2xl font-bold text-brand">{formatPrice(Math.round(monthly))}</div>
                <div className="text-[10px] text-muted-foreground">{t('perMonth')}</div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="text-[10px] text-muted-foreground">{t('loanAmount')}</div>
                <div className="text-sm font-semibold text-foreground">{formatPrice(Math.round(loanAmount))}</div>
              </div>
              <div className="border-t border-border pt-2">
                <div className="text-[10px] text-muted-foreground">{t('totalInterest')}</div>
                <div className="text-sm font-semibold text-foreground">{formatPrice(Math.round(totalInterest))}</div>
              </div>
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-muted-foreground/70">{t('disclaimer')}</p>

          <Link
            href={financingRequestParams}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-brand bg-brand/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
          >
            <Calculator className="h-4 w-4" />
            {t('requestFinancing')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Full variant ────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
        <Calculator className="h-7 w-7 text-brand" />
        {t('calculator')}
      </h2>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left inputs */}
        <div className="space-y-6">
          {/* Vehicle price */}
          {!vehiclePrice && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{t('vehiclePrice')}</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={price.toLocaleString('de-DE')}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-8 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <input
                type="range"
                min={3000}
                max={500000}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand"
                aria-label={t('vehiclePrice')}
                aria-valuetext={formatPrice(price)}
              />
              <div className="mt-0.5 flex justify-between text-[11px] text-muted-foreground">
                <span>3.000 €</span><span>500.000 €</span>
              </div>
            </div>
          )}

          {vehiclePrice && (
            <div className="rounded-lg border border-border bg-secondary p-4">
              <div className="text-xs text-muted-foreground">{t('vehiclePrice')}</div>
              <div className="text-xl font-bold text-foreground">{formatPrice(vehiclePrice)}</div>
              {vehicleName && <div className="mt-0.5 text-xs text-muted-foreground">{vehicleName}</div>}
            </div>
          )}

          {/* Down payment */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{t('downPayment')}</label>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-sm font-bold text-brand">{downPaymentPct}%</span>
                <span className="text-sm font-semibold text-foreground">{formatPrice(downPaymentEur)}</span>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={80}
              step={5}
              value={downPaymentPct}
              onChange={(e) => setDownPaymentPct(Number(e.target.value))}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand"
              aria-label={t('downPayment')}
              aria-valuetext={`${downPaymentPct}% — ${formatPrice(downPaymentEur)}`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0% (0 €)</span>
              <span>80% ({formatPrice(Math.round(price * 0.8))})</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground/70">{t('downPaymentHint')}</p>
          </div>

          {/* Loan term */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">{t('loanTerm')}</label>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
              {LOAN_TERMS.map((m) => (
                <button
                  key={m}
                  onClick={() => setTermMonths(m)}
                  className={cn(
                    'rounded-lg border py-2 text-sm font-semibold transition-all',
                    termMonths === m
                      ? 'border-brand bg-brand text-white shadow-sm'
                      : 'border-border bg-background text-muted-foreground hover:border-brand/50 hover:text-brand',
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{t('months', { n: termMonths })}</p>
          </div>

          {/* Interest rate */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">{t('interestRateLabel')}</label>
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-sm font-bold text-foreground">
                {interestRate.toFixed(2)} %
              </span>
            </div>
            <input
              type="range"
              min={1.99}
              max={12.99}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-brand"
              aria-label={t('interestRateLabel')}
              aria-valuetext={`${interestRate.toFixed(2)}% p.a.`}
            />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>1,99% p.a.</span><span>12,99% p.a.</span>
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div className="flex flex-col gap-4">
          {/* Monthly rate hero */}
          <div className="flex-1 rounded-2xl border-2 border-brand/30 bg-gradient-to-br from-brand/5 to-brand/10 p-6 text-center">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">{t('monthlyRate')}</div>
            <div className="mt-2 text-5xl font-extrabold tabular-nums text-brand">
              {formatPrice(Math.round(monthly))}
            </div>
            <div className="text-sm text-muted-foreground">{t('perMonth')}</div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-brand/20 pt-4">
              <div className="text-center">
                <div className="text-[11px] text-muted-foreground">{t('downPayment')}</div>
                <div className="text-sm font-bold text-foreground">{formatPrice(downPaymentEur)}</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted-foreground">{t('loanAmount')}</div>
                <div className="text-sm font-bold text-foreground">{formatPrice(Math.round(loanAmount))}</div>
              </div>
              <div className="text-center">
                <div className="text-[11px] text-muted-foreground">{t('totalInterest')}</div>
                <div className="text-sm font-bold text-foreground">{formatPrice(Math.round(totalInterest))}</div>
              </div>
            </div>

            <div className="mt-3 border-t border-brand/20 pt-3">
              <div className="text-[11px] text-muted-foreground">{t('totalAmount')}</div>
              <div className="text-lg font-bold text-foreground">{formatPrice(Math.round(totalAmount))}</div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={financingRequestParams}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-brand/90 hover:shadow-lg active:scale-95"
          >
            <Calculator className="h-5 w-5" />
            {t('requestFinancing')}
          </Link>

          <p className="text-center text-[11px] leading-relaxed text-muted-foreground/70">{t('disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Inline monthly estimate for vehicle cards / detail page ─────────────────
export function MonthlyRateBadge({ price, className }: { price: number; className?: string }) {
  const t = useTranslations('financing');
  const monthly = calcMonthlyRate(price * 0.8, DEFAULT_RATE, 48); // 20% down, 48M, ~6%
  return (
    <span className={cn('inline-flex items-center gap-1 text-xs text-muted-foreground', className)}>
      <Calculator className="h-3 w-3" />
      {t('estimatedRate', { amount: formatPrice(Math.round(monthly)) })}
    </span>
  );
}

// ─── Collapsible variant for sidebar (without requiring page navigation) ─────
export function FinancingCalculatorAccordion({
  vehiclePrice,
  vehicleName,
  vehicleSlug,
}: {
  vehiclePrice: number;
  vehicleName?: string;
  vehicleSlug?: string;
}) {
  const t = useTranslations('financing');
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-secondary overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-4 text-left"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <Calculator className="h-4 w-4 text-brand" />
          {t('calculator')}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="border-t border-border p-4 pt-0 -mt-1">
          <FinancingCalculator
            vehiclePrice={vehiclePrice}
            vehicleName={vehicleName}
            vehicleSlug={vehicleSlug}
            variant="compact"
          />
        </div>
      )}
    </div>
  );
}
