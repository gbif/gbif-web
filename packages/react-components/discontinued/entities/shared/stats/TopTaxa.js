import React, { useEffect } from 'react';
import { useQuery } from '../../../dataManagement/api';
import { ProgressItem } from "../../../components";
import { SideBarError, SideBarLoader, SideBarProgressList, SideBarHeader } from '../index';

export function TopTaxa({
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
    <SideBarHeader>Top 10 shared taxa</SideBarHeader>
    <div>
      <SideBarProgressList>
        {data?.occurrenceSearch?.facet?.taxonKey.map((x, i) => {
          return <li key={i}>
            <ProgressItem style={{ marginBottom: 12 }} fraction={x.count / total} title={<span dangerouslySetInnerHTML={{__html: x.taxon.formattedName}}></span>} subtleText />
          </li>
        })}
      </SideBarProgressList>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query topTaxa($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    facet {
      taxonKey(size: 10) {
        count
        taxon {
          formattedName
        }
      }
    }
  }
}
`;

