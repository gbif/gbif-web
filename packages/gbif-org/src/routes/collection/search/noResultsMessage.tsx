import { NoRecords } from '@/components/noDataMessages';
import { Button } from '@/components/ui/button';
import { FilterContext, FilterType } from '@/contexts/filter';
import { DynamicLink } from '@/reactRouterPlugins';
import { isNoneEmptyArray } from '@/utils/isNoneEmptyArray';
import { ParamQuery } from '@/utils/querystring';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';

export function NoResultsMessage() {
  const { filter } = useContext(FilterContext);

  return (
    <NoRecords>
      <div className="g-mt-4 g-max-w-sm g-mx-auto g-border g-border-solid g-rounded-sm g-bg-white g-p-6 g-text-center">
        <div className="g-pb-6 g-text-sm">
          <FormattedMessage id="grscicoll.collectionSearchNoResultsMessage" />
        </div>
        <Button asChild>
          <DynamicLink pageId="occurrenceSearch" searchParams={createSearchParams(filter)}>
            <FormattedMessage id="grscicoll.searchForSpecimens" />
          </DynamicLink>
        </Button>
      </div>
    </NoRecords>
  );
}

function createSearchParams(filter: FilterType): ParamQuery {
  const result: ParamQuery = {
    basisOfRecord: [
      'PRESERVED_SPECIMEN',
      'FOSSIL_SPECIMEN',
      'MATERIAL_SAMPLE',
      'LIVING_SPECIMEN',
      'MATERIAL_CITATION',
    ],
  };

  if (isNoneEmptyArray(filter.must?.taxonKeyGrSciColl)) {
    result.taxonKey = filter.must.taxonKeyGrSciColl;
  }

  if (isNoneEmptyArray(filter.must?.collectionDescriptorCountry)) {
    result.country = filter.must.collectionDescriptorCountry;
  }

  if (isNoneEmptyArray(filter.must?.typeStatus)) {
    result.typeStatus = filter.must.typeStatus;
  }

  if (isNoneEmptyArray(filter.must?.recordedBy)) {
    result.recordedBy = filter.must.recordedBy;
  }

  if (isNoneEmptyArray(filter.must?.identifiedBy)) {
    result.identifiedBy = filter.must.identifiedBy;
  }

  if (isNoneEmptyArray(filter.must?.institutionKeySingle)) {
    result.institutionKey = filter.must.institutionKeySingle;
  }

  return result;
}
