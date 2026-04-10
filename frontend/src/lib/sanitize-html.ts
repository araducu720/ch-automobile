'use client';

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Only allows safe tags and attributes — strips scripts, event handlers, etc.
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') return dirty;

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'a',
      'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'pre', 'code', 'span', 'div', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'hr', 'sub', 'sup', 'small',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height',
      'class', 'id', 'style', 'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
  });
}
