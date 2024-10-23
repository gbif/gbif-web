import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

export function AlternativeLanguages() {
  const config = useConfig();
  const { locale, localizeLink } = useI18n();
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
            href={localizeLink(config.baseUrl + location.pathname, l.code)}
          />
        ))}
    </Helmet>
  );
}
