import { Link } from '@/i18n/navigation';
import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VehicleCardSkeleton } from '@/components/ui/skeleton';
import { COMPANY_INFO } from '@/lib/constants';
import { LocalBusinessJsonLd } from '@/components/seo/json-ld';
import {
  Car,
  Shield,
  Handshake,
  ArrowLeftRight,
  CreditCard,
  Globe,
  ChevronRight,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { FeaturedVehicles } from './featured-vehicles';
import {
  StatCounter,
  RevealSection,
  StaggerGroup,
} from './home-client';

const serviceIcons = [Car, Shield, Handshake, ArrowLeftRight, CreditCard, Globe];
const serviceKeys = ['premium', 'quality', 'consulting', 'tradeIn', 'financing', 'euService'] as const;

export default async function HomePage() {
  const t = await getTranslations('home');
  const th = await getTranslations('hero');
  const tc = await getTranslations('common');

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--brand-primary-light)] py-24 lg:py-36">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-[var(--brand-primary)] opacity-[0.06] blur-3xl animate-float" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--brand-accent)] opacity-[0.08] blur-3xl animate-float-delayed" />

        <div className="container-main relative z-10">
          <div className="max-w-3xl">
            <Badge variant="accent" className="mb-5 text-sm px-3.5 py-1.5 hero-entrance">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {t('badge')}
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl xl:text-7xl hero-entrance hero-entrance-delay-1">
              {th('title')}
            </h1>

            <p className="mt-6 text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed hero-entrance hero-entrance-delay-2">
              {th('subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 hero-entrance hero-entrance-delay-3">
              <Button size="lg" className="animate-pulse-glow" asChild>
                <Link href="/fahrzeuge">
                  <Car className="h-5 w-5" />
                  {th('cta')}
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/kontakt">
                  {th('ctaSecondary')}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Animated stats */}
            <div className="mt-14 flex flex-wrap gap-10 hero-entrance hero-entrance-delay-4">
              <StatCounter end={100} suffix="+" label={t('stats.customers')} />
              <StatCounter end={50} suffix="+" label={t('stats.vehicles')} />
              <StatCounter end={15} suffix="+" label={t('stats.experience')} />
            </div>
          </div>
        </div>

        {/* Gradient overlay right */}
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[var(--brand-primary)] to-transparent" />
        </div>
      </section>

      {/* ===== FEATURED VEHICLES ===== */}
      <section className="py-16 lg:py-24 bg-[var(--bg-primary)]">
        <div className="container-main">
          <RevealSection>
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                  {t('featured.title')}
                </h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                  {t('featured.subtitle')}
                </p>
              </div>
              <Link
                href="/fahrzeuge"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] hover:underline"
              >
                {t('featured.viewAll')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </RevealSection>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeaturedVehicles />
          </Suspense>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/fahrzeuge">
                {t('featured.viewAllMobile')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-16 lg:py-24 bg-[var(--bg-secondary)]">
        <div className="container-main">
          <RevealSection>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t('services.title')}</h2>
              <p className="mt-3 text-[var(--text-secondary)]">
                {t('services.subtitle')}
              </p>
            </div>
          </RevealSection>

          <StaggerGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceKeys.map((key, index) => {
              const Icon = serviceIcons[index];
              return (
                <div key={key} className="reveal">
                  <Card className="card-hover h-full">
                    <CardContent className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--brand-primary-light)] mb-4">
                        <Icon className="h-6 w-6 text-[var(--brand-primary)]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                        {t(`services.${key}.title`)}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {t(`services.${key}.description`)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 lg:py-24 bg-[var(--bg-primary)]">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <RevealSection direction="left">
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">
                {t('whyUs.title')}
              </h2>
              <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                {t('whyUs.description')}
              </p>
              <ul className="mt-6 space-y-4">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                    <CheckCircle className="h-5 w-5 shrink-0 text-[var(--status-success)] mt-0.5" />
                    {t(`whyUs.benefits.${idx}`)}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/kontakt">{t('whyUs.contactNow')}</Link>
                </Button>
              </div>
            </RevealSection>

            <RevealSection direction="right">
              <Card className="bg-[var(--bg-secondary)]">
                <CardContent className="p-8 space-y-6">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    {t('whyUs.visitUs')}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{COMPANY_INFO.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {COMPANY_INFO.street}<br />
                          {COMPANY_INFO.zip} {COMPANY_INFO.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-[var(--brand-primary)] shrink-0" />
                      <a
                        href={`tel:${COMPANY_INFO.phone}`}
                        className="text-sm text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors"
                      >
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-[var(--brand-primary)] shrink-0 mt-0.5" />
                      <div className="text-sm text-[var(--text-secondary)]">
                        <p>Mo–Fr: {COMPANY_INFO.hours.weekdays}</p>
                        <p>Sa: {COMPANY_INFO.hours.saturday}</p>
                        <p>So: {COMPANY_INFO.hours.sunday}</p>
                      </div>
                    </div>
                  </div>

                  <div className="h-48 rounded-lg bg-[var(--bg-tertiary)] overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(`${COMPANY_INFO.street}, ${COMPANY_INFO.zip} ${COMPANY_INFO.city}`)}&zoom=15`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={t('whyUs.mapTitle')}
                    />
                  </div>
                </CardContent>
              </Card>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)] via-[#1e3a8a] to-[#0f172a]" />
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(245,158,11,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96,165,250,0.3) 0%, transparent 50%)',
        }} />

        <div className="container-main relative z-10 text-center">
          <RevealSection>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              {t('cta.title')}
            </h2>
            <p className="mt-4 text-lg text-white/75 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link href="/fahrzeuge">{t('cta.explore')}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <a href={`tel:${COMPANY_INFO.phone}`}>
                  <Phone className="h-5 w-5" />
                  {COMPANY_INFO.phone}
                </a>
              </Button>
            </div>
          </RevealSection>
        </div>
      </section>
    </>
  );
}
