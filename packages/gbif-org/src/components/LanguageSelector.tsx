import React from 'react';
import { useConfig } from '@/contexts/config/config';
import { useI18n } from '@/contexts/i18n';

export function LanguageSelector(): React.ReactElement {
  const { locale, changeLocale } = useI18n();
  const { languages } = useConfig();

  return (
    <select onChange={(e) => changeLocale(e.target.value)} value={locale.code}>
      {languages.map((language) => (
        <option key={language.code} value={language.code}>
          {language.label}
        </option>
      ))}
    </select>
  );
}
