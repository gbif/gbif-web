import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPuzzlePiece, FaInfoCircle } from 'react-icons/fa';
import ExpandableSection from './ExpandableSection';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { optionStyles } from './utils';
import { useQuery } from '@/hooks/useQuery';
import { Predicate } from '@/gql/graphql';
import { useEffect, useMemo } from 'react';

interface ExtensionsSelectorProps {
  selectedExtensions: string[];
  onChange: (extensions: string[]) => void;
  isExpanded: boolean;
  onToggle: () => void;
  predicate?: Predicate;
}

const EXTENSION_COUNTS_QUERY = /* GraphQL */ `
  query ExtensionCounts($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      facet {
        dwcaExtension(size: 100) {
          key
          count
        }
      }
    }
  }
`;

const AVAILABLE_EXTENSIONS = [
  'http://rs.tdwg.org/ac/terms/Multimedia',
  'http://data.ggbn.org/schemas/ggbn/terms/Amplification',
  'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
  'http://purl.org/germplasm/germplasmTerm#MeasurementScore',
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
  'http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
  'http://rs.tdwg.org/dwc/terms/Identification',
  'http://rs.gbif.org/terms/1.0/Identifier',
  'http://rs.gbif.org/terms/1.0/Image',
  'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
  'http://rs.gbif.org/terms/1.0/Multimedia',
  'http://rs.gbif.org/terms/1.0/Reference',
  'http://rs.tdwg.org/dwc/terms/ResourceRelationship',
  'http://data.ggbn.org/schemas/ggbn/terms/Cloning',
  'http://data.ggbn.org/schemas/ggbn/terms/GelImage',
  'http://data.ggbn.org/schemas/ggbn/terms/Loan',
  'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
  'http://data.ggbn.org/schemas/ggbn/terms/Permit',
  'http://data.ggbn.org/schemas/ggbn/terms/Preparation',
  'http://data.ggbn.org/schemas/ggbn/terms/Preservation',
  'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
  'http://rs.tdwg.org/chrono/terms/ChronometricAge',
  'http://rs.gbif.org/terms/1.0/DNADerivedData',
];

export default function ExtensionsSelector({
  selectedExtensions,
  onChange,
  isExpanded,
  onToggle,
  predicate,
}: ExtensionsSelectorProps) {
  const { data, load, loading } = useQuery<
    { occurrenceSearch: { facet: { dwcaExtension: { key: string; count: number }[] } } },
    { predicate?: Predicate }
  >(EXTENSION_COUNTS_QUERY, { lazyLoad: true });

  useEffect(() => {
    load({ variables: { predicate } });
  }, [predicate, load]);

  const countsLoaded = data != null && !loading;

  const countsByExtension = useMemo(() => {
    const map = new Map<string, number>();
    if (data?.occurrenceSearch?.facet?.dwcaExtension) {
      for (const item of data.occurrenceSearch.facet.dwcaExtension) {
        map.set(item.key, item.count);
      }
    }
    return map;
  }, [data]);

  const intl = useIntl();

  const sortedExtensions = useMemo(
    () =>
      [...AVAILABLE_EXTENSIONS].sort((a, b) => {
        const labelA = intl.formatMessage({ id: `enums.dwcaExtension.${a}` });
        const labelB = intl.formatMessage({ id: `enums.dwcaExtension.${b}` });
        return labelA.localeCompare(labelB);
      }),
    [intl]
  );

  const toggleExtension = (extensionUrl: string) => {
    const newExtensions = selectedExtensions.includes(extensionUrl)
      ? selectedExtensions.filter((url) => url !== extensionUrl)
      : [...selectedExtensions, extensionUrl];
    onChange(newExtensions);
  };

  return (
    <ExpandableSection
      icon={<FaPuzzlePiece size={20} className="g-text-primary-600" />}
      title={<FormattedMessage id="occurrenceDownloadFlow.extensions" />}
      description={<FormattedMessage id="occurrenceDownloadFlow.selectAdditionalExtensions" />}
      summary={
        <FormattedMessage
          id="occurrenceDownloadFlow.nExtensionsSelected"
          values={{ count: selectedExtensions.length }}
        />
      }
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
        <div className="g-flex g-items-start g-gap-3">
          <FaInfoCircle size={16} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
          <p className="g-text-sm g-text-blue-800">
            <FormattedMessage id="occurrenceDownloadFlow.extensionsInfoMessage" />
          </p>
        </div>
      </div>

      <div className="g-flex g-gap-2 g-mb-4">
        <Button
          size="sm"
          onClick={() => onChange(sortedExtensions)}
          variant="default"
          type="button"
        >
          <FormattedMessage id="occurrenceDownloadFlow.selectAll" />
        </Button>
        <Button size="sm" variant="primaryOutline" onClick={() => onChange([])} type="button">
          <FormattedMessage id="occurrenceDownloadFlow.deselectAll" />
        </Button>
      </div>

      <div className="g-grid g-gap-3">
        {sortedExtensions.map((extension) => {
          const count = countsByExtension.get(extension) ?? (countsLoaded ? 0 : undefined);
          const hasRecords = count != null && count > 0;
          const dimmed = countsLoaded && !hasRecords;

          return (
            <label
              key={extension}
              className={`${optionStyles.optionCard}${dimmed ? ' g-opacity-50' : ''}`}
            >
              <Checkbox
                checked={selectedExtensions.includes(extension)}
                onCheckedChange={() => toggleExtension(extension)}
                className="g-mt-1"
              />
              <div className={optionStyles.optionLabel}>
                <span className={optionStyles.optionTitle}>
                  <FormattedMessage id={`enums.dwcaExtension.${extension}`} />
                  {count != null && (
                    <span className="g-text-sm g-font-normal g-text-gray-500 g-ml-2">
                      (<FormattedNumber value={count} />)
                    </span>
                  )}
                </span>
                <p className={optionStyles.optionDescription}>
                  <FormattedMessage id={`definitions.extension.${extension}`} />
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </ExpandableSection>
  );
}
