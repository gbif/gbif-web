import React, { useEffect, useState } from 'react';
import { RiCreativeCommonsSaLine } from 'react-icons/ri';
import { useQuery } from '../../dataManagement/api';
import { filter2predicate } from '../../dataManagement/filterAdapter';

function NhcContent(props) {
  // const [from = 0, setFrom] = useState(0);
  // const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const { data, error, loading, load } = useQuery(QUERY, { lazyLoad: true });

  useEffect(() => {
    let variables = {
      "predicate": {
        "type": "and",
        "predicates": [
          {
            "type": "and",
            "predicates": [
              {
                "type": "in",
                "key": "basisOfRecord",
                "values": [
                  "PRESERVED_SPECIMEN",
                  "FOSSIL_SPECIMEN"
                ]
              },
              {
                "type": "not",
                "predicate": {
                  "type": "isNotNull",
                  "key": "institutionCode"
                }
              },
              {
                "type": "not",
                "predicate": {
                  "type": "isNotNull",
                  "key": "institutionKey"
                }
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
        ]
      },
      "size": 50
    }
    load({ keepDataWhileLoading: true, variables });
  }, []);

  if (loading || !data) {
    return null;
  }
  
  return <div>
    {/* <button onClick={() => setFrom(Math.max(0, from-1))}>Previous</button><button onClick={() => setFrom(from+1)}>Next</button> */}
    {data?.occurrenceSearch?.facet?.datasetKey.map(x => {
      return <Dataset data={x} key={x.dataset.key} />
    })}
  </div>
}

function Dataset({ data, ...props }) {
  const { count, dataset, occurrences } = data;
  const facets = occurrences?.facet;
  return <div>
    <h3><a href={`https://www.gbif.org/dataset/${dataset.key}`}>{dataset.title}</a></h3>
    <div>Published by: <a href={`https://www.gbif.org/publisher/${dataset.publishingOrganizationKey}`}>{dataset.publishingOrganizationTitle}</a> (country: {dataset.publishingOrganization.country})</div>
    <div>Records without a match: {count}</div>
    {facets?.institutionCode.length > 0 && <div>
      Top institutionCodes: {facets?.institutionCode?.map(x => <a href={`http://hp-nhc.gbif-staging.org/collection/search?institutionCode=${x.key}`}>{x.key}</a>).join(' * ')}
    </div>}
    {facets?.collectionCode.length > 0 && <div>
      Top collectionCodes: {facets?.collectionCode?.map(x => <a href={`http://hp-nhc.gbif-staging.org/collection/search?q=${encodeURIComponent(x.key)}`}>{x.key}</a>)}
    </div>}
    <div>
      Example record:
      <pre>
        {JSON.stringify(occurrences.documents.results[0], null, 2)}
      </pre>
    </div>
  </div>
}


const QUERY = `
query table($predicate: Predicate, $size: Int = 100){
  occurrenceSearch(predicate: $predicate, size: 0, from: 0) {
    cardinality {
      datasetKey
    }
    facet {
      datasetKey(size: $size) {
        count
        dataset {
          key
          title
          description
          license
          collections
          publishingOrganization {
            country
          }
          publishingOrganizationKey
          publishingOrganizationTitle
        }
        occurrences {
          documents(size: 1) {
            results {
              key
              catalogNumber
              collectionCode
              collectionID
              institutionID
              datasetID
            }
          }
          facet {
            collectionCode {
              key
              count
            }
          }
          facet {
            institutionCode {
              key
              count
            }
          }
        }
      }
    }
  }
}
`;

export default NhcContent;