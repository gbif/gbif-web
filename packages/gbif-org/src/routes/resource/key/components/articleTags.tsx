import { RenderIfChildren } from '@/components/renderIfChildren';
import { notNull } from '@/utils/notNull';
import { FormattedMessage } from 'react-intl';
import { ArticleAuxiliary } from './articleAuxiliary';
import { Pills } from './pills';

type Props = {
  resource?: {
    countriesOfCoverage?: (string | null)[] | null;
    topics?: (string | null)[] | null;
    audiences?: (string | null)[] | null;
    purposes?: (string | null)[] | null;
  };
  className?: string;
};

export function ArticleTags({ className, resource = {} }: Props) {
  return (
    <RenderIfChildren
      as={ArticleAuxiliary}
      className={className}
      label={<FormattedMessage id="cms.auxiliary.subject" />}
    >
      {resource.countriesOfCoverage && (
        <Pills
          label={<FormattedMessage id="filters.country.name" />}
          pills={resource.countriesOfCoverage.filter(notNull).map((x) => ({
            key: x,
            content: <FormattedMessage id={`enums.countryCode.${x}`} />,
          }))}
        />
      )}

      {resource.topics && (
        <Pills
          label={<FormattedMessage id="filters.topics.name" />}
          pills={resource.topics.filter(notNull).map((x) => ({
            key: x,
            content: <FormattedMessage id={`enums.topics.${x}`} />,
          }))}
        />
      )}

      {resource.audiences && (
        <Pills
          label={<FormattedMessage id="filters.audiences.name" />}
          pills={resource.audiences.filter(notNull).map((x) => ({
            key: x,
            content: <FormattedMessage id={`enums.audiences.${x}`} />,
          }))}
        />
      )}

      {resource.purposes && (
        <Pills
          label={<FormattedMessage id="filters.purposes.name" />}
          pills={resource.purposes.filter(notNull).map((x) => ({
            key: x,
            content: <FormattedMessage id={`enums.purposes.${x}`} />,
          }))}
        />
      )}
    </RenderIfChildren>
  );
}
