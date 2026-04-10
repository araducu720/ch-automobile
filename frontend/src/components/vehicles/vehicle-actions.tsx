'use client';

import { Button } from '@/components/ui/button';
import { Share2, Printer } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function VehicleActions() {
  const t = useTranslations('vehicles');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed — copy to clipboard as fallback
        await navigator.clipboard.writeText(window.location.href);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="icon-sm" aria-label={t('share')} onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label={t('print')} onClick={() => window.print()}>
        <Printer className="h-4 w-4" />
      </Button>
    </div>
  );
}
