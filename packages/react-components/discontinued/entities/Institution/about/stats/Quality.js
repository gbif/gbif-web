import React, { useEffect } from 'react';
import { useQuery } from '../../../../dataManagement/api';
import { ProgressItem, Tooltip } from "../../../../components";
import { FormattedMessage } from 'react-intl';
import { MdHelpOutline as HelpIcon } from 'react-icons/md';
import { SideBarError, SideBarLoader, SideBarProgressList, SideBarHeader } from '../../../shared';

export function Quality({
  predicate,
  institution,
  totalOccurrences = 0,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE_STATS, { lazyLoad: true });

  useEffect(() => {
    load({
      variables: {
        predicate: {
          type: 'and',
          predicates: [
            predicate,
            {
              "type": "isNotNull",
              "key": "collectionKey"
            }
          ]
        },
        predicate5: {
          type: 'and',
          predicates: [
            predicate,
            {
              "type": "isNotNull",
              "key": "eventDate"
            },
            {
              "type": "isNotNull",
              "key": "recordedBy"
            },
            {
              "type": "isNotNull",
              "key": "identifiedBy"
            },
            {
              "type": "not",
              "predicate": {
                "type": "in",
                "key": "issue",
                "values": [
                  "TAXON_MATCH_NONE"
                ]
              }
            }
          ]
        },
        predicateCode: {
          type: 'and',
          predicates: [
            predicate,
            {
              "type": "isNotNull",
              "key": "collectionCode"
            },
            {
              "type": "not",
              "predicate": {
                "type": "isNotNull",
                "key": "collectionKey"
              }
            }
          ]
        }
      }
    });
  }, [predicate]);

  const collectionsWithDigitizedData = institution.collections.filter(x => x.occurrenceCount > 0).length;

  if (error) return <SideBarError />
  if (!data || loading) return <SideBarLoader />

  return <>
    <SideBarHeader>
      <FormattedMessage id="counts.nSpecimensInGbif" values={{ total: totalOccurrences }} />
    </SideBarHeader>
    <div>
      <SideBarProgressList>
        <li>
          {institution?.collections?.length > 0 && <ProgressItem fraction={collectionsWithDigitizedData / institution?.collections?.length} title="Collections with data in GBIF" subtleText style={{ marginBottom: 12 }} />}
          <ProgressItem 
            fraction={data?.big5?.documents?.total / totalOccurrences}
            title={<>
              <Tooltip title="What, where, when and who collected and identified are all filled.">
                <span>The big five <HelpIcon /></span>
              </Tooltip>
            </>}
            subtleText style={{ marginBottom: 12 }}
          />
          {institution?.numberSpecimens > 0 && <ProgressItem fraction={data?.withCollection?.documents?.total / totalOccurrences} title="In a collection" subtleText style={{ marginBottom: 12 }} />}
          {data?.withCode?.documents?.total > 0 && <ProgressItem color="#f15d29"
            fraction={data?.withCode?.documents?.total / totalOccurrences}
            title={<>
              <Tooltip title="Records that have a collection code, but could not be matched to any collections.">
                <span>Unmatched collection codes <HelpIcon /></span>
              </Tooltip>
            </>}
            subtleText style={{ marginBottom: 12 }}
          />}
        </li>
      </SideBarProgressList>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query ocurrenceSearch($predicate: Predicate, $predicate5: Predicate, $predicateCode: Predicate){
  withCollection: occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      collectionKey
    }
    facet {
      collectionKey {
        key
        count
      }
    }
  }
  withCode: occurrenceSearch(predicate: $predicateCode) {
    documents(size: 0) {
      total
    }
  }
  big5: occurrenceSearch(predicate: $predicate5) {
    documents(size: 0) {
      total
    }
  }
}
`;

