import React from 'react';
import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';

export function LanguageSelector(): React.ReactElement {
  const { locale, setLocale } = useI18n();
  const { languages } = useConfig();

  return (
    <select onChange={(e) => setLocale(e.target.value)} value={locale.code}>
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
