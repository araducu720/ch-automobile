import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { COMPANY_INFO } from '@/lib/constants';
import {
  Shield,
  Heart,
  Trophy,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Target,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

const timelineYears = ['2009', '2013', '2018', '2021', '2024'] as const;
const valueKeys = ['passion', 'trust', 'excellence', 'personality'] as const;
const valueIcons = [Heart, Shield, Target, Users];

export default async function AboutPage() {
  const t = await getTranslations('about');
  const tc = await getTranslations('common');
  const tn = await getTranslations('nav');
  const th = await getTranslations('home');

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background py-20 lg:py-28">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-brand opacity-[0.05] blur-3xl" />
        <div className="container-main relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-5">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {t('badge')}
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t('title')}
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {t('story.title')}
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                {t('story.p1')}
              </p>
              <p className="mt-4 text-muted leading-relaxed">
                {t('story.p2')}
              </p>
              <div className="mt-8 flex flex-wrap gap-8">
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-brand">100+</div>
                  <div className="text-sm text-muted mt-1">{th('stats.customers')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-brand">50+</div>
                  <div className="text-sm text-muted mt-1">{th('stats.vehicles')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-extrabold text-brand">15+</div>
                  <div className="text-sm text-muted mt-1">{th('stats.experience')}</div>
                </div>
              </div>
            </div>

            {/* Decorative card */}
            <Card className="bg-gradient-to-br from-brand to-[#1e3a8a] text-white overflow-hidden">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
                <Trophy className="h-12 w-12 text-accent mb-6" />
                <h3 className="text-2xl font-bold mb-4">{t('promise.title')}</h3>
                <blockquote className="text-white/85 text-lg leading-relaxed italic">
                  &ldquo;{t('promise.quote')}&rdquo;
                </blockquote>
                <p className="mt-4 text-white/60 text-sm font-medium">
                  — {t('promise.author')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-foreground">{t('milestones.title')}</h2>
            <p className="mt-3 text-muted">
              {t('milestones.subtitle')}
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand via-accent to-brand lg:-translate-x-px" />

            {timelineYears.map((year, idx) => (
              <div key={year} className={`relative flex items-start gap-6 mb-12 last:mb-0 ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Dot */}
                <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full bg-brand border-4 border-secondary -translate-x-[5px] lg:-translate-x-[5px] mt-1.5 z-10" />

                {/* Content */}
                <div className={`ml-10 lg:ml-0 lg:w-[calc(50%-2rem)] ${idx % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'}`}>
                  <Badge variant="outline" className="mb-2 font-mono text-xs">{year}</Badge>
                  <h3 className="text-lg font-semibold text-foreground">{t(`timeline.${year}.title`)}</h3>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{t(`timeline.${year}.description`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-main">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground">{t('values.title')}</h2>
            <p className="mt-3 text-muted">
              {t('values.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {valueKeys.map((key, index) => {
              const Icon = valueIcons[index];
              return (
                <Card key={key} className="card-hover text-center">
                  <CardContent className="p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-light mx-auto mb-5">
                      <Icon className="h-7 w-7 text-brand" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t(`values.${key}.title`)}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">
                      {t(`values.${key}.description`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 lg:py-24 bg-secondary">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl font-bold text-foreground">
                {t('visitCta.title')}
              </h2>
              <p className="mt-4 text-muted leading-relaxed">
                {t('visitCta.description')}
              </p>

              <div className="mt-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light shrink-0">
                    <MapPin className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tc('address')}</p>
                    <p className="text-sm text-muted">
                      {COMPANY_INFO.street}, {COMPANY_INFO.zip} {COMPANY_INFO.city}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light shrink-0">
                    <Phone className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tc('phone')}</p>
                    <a
                      href={`tel:${COMPANY_INFO.phone}`}
                      className="text-sm text-muted hover:text-brand transition-colors"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light shrink-0">
                    <Mail className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tc('email')}</p>
                    <a
                      href={`mailto:${COMPANY_INFO.email}`}
                      className="text-sm text-muted hover:text-brand transition-colors"
                    >
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light shrink-0">
                    <Clock className="h-5 w-5 text-brand" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{tc('openingHours')}</p>
                    <div className="text-sm text-muted space-y-0.5">
                      <p>{tc('weekdays')}: {COMPANY_INFO.hours.weekdays}</p>
                      <p>Sa: {COMPANY_INFO.hours.saturday}</p>
                      <p>So: {COMPANY_INFO.hours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Button asChild>
                  <Link href="/kontakt">
                    {tn('contact')}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="h-[400px] rounded-xl bg-tertiary overflow-hidden shadow-lg">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${COMPANY_INFO.coordinates.lng - 0.01}%2C${COMPANY_INFO.coordinates.lat - 0.005}%2C${COMPANY_INFO.coordinates.lng + 0.01}%2C${COMPANY_INFO.coordinates.lat + 0.005}&layer=mapnik&marker=${COMPANY_INFO.coordinates.lat}%2C${COMPANY_INFO.coordinates.lng}`}
                width="100%"
                height="100%"
                className="border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={tc('mapTitle')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-[#1e3a8a] to-[#0f172a]" />
        <div className="container-main relative z-10 text-center">
          <h2 className="text-3xl font-bold text-white">
            {t('cta.title')}
          </h2>
          <p className="mt-4 text-lg text-white/75 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="accent" size="lg" asChild>
              <Link href="/fahrzeuge">{t('cta.viewVehicles')}</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/kontakt">{tn('contact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
