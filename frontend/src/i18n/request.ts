import { getRequestConfig } from 'next-intl/server';
import { merge } from '@/lib/deep-merge';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  // Always load default locale messages as a fallback base
  const defaultMessages = (await import(`../../messages/${routing.defaultLocale}.json`)).default;

  let messages = defaultMessages;

  if (locale !== routing.defaultLocale) {
    const localeMessages = (await import(`../../messages/${locale}.json`)).default;
    messages = merge(defaultMessages, localeMessages);
  }

  return {
    locale,
    messages,
    // Gracefully handle any missing keys — fall back to key path
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        return;
      }
      console.error(error);
    },
    getMessageFallback({ key, namespace }) {
      return namespace ? `${namespace}.${key}` : key;
    },
  };
});
