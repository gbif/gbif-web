import { LanguageOption } from '@/config/config';
import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { extractLocaleFromPathname } from './extractLocaleFromURL';

type I18nContextValue = {
  locale: LanguageOption;
  setLocale: (locale: string) => void;
  defaultLocale: LanguageOption;
  availableLocales: LanguageOption[];
  localizeLink: (link: string, targetLocale?: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18nContext must be used within a I18nContextProvider');
  }
  return context;
}

type Props = {
  children: React.ReactNode;
  locale: LanguageOption;
  defaultLocale: LanguageOption;
  availableLocales: LanguageOption[];
};

export function I18nContextProvider({ children, locale, defaultLocale, availableLocales }: Props) {
  const { messages } = useLoaderData() as { messages: Record<string, string> | null };
  const location = useLocation();
  const navigate = useNavigate();

  const localizeLink = useCallback(
    (link: string, targetLocale: string = locale.code) => {
      const currentLocale = extractLocaleFromPathname(
        link,
        availableLocales.map((localOption) => localOption.code),
        defaultLocale.code
      );
      // If full url with http, then consider it hardcoded and do not localize, but just use it as is. It is probably an external link
      // this has been added to accomodate the case where a hosted portal is referencing a dataset outside our control
      if (/^https?:\/\//.test(link)) {
        return link;
      }

      // Handle root links
      const currentPath = currentLocale === defaultLocale.code ? '/' : `/${currentLocale}`;
      const tagetPath = targetLocale === defaultLocale.code ? '/' : `/${targetLocale}`;

      if (link === currentPath) return link.replace(currentPath, tagetPath);

      // Handle sub pages
      const currentPrefix = currentLocale === defaultLocale.code ? '/' : `/${currentLocale}/`;
      const targetPrefix = targetLocale === defaultLocale.code ? '/' : `/${targetLocale}/`;

      // Relative links with not start with the "currentPrefix" and should not be localized
      if (!link.startsWith(currentPrefix)) return link;

      return link.replace(currentPrefix, targetPrefix);
    },
    [availableLocales, defaultLocale.code, locale.code]
  );

  const setLocale = useCallback(
    (locale: string) => {
      let targetLink = localizeLink(location.pathname, locale);
      if (location.search) targetLink += location.search;
      navigate(targetLink);
    },
    [navigate, location.pathname, location.search, localizeLink]
  );

  const value: I18nContextValue = useMemo(
    () => ({
      locale,
      setLocale,
      defaultLocale,
      localizeLink,
      availableLocales,
    }),
    [locale, defaultLocale, setLocale, availableLocales, localizeLink]
  );

  useEffect(() => {
    const targetLink = localizeLink(location.pathname, locale.code);

    if (location.pathname !== targetLink) {
      navigate(targetLink);
    }
  }, [locale, navigate, location.pathname, availableLocales, defaultLocale, localizeLink]);

  return (
    <I18nContext.Provider value={value}>
      <IntlProvider
        messages={messages || {}}
        locale={locale.reactIntlLocale ?? locale.code}
        defaultLocale={defaultLocale.reactIntlLocale ?? defaultLocale.code}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}
