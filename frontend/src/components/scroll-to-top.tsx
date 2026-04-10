'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export function ScrollToTop() {
  const t = useTranslations('accessibility');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-6 right-6 z-30 flex h-11 w-11 items-center justify-center',
        'rounded-full bg-[var(--brand-primary)] text-white shadow-lg',
        'hover:bg-[var(--brand-primary-hover)] transition-all duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none',
      )}
      aria-label={t('scrollToTop')}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
