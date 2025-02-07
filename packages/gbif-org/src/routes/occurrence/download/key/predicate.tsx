import { TaxonLabel } from '@/components/filters/displayNames';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export const PredicateDisplay = ({ predicate }) => {
  const intl = useIntl();

  const getTranslation = (key) => intl.formatMessage({ id: key });

  const getValueTranslation = useMemo(() => {
    return ({ key, value }) => {
      // choose label based on key
      // if no label is found, return the value
      switch (key) {
        case 'BASIS_OF_RECORD':
          return getTranslation(`enums.basisOfRecord.${value}`);
        case 'TAXON_KEY':
          return <TaxonLabel id={value} />;
        case 'ISSUE':
          return getTranslation(`enums.occurrenceIssue.${value}`);
        default:
          return value;
      }
    };
  }, []);

  if (!predicate) return null;

  switch (predicate.type) {
    case 'and':
    case 'or':
      return (
        <ul>
          <div className="join">
            <span dir="auto" className="node">
              {getTranslation(`downloadKey.predicate.${predicate.type}`)}
            </span>
            <span dir="auto" className="discreet">
              {getTranslation(`downloadKey.predicate.joinDescriptions.${predicate.type}`)}
            </span>
          </div>
          {predicate.predicates.map((p, index) => (
            <li key={index} className={p.type === 'or' || p.type === 'and' ? 'hasChildren' : ''}>
              <div className="pipe"></div>
              <PredicateDisplay predicate={p} />
            </li>
          ))}
        </ul>
      );
    case 'not':
      return (
        <ul className="not">
          <div className="join">
            <span dir="auto" className="node">
              {getTranslation(`downloadKey.predicate.not`)}
            </span>
            <span dir="auto" className="discreet">
              {getTranslation(`downloadKey.predicate.joinDescriptions.not`)}
            </span>
          </div>
          <li>
            <div className="pipe"></div>
            <PredicateDisplay predicate={predicate.predicate} />
          </li>
        </ul>
      );
    case 'in':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`filterNames.${predicate.key}`)}
          </span>
          <ol className="inline-bullet-list">
            {predicate.values.map((option, index) => (
              <li
                key={index}
                className="node-value"
                title={getTranslation(`downloadKey.predicate.joinDescriptions.or`)}
              >
                <span dir="auto">{getValueTranslation({ key: predicate.key, value: option })}</span>
              </li>
            ))}
          </ol>
        </div>
      );
    case 'isNotNull':
    case 'isNull':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`filterNames.${predicate.key}`)}
          </span>
          <span dir="auto" className="node-value discreet--very">
            {getTranslation(`downloadKey.predicate.${predicate.type}`)}
          </span>
        </div>
      );
    case 'within':
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`filterNames.${predicate.key}`)}
          </span>
          <span dir="auto" className="node-value">
            {predicate.geometry}
          </span>
        </div>
      );
    default:
      return (
        <div className="leaf">
          <span dir="auto" className="node">
            {getTranslation(`filterNames.${predicate.key}`)}
          </span>
          <span dir="auto" className="node-value">
            {getValueTranslation({ key: predicate.key, value: predicate.value })}
          </span>
        </div>
      );
  }
};
