import { ArticleAuxiliary } from './ArticleAuxiliary';
import { FormattedMessage } from 'react-intl';
import { Pills } from './Pills';
import { notNull } from '@/utils/notNull';
import { RenderIfChildren } from '@/components/RenderIfChildren';

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
    <RenderIfChildren as={ArticleAuxiliary} label="Subject" className={className}>
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
