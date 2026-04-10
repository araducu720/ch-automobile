'use client';

import { useEffect, useRef, type RefObject } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Hook that adds the "visible" class to an element when it enters the viewport.
 * Pair with CSS classes: reveal, reveal-left, reveal-right, reveal-scale.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.classList.remove('visible');
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return ref;
}

/**
 * Hook that observes multiple children of a container for scroll reveal.
 * Works with the stagger-children CSS class.
 */
export function useScrollRevealGroup<T extends HTMLElement = HTMLDivElement>(
  selector = '.reveal',
  options: UseScrollRevealOptions = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null);
  const { threshold = 0.1, rootMargin = '0px 0px -40px 0px', once = true } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const children = container.querySelectorAll(selector);

    if (prefersReduced) {
      children.forEach((child) => child.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (once) observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [selector, threshold, rootMargin, once]);

  return ref;
}
