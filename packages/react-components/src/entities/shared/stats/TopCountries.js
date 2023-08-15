import React, { useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { ProgressItem } from "../../../components";
import { FormattedMessage } from 'react-intl';
import { SideBarError, SideBarLoader, SideBarProgressList, SideBarHeader } from '../index';

export function TopCountries({
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

  if (error) return <SideBarError />
  if (!data || loading) return <SideBarLoader />

  return <>
    <SideBarHeader>Top 10 countries</SideBarHeader>
    <div>
      <SideBarProgressList>
        {data?.occurrenceSearch?.facet?.countryCode.map((x, i) => {
          return <li key={i}>
            <ProgressItem style={{ marginBottom: 12 }} fraction={x.count / total} title={<FormattedMessage id={`enums.countryCode.${x.key}`} />} subtleText />
          </li>
        })}
      </SideBarProgressList>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query topCountries($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    facet {
      countryCode(size: 10) {
        count
        key
      }
    }
  }
}
`;

