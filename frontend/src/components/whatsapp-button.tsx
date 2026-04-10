'use client';

import { cn } from '@/lib/utils';
import { COMPANY_INFO } from '@/lib/constants';
import { MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function WhatsAppButton() {
  const t = useTranslations('whatsapp');
  const phone = COMPANY_INFO.phone.replace(/[^0-9+]/g, '');
  const message = encodeURIComponent(t('defaultMessage'));
  const href = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-20 right-6 z-30 whatsapp-btn',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]',
      )}
      aria-label={t('ariaLabel')}
      title={t('tooltip')}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
