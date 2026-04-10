import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { TradeInForm } from '@/components/forms/trade-in-form';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, CheckCircle, Clock, Shield } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('tradeIn');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function TradeInPage() {
  const t = await getTranslations('tradeInPage');

  const benefits = [
    { icon: CheckCircle, title: t('fairEvaluation.title'), desc: t('fairEvaluation.description') },
    { icon: Clock, title: t('quickProcess.title'), desc: t('quickProcess.description') },
    { icon: Shield, title: t('safeEasy.title'), desc: t('safeEasy.description') },
  ];

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <Badge variant="accent" className="mb-4">
            <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
            {t('badge')}
          </Badge>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {t('title')}
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-12">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <Card key={b.title}>
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-primary-light)] shrink-0">
                    <Icon className="h-5 w-5 text-[var(--brand-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">{b.title}</h3>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{b.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Form */}
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6 lg:p-8">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                {t('formTitle')}
              </h2>
              <TradeInForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
