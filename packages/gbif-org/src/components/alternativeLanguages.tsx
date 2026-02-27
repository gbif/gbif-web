import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function AlternativeLanguages() {
  const config = useConfig();
  const { locale, defaultLocale, localizeLink } = useI18n();
  const location = useLocation();

  return (
    <Helmet>
      {config.languages
        .filter((l) => l.code !== locale.code)
        .map((l) => (
          <link
            key={l.code}
            rel="alternate"
            hrefLang={l.code}
            href={config.baseUrl + localizeLink(location.pathname, l.code) + location.search}
          />
        ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={
          config.baseUrl + localizeLink(location.pathname, defaultLocale.code) + location.search
        }
      />
    </Helmet>
  );
}
