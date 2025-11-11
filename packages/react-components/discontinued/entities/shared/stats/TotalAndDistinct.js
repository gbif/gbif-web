import React, { useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { FormattedMessage } from 'react-intl';
import { SideBarError, SideBarLoader, SideBarProgressList, SideBarHeader } from '../index';

export function TotalAndDistinct({
  predicate,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useEffect(() => {
    load({
      variables: {
        predicate
      }
    });
  }, [predicate]);

  const total = data?.occurrenceSearch?.documents?.total;

  if (error) return <SideBarError style={props.style}/>
  if (!data || loading) return <SideBarLoader style={props.style}/>

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

