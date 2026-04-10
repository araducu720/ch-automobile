'use client';

import { sanitizeHtml } from '@/lib/sanitize-html';

interface SafeHtmlProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content after sanitizing it with DOMPurify to prevent XSS.
 * Use this instead of raw dangerouslySetInnerHTML for user-generated content.
 */
export function SafeHtml({ html, className }: SafeHtmlProps) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
