import { ArticleAuxiliary } from './ArticleAuxiliary';
import { FormattedMessage } from 'react-intl';
import { Pills } from './Pills';
import { notNull } from '@/utils/notNull';

type Props = {
  resource?: {
    countriesOfCoverage?: (string | null)[] | null;
    topics?: (string | null)[] | null;
    audiences?: (string | null)[] | null;
    purposes?: (string | null)[] | null;
    [key: string]: any; // This line allows for any other properties
  };
  className?: string;
};

export function ArticleTags({ className, resource = {} }: Props) {
  return (
    <>
      {(resource.countriesOfCoverage ||
        resource.topics ||
        resource.audiences ||
        resource.purposes) && (
        <ArticleAuxiliary label="Subject" className={className}>
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
        </ArticleAuxiliary>
      )}
    </>
  );
}
