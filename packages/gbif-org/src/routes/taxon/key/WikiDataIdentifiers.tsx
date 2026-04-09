import { WikiDataIdentifier } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import styles from './wikiIdentifiers.module.css';
const WikiDataIdentifiers = ({
  identifiers,
  source,
}: {
  identifiers: WikiDataIdentifier[];
  source: WikiDataIdentifier;
}) => {
  return (
    <div className={cn(styles.wikidataIdentifiers, 'g-text-sm g-text-slate-500')}>
      <div className={styles.chipList}>
        {identifiers.map((i: WikiDataIdentifier, idx: number) => (
          <a key={idx} href={`${i?.url}`} className={styles.chip}>
            {i?.label?.value}
          </a>
        ))}
      </div>
      {source && (
        <div className="g-mt-2">
          <span>
            <FormattedMessage id="taxon.source" />
          </span>{' '}
          <a href={source?.url}>wikidata:{source?.id}</a>
        </div>
      )}
    </div>
  );
};

export default WikiDataIdentifiers;
