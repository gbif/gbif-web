import React, { useEffect } from 'react';
import { useDeepCompareEffect } from 'react-use';
import { useQuery } from '../../../dataManagement/api';
import { FormattedMessage } from 'react-intl';
import { SideBarError, SideBarLoader, SideBarProgressList, SideBarHeader } from '../../shared/index';

export function TotalAndDistinct({
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate
      },
      queue: {name: 'metrics'}
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  if (error) return <SideBarError />
  if (!data || loading) return <SideBarLoader />

  return <div {...props}>
    <SideBarHeader>
      <FormattedMessage id="counts.nSpecimensInGbif" values={{ total }} />
    </SideBarHeader>
    <div>
      <SideBarProgressList>
        {data?.occurrenceSearch?.cardinality?.speciesKey} distinct species
      </SideBarProgressList>
    </div>
  </div>
};

const OCCURRENCE_STATS = `
query total($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      speciesKey
    }
  }
}
`;

