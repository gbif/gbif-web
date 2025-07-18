import { useI18n } from '@/reactRouterPlugins';
import { stripTags } from '@/utils/stripTags';
import { Helmet } from 'react-helmet-async';
interface PageMetaDataProps {
  path?: string | null | undefined;
  title?: string | null | undefined;
  description?: string | null | undefined;
  jsonLd?: object;
  noindex?: boolean | undefined;
  nofollow?: boolean | undefined;
  imageUrl?: string | null | undefined;
}

const PageMetaData = ({
  path,
  title,
  description,
  jsonLd,
  noindex,
  nofollow,
  imageUrl,
}: PageMetaDataProps) => {
  const {
    locale: { code },
  } = useI18n();

  return (
    <Helmet>
      <title>{title || 'GBIF'}</title>
      {noindex && nofollow && <meta name="robots" content="noindex,nofollow"></meta>}
      {!noindex && nofollow && <meta name="robots" content="nofollow"></meta>}
      {code === 'en' && (
        <link rel="alternate" hrefLang={code} href={`${import.meta.env.PUBLIC_BASE_URL}${path}`} />
      )}
      {code !== 'en' && (
        <link
          rel="alternate"
          hrefLang={code}
          href={`${import.meta.env.PUBLIC_BASE_URL}/${code}${path}`}
        />
      )}
      {path && (
        <meta property="og:url" content={`${import.meta.env.PUBLIC_BASE_URL}${path}`}></meta>
      )}
      {!!title && <meta property="og:title" content={title} />}
      {!!description && <meta property="og:description" content={stripTags(description)} />}
      {!!imageUrl && <meta property="og:image" content={imageUrl} />}
      {!!jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd, null, 2)}</script>}
    </Helmet>
  );
};

export default PageMetaData;
