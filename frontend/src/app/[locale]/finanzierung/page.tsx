import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FinancingCalculator } from '@/components/vehicles/financing-calculator';
import { COMPANY_INFO } from '@/lib/constants';
import {
  Calculator,
  CheckCircle,
  Clock,
  Car,
  FileText,
  Handshake,
  Phone,
  MessageCircle,
  TrendingDown,
  Shield,
  Zap,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('financing');
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function FinancingPage() {
  const t = await getTranslations('financing');
  const tn = await getTranslations('nav');

  const steps = [
    { icon: Car, title: t('step1Title'), desc: t('step1Desc'), step: 1 },
    { icon: Calculator, title: t('step2Title'), desc: t('step2Desc'), step: 2 },
    { icon: FileText, title: t('step3Title'), desc: t('step3Desc'), step: 3 },
    { icon: Handshake, title: t('step4Title'), desc: t('step4Desc'), step: 4 },
  ];

  const benefits = [
    { icon: Clock, text: t('benefit1') },
    { icon: TrendingDown, text: t('benefit2') },
    { icon: Zap, text: t('benefit3') },
    { icon: Calculator, text: t('benefit4') },
    { icon: Shield, text: t('benefit5') },
    { icon: CheckCircle, text: t('benefit6') },
  ];

  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand/5 via-background to-secondary py-16 lg:py-24">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Start</Link>
            <span>/</span>
            <span className="text-foreground">{t('navLabel')}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
                <Calculator className="h-4 w-4" />
                {t('navLabel')}
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-foreground lg:text-5xl">
                {t('title')}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>

              {/* Key stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { value: 'ab 3,99%', label: 'Zinsen p.a.' },
                  { value: '24h', label: 'Kreditentscheid' },
                  { value: '84M', label: 'Max. Laufzeit' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                    <div className="text-xl font-extrabold text-brand">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick calculator */}
            <div>
              <FinancingCalculator variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">{t('howItWorks')}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, desc, step }) => (
              <div
                key={step}
                className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-2.5 py-0.5 text-xs font-bold text-white">
                  {step}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-secondary py-16">
        <div className="container-main">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-foreground">{t('benefitsTitle')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-4 w-4 text-brand" />
                </div>
                <p className="text-sm font-medium text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example rates table */}
      <section className="py-16">
        <div className="container-main max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground">{t('exampleComputation')}</h2>
          <div className="overflow-hidden rounded-2xl border border-border shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Fahrzeugpreis</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Anzahlung (20%)</th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">Laufzeit</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand">Rate/Monat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { price: 10000, down: 2000, term: 48, rate: 188 },
                  { price: 20000, down: 4000, term: 60, rate: 282 },
                  { price: 35000, down: 7000, term: 72, rate: 408 },
                  { price: 60000, down: 12000, term: 84, rate: 634 },
                  { price: 100000, down: 20000, term: 84, rate: 1057 },
                ].map((row) => (
                  <tr key={row.price} className="transition-colors hover:bg-secondary/50">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {row.down.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.term} Monate</td>
                    <td className="px-4 py-3 font-bold text-brand">
                      ~{row.rate.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}/Mon.
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-border bg-secondary/50 px-4 py-2.5 text-xs text-muted-foreground">
              * Beispielrechnungen bei 5,99% effektivem Jahreszinssatz. Unverbindlich.
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand to-brand/80 py-16 text-white">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold">{t('ctaTitle')}</h2>
          <p className="mt-3 text-white/80">{t('ctaDesc')}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/kontakt?type=financing"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-brand shadow-lg transition hover:bg-white/90"
            >
              <Calculator className="h-5 w-5" />
              {t('ctaButton')}
            </Link>
            <a
              href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              {COMPANY_INFO.phone}
            </a>
            <a
              href={`https://wa.me/4915175606841?text=${encodeURIComponent('Ich interessiere mich für eine Fahrzeugfinanzierung. Bitte beraten Sie mich.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-6 py-3 font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Link to vehicles */}
      <section className="py-12 text-center">
        <div className="container-main">
          <p className="mb-4 text-muted-foreground">Noch kein Fahrzeug gewählt?</p>
          <Link
            href="/fahrzeuge"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-brand px-6 py-3 font-semibold text-brand transition hover:bg-brand hover:text-white"
          >
            <Car className="h-5 w-5" />
            {tn('vehicles')} entdecken
          </Link>
        </div>
      </section>
    </div>
  );
}
