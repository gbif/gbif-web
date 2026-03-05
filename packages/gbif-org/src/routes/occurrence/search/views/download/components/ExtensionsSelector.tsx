import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FaPuzzlePiece, FaInfoCircle } from 'react-icons/fa';
import ExpandableSection from './ExpandableSection';
import { FormattedMessage, FormattedNumber } from 'react-intl';
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
  {
    url: 'http://rs.tdwg.org/ac/terms/Multimedia',
    name: 'Multimedia',
    description:
      'Images, audio recordings, or videos, including media metadata and license information - http://rs.tdwg.org/ac/terms/Multimedia',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Amplification',
    name: 'Amplification',
    description:
      'Information on DNA amplification of a material - http://data.ggbn.org/schemas/ggbn/terms/Amplification',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
    name: 'GermplasmAccession',
    description:
      'Describes genebank accessions for plant genetic resources - http://purl.org/germplasm/germplasmTerm#GermplasmAccession',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementScore',
    name: 'MeasurementScore',
    description:
      'Trait measurements for plant genetic resources - http://purl.org/germplasm/germplasmTerm#MeasurementScore',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
    name: 'MeasurementTrait',
    description:
      'Trait descriptors describing methods and protocols followed when making trait measurements for plant genetic resources - http://purl.org/germplasm/germplasmTerm#MeasurementTrait',
  },
  {
    url: 'http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
    name: 'MeasurementTrial',
    description:
      'Measurement trial (field or greenhouse) to collect trait measurements for plant genetic resources - http://purl.org/germplasm/germplasmTerm#MeasurementTrial',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/Identification',
    name: 'Identification',
    description:
      'Information on multiple identifications of the same organism - http://rs.tdwg.org/dwc/terms/Identification',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Identifier',
    name: 'Identifier',
    description: 'Alternative identifiers for a taxon - http://rs.gbif.org/terms/1.0/Identifier',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Image',
    name: 'Image',
    description: 'Images and associated metadata - http://rs.gbif.org/terms/1.0/Image',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
    name: 'MeasurementOrFact',
    description:
      'Measurements or facts associated with a record - http://rs.tdwg.org/dwc/terms/MeasurementOrFact',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Multimedia',
    name: 'Multimedia',
    description:
      'Images, audio recordings, or videos, including media metadata and license information - http://rs.gbif.org/terms/1.0/Multimedia',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/Reference',
    name: 'Reference',
    description:
      'Literature references for taxon or occurrence records - http://rs.gbif.org/terms/1.0/Reference',
  },
  {
    url: 'http://rs.tdwg.org/dwc/terms/ResourceRelationship',
    name: 'ResourceRelationship',
    description:
      'Information on the relationship between records within a dataset or resources external to the dataset - http://rs.tdwg.org/dwc/terms/ResourceRelationship',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Cloning',
    name: 'Cloning',
    description:
      'Information on DNA cloning of a material - http://data.ggbn.org/schemas/ggbn/terms/Cloning',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/GelImage',
    name: 'GelImage',
    description:
      'Information on the gel image of a material - http://data.ggbn.org/schemas/ggbn/terms/GelImage',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Loan',
    name: 'Loan',
    description:
      'Information about how a specimen can be loaned and under which conditions - http://data.ggbn.org/schemas/ggbn/terms/Loan',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
    name: 'MaterialSample',
    description:
      'Information on properties of material samples (e.g. tissues, DNA, RNA) - http://data.ggbn.org/schemas/ggbn/terms/MaterialSample',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Permit',
    name: 'Permit',
    description:
      'Information on permits associated with a material - http://data.ggbn.org/schemas/ggbn/terms/Permit',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preparation',
    name: 'Preparation',
    description:
      'Information on how material was prepared - http://data.ggbn.org/schemas/ggbn/terms/Preparation',
  },
  {
    url: 'http://data.ggbn.org/schemas/ggbn/terms/Preservation',
    name: 'Preservation',
    description:
      'Information on how material was preserved - http://data.ggbn.org/schemas/ggbn/terms/Preservation',
  },
  {
    url: 'http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
    name: 'ExtendedMeasurementOrFact',
    description:
      'Extended measurements or facts related to a biological occurrence, environmental measurements or facts and sampling method attributes - http://rs.iobis.org/obis/terms/ExtendedMeasurementOrFact',
  },
  {
    url: 'http://rs.tdwg.org/chrono/terms/ChronometricAge',
    name: 'ChronometricAge',
    description:
      'Chronometric age information in cases where the collecting event is not contemporaneous with the time when the organism was alive - http://rs.tdwg.org/chrono/terms/ChronometricAge',
  },
  {
    url: 'http://rs.gbif.org/terms/1.0/DNADerivedData',
    name: 'DNADerivedData',
    description:
      'Includes relevant information for records derived based on DNA analysis - http://rs.gbif.org/terms/1.0/DNADerivedData',
  },
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
          onClick={() => onChange(AVAILABLE_EXTENSIONS.map((ext) => ext.url))}
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
        {AVAILABLE_EXTENSIONS.map((extension) => {
          const count = countsByExtension.get(extension.url) ?? (countsLoaded ? 0 : undefined);
          const hasRecords = count != null && count > 0;
          const dimmed = countsLoaded && !hasRecords;

          return (
            <label
              key={extension.url}
              className={`${optionStyles.optionCard}${dimmed ? ' g-opacity-50' : ''}`}
            >
              <Checkbox
                checked={selectedExtensions.includes(extension.url)}
                onCheckedChange={() => toggleExtension(extension.url)}
                className="g-mt-1"
              />
              <div className={optionStyles.optionLabel}>
                <span className={optionStyles.optionTitle}>
                  <FormattedMessage id={`enums.dwcaExtension.${extension.url}`} />
                  {count != null && (
                    <span className="g-text-sm g-font-normal g-text-gray-500 g-ml-2">
                      (<FormattedNumber value={count} />)
                    </span>
                  )}
                </span>
                <p className={optionStyles.optionDescription}>
                  <FormattedMessage id={`definitions.extension.${extension.url}`} />
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </ExpandableSection>
  );
}
