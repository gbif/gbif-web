import { useConfig } from '@/contexts/config/config';
import { useI18n, replaceLocale } from '@/contexts/i18n';
import { useDefaultLocale } from '@/hooks/useDefaultLocale';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function AlternativeLanguages() {
  const config = useConfig();
  const { locale } = useI18n();
  const location = useLocation();
  const defaultLocale = useDefaultLocale();

  return (
    <Helmet>
      {config.languages
        .filter((l) => l.code !== locale.code)
        .map((l) => {
          const targetPathname = replaceLocale({
            currentLocaleCode: locale.code,
            targetLocaleCode: l.code,
            location,
            defaultLocale,
          });

          const href = `${config.baseUrl}${targetPathname}`;

          return <link key={l.code} rel="alternate" hrefLang={l.code} href={href} />;
        })}
    </Helmet>
  );
}
