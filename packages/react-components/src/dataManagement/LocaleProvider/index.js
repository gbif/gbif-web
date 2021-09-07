import React from 'react';
import { IntlProvider } from "react-intl";
import LocaleContext from './LocaleContext';
import useTranslation from '../useTranslation';

export function LocaleProvider({locale, messages: customMessages, gbifLocale, ...props}) {
  const { messages, loading, error } = useTranslation({ locale });
  return <LocaleContext.Provider value={{gbifLocale: ''}}>
    <IntlProvider locale={locale} messages={customMessages || messages} {...props} />
  </LocaleContext.Provider>
}
