import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useDefaultLocale } from '@/hooks/useDefaultLocale';
import { Config } from '@/contexts/config';
import { IntlProvider } from 'react-intl';

type I18n = {
  locale: Config['languages'][number];
  changeLocale: (targetLocaleCode: string) => void;
};

const I18nContext = React.createContext<I18n | null>(null);

type Props = {
  locale: Config['languages'][number];
  children?: React.ReactNode;
};

export function I18nProvider({ locale, children }: Props): React.ReactElement {
  const data = useLoaderData();
  const navigate = useNavigate();
  const defaultLocale = useDefaultLocale();

  console.log(data);

  // This function will only work client side as it uses window.location
  // If it needs to work server side, you can use the location from useLocation. This will however rerender the children of this component every time the location changes.
  const context = React.useMemo(() => {
    return {
      locale,
      changeLocale: (targetLocaleCode: string) => {
        if (locale.code === targetLocaleCode) return;

        const currentLocaleIsDefault = defaultLocale.code === locale.code;
        const currentPrefix = currentLocaleIsDefault ? '/' : `/${locale.code}/`;

        const targetLocaleIsDefault = defaultLocale.code === targetLocaleCode;
        const targetPrefix = targetLocaleIsDefault ? '/' : `/${targetLocaleCode}/`;

        const newPathname = window.location.pathname.replace(currentPrefix, targetPrefix);
        const target = `${newPathname}${window.location.search}`;

        navigate(target);
      },
    };
  }, [locale, navigate, defaultLocale]);

  return (
    <I18nContext.Provider value={context}>
      <IntlProvider
        messages={{ key: data as string }}
        locale={locale.code}
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
