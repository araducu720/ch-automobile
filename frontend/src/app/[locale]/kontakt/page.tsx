import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactForm } from '@/components/forms/contact-form';
import { Card, CardContent } from '@/components/ui/card';
import { COMPANY_INFO } from '@/lib/constants';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ContactPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const vehicleId = params.vehicle ? Number(params.vehicle) : undefined;
  const inquiryType = params.type;
  const t = await getTranslations('contact');
  const tc = await getTranslations('common');

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-3 text-muted">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 lg:p-8">
                <ContactForm vehicleId={vehicleId} inquiryType={inquiryType} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-5">
                <h2 className="text-lg font-semibold text-foreground">{t('info.title')}</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{tc('address')}</p>
                      <p className="text-sm text-muted">
                        {COMPANY_INFO.street}<br />
                        {COMPANY_INFO.zip} {COMPANY_INFO.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{tc('phone')}</p>
                      <a href={`tel:${COMPANY_INFO.phone}`} className="text-sm text-link hover:underline">
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{tc('email')}</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-sm text-link hover:underline">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{tc('openingHours')}</p>
                      <div className="text-sm text-muted">
                        <p>{tc('weekdays')}: {COMPANY_INFO.hours.weekdays}</p>
                        <p>Sa: {COMPANY_INFO.hours.saturday}</p>
                        <p>So: {COMPANY_INFO.hours.sunday}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-xl">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${COMPANY_INFO.coordinates.lng - 0.01}%2C${COMPANY_INFO.coordinates.lat - 0.005}%2C${COMPANY_INFO.coordinates.lng + 0.01}%2C${COMPANY_INFO.coordinates.lat + 0.005}&layer=mapnik&marker=${COMPANY_INFO.coordinates.lat}%2C${COMPANY_INFO.coordinates.lng}`}
                  width="100%"
                  height="250"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={tc('mapTitle')}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
