import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { extractLocaleFromPathname } from './extractLocaleFromURL';
import { LanguageOption } from '@/config/config';
import { IntlProvider } from 'react-intl';

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

      const currentPrefix = currentLocale === defaultLocale.code ? '/' : `/${currentLocale}/`;
      const targetPrefix = targetLocale === defaultLocale.code ? '/' : `/${targetLocale}/`;

      return link.replace(currentPrefix, targetPrefix);
    },
    [availableLocales, defaultLocale.code, locale.code]
  );

  const setLocale = useCallback(
    (locale: string) => {
      navigate(localizeLink(location.pathname, locale));
    },
    [navigate, location.pathname, localizeLink]
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
        locale={defaultLocale.reactIntlLocale ?? defaultLocale.code}
        defaultLocale={defaultLocale.reactIntlLocale ?? defaultLocale.code}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}
