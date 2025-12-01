import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  let messages = (await import(`../../messages/${locale}.json`)).default;
  
  try {
    const legalMessages = (await import(`../../messages/legal_${locale}.json`)).default;
    messages = { ...messages, ...legalMessages };
  } catch (error) {
    // Legal messages might not exist for all locales or might fail to load
    console.warn(`Could not load legal messages for locale: ${locale}`);
  }

  return {
    locale,
    messages
  };
});
