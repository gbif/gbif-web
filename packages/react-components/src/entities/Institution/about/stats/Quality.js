import { jsx, css } from '@emotion/react';
import React, { useEffect } from 'react';
import { useQuery } from '../../../../dataManagement/api';
import { ProgressItem, Tooltip } from "../../../../components";
import { FormattedMessage } from 'react-intl';
import { MdHelpOutline as HelpIcon } from 'react-icons/md';

export function Quality({
  predicate,
  institution,
  totalOccurrences,
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
        }
      }
    });
  }, [predicate]);

  const digitizedFraction = totalOccurrences / institution?.numberSpecimens;
  const collectionsWithDigitizedData = institution.collections.filter(x => x.occurrenceCount > 0).length;
  return <>
    <h4 css={css`margin: 0 0 24px 0; font-size: 14px;`}><FormattedMessage id="counts.nSpecimensInGbif" values={{ total: totalOccurrences }} /></h4>
    <div>
      <ul css={css`padding: 0; margin: 0; list-style: none;`}>
        <li>
          {institution?.numberSpecimens && <ProgressItem color="#4fd970" fraction={digitizedFraction} title="Shared of total estimated" subtleText style={{ marginBottom: 12 }} />}
          {institution?.numberSpecimens && <ProgressItem color="#4fd970" fraction={data?.withCollection?.documents?.total / totalOccurrences} title="Assigned to a collection" subtleText style={{ marginBottom: 12 }} />}
          {institution?.collections?.length > 0 && <ProgressItem color="#4fd970" fraction={collectionsWithDigitizedData / institution?.collections?.length} title="Collections that share data" subtleText style={{ marginBottom: 12 }} />}
          <ProgressItem color="#4fd970" fraction={data?.big5?.documents?.total / totalOccurrences} title={<>
            <Tooltip title="Records that has a taxon match, location, year, collector and identifier name.">
              <span>The Big 5 <HelpIcon /></span>
            </Tooltip>
          </>}
            subtleText style={{ marginBottom: 12 }} />
        </li>
      </ul>
    </div>
  </>
};

const OCCURRENCE_STATS = `
query ocurrenceSearch($predicate: Predicate, $predicate5: Predicate){
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
  big5: occurrenceSearch(predicate: $predicate5) {
    documents(size: 0) {
      total
    }
  }
}
`;

