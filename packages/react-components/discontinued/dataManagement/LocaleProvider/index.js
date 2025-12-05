import React from 'react';
import { IntlProvider } from "react-intl";
import LocaleContext from './LocaleContext';
import useTranslation from '../useTranslation';

export function LocaleProvider({locale, messages: customMessages = {}, ...props}) {
  const { messages, localeMap, loading, error } = useTranslation({ locale });
  return <LocaleContext.Provider value={{localeMap}}>
    <IntlProvider locale={locale} messages={{...messages, ...customMessages}} {...props} />
  </LocaleContext.Provider>
}
