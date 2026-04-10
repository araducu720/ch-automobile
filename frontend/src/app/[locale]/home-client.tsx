'use client';

import { useRef, useEffect, useState, type ReactNode } from 'react';
import { useCountUp } from '@/hooks/use-count-up';

/* ===== Animated counter stat ===== */
interface StatCounterProps {
  end: number;
  suffix: string;
  label: string;
}

export function StatCounter({ end, suffix, label }: StatCounterProps) {
  const { ref, display } = useCountUp({ end, suffix, duration: 2200 });

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>}>
      <div className="text-3xl font-extrabold text-[var(--brand-primary)] number-counter">
        {display}
      </div>
      <div className="text-sm text-[var(--text-secondary)] mt-0.5">{label}</div>
    </div>
  );
}

/* ===== Scroll-reveal wrapper ===== */
interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}

export function RevealSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dirClass = {
    up: 'reveal',
    left: 'reveal-left',
    right: 'reveal-right',
    scale: 'reveal-scale',
  }[direction];

  return (
    <div
      ref={ref}
      className={`${dirClass} ${visible ? 'visible' : ''} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ===== Staggered children wrapper ===== */
interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
}

export function StaggerGroup({ children, className = '' }: StaggerGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = container.querySelectorAll('.reveal');

    if (prefersReduced) {
      items.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' },
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stagger-children ${className}`}>
      {children}
    </div>
  );
}
