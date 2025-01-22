import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

type Props = {
  resource: {
    title?: string | null;
    maybeTitle?: string | null;
    excerpt?: string | null;
    primaryImage?: {
      file?: {
        url?: string | null;
      } | null;
      description?: string | null;
    } | null;
  };
};

export function ArticleOpenGraph({ resource }: Props) {
  const location = useLocation();
  const config = useConfig();
  const { locale } = useI18n();

  if (!config.openGraph) return null;

  const alternativeLocales = config.languages.filter((lang) => lang.code !== locale.code);
  const url = `${config.baseUrl}${location.pathname}`;
  const title = resource.title ?? resource.maybeTitle;

  return (
    <Helmet htmlAttributes={{ prefix: 'og: http://ogp.me/ns# article: http://ogp.me/ns/article#' }}>
      {title && <meta property="og:title" content={title} />}
      <meta property="og:type" content="article" />
      {resource.excerpt && <meta property="og:description" content={resource.excerpt} />}
      {resource.primaryImage?.file?.url && (
        <meta property="og:image" content={resource.primaryImage.file.url} />
      )}
      {resource.primaryImage?.description && (
        <meta property="og:image:alt" content={resource.primaryImage.description} />
      )}
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={locale.localeCode} />
      {alternativeLocales.map((lang) => (
        <meta property="og:locale:alternate" content={lang.localeCode} key={lang.code} />
      ))}
    </Helmet>
  );
}
