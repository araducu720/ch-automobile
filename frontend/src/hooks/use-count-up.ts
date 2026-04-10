'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  startOnView?: boolean;
}

/**
 * Animated counter hook — counts from 0 to `end` when visible.
 */
export function useCountUp({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  startOnView = true,
}: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = performance.now();
    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  const display = `${prefix}${decimals > 0 ? value.toFixed(decimals) : value}${suffix}`;

  return { ref, value, display };
}
