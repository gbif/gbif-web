import React from 'react';
import { useLoaderData, useLocation, useNavigate, Location } from 'react-router-dom';
import { useDefaultLocale } from '@/hooks/useDefaultLocale';
import { Config } from '@/contexts/config/config';
import { IntlProvider } from 'react-intl';

type Locale = Config['languages'][number];

type I18n = {
  locale: Locale;
  changeLocale: (targetLocaleCode: string) => void;
};

const I18nContext = React.createContext<I18n | null>(null);

type Props = {
  locale: Locale;
  children?: React.ReactNode;
};

export function I18nProvider({ locale, children }: Props): React.ReactElement {
  const navigate = useNavigate();
  const { messages } = useLoaderData() as { messages: Record<string, string> | null };
  const defaultLocale = useDefaultLocale();
  const location = useLocation();

  const context = React.useMemo(() => {
    return {
      locale,
      changeLocale: (targetLocaleCode: string) => {
        if (locale.code === targetLocaleCode) return;

        const newHref = replaceLocale({
          currentLocaleCode: locale.code,
          targetLocaleCode,
          defaultLocale,
          location,
        });

        navigate(newHref);
      },
    };
  }, [locale, navigate, defaultLocale, location]);

  return (
    <I18nContext.Provider value={context}>
      {/* There is an assumption here that the codes provided in the config are valid locale codes recognized by react-intl. This is not checked. */}
      <IntlProvider
        messages={messages || {}}
        locale={locale?.reactIntlLocale ?? locale.code}
        defaultLocale={defaultLocale.code}
      >
        {children}
      </IntlProvider>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18n {
  const ctx = React.useContext(I18nContext);

  if (ctx === null) {
    throw new Error('useI18n must be used within a I18nProvider');
  }

  return ctx;
}

type ReplaceLocaleOptions = {
  currentLocaleCode: string;
  targetLocaleCode: string;
  defaultLocale: Locale;
  location: Location;
};

export function replaceLocale({
  currentLocaleCode,
  targetLocaleCode,
  defaultLocale,
  location,
}: ReplaceLocaleOptions): string {
  const currentLocaleIsDefault = defaultLocale.code === currentLocaleCode;
  const currentPrefix = currentLocaleIsDefault ? '/' : `/${currentLocaleCode}/`;

  const targetLocaleIsDefault = defaultLocale.code === targetLocaleCode;
  const targetPrefix = targetLocaleIsDefault ? '/' : `/${targetLocaleCode}/`;

  const newPathname = location.pathname.replace(currentPrefix, targetPrefix);
  const target = `${newPathname}${location.search}`;

  return target;
}
