import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { stripTags } from '@/utils/stripTags';
import { Helmet } from 'react-helmet-async';
import { useIntl } from 'react-intl';

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
  const intl = useIntl();
  const config = useConfig();
  const { localizeLink } = useI18n();

  // Alternative languages are handled globally by the <AlternativeLanguages /> component

  return (
    <Helmet>
      <title>{title || intl.formatMessage({ id: 'phrases.defaultPageTitle' })}</title>
      {noindex && nofollow && <meta name="robots" content="noindex,nofollow"></meta>}
      {!noindex && nofollow && <meta name="robots" content="nofollow"></meta>}
      {path && <meta property="og:url" content={`${config.baseUrl}${localizeLink(path)}`}></meta>}
      {path && <link rel="canonical" href={`${config.baseUrl}${localizeLink(path)}`} />}
      <meta
        property="og:title"
        content={title || intl.formatMessage({ id: 'phrases.defaultPageTitle' })}
      />
      <meta
        property="og:description"
        content={stripTags(
          description || intl.formatMessage({ id: 'phrases.defaultPageDescription' })
        )}
      />
      {!!imageUrl && <meta property="og:image" content={imageUrl} />}
      {!!jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd, null, 2)}</script>}
    </Helmet>
  );
};

export default PageMetaData;
