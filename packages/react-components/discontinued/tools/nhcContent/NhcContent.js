import { jsx, css } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { MdSearch } from 'react-icons/md';
import { useQuery } from '../../dataManagement/api';
import { filter2predicate } from '../../dataManagement/filterAdapter';
import { Button, Input, HyperText } from '../../components';
import { FormattedNumber} from 'react-intl';

const rightColWidth = 650;
function NhcContent(props) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [size, setSize] = useState(50);
  // const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const { data, error, loading, load } = useQuery(QUERY, { lazyLoad: true });
  const [storage, setStorage, remove] = useLocalStorage('grscicoll_curation_tool', { collapsed: {} });

  useEffect(() => {
    if (q && q !== '') {
      fetch(`https://api.gbif.org/v1/grscicoll/search?q=${q}`)
        .then((response) => response.json())
        .then((data) => { setResults(data); });
    }
  }, [q]);

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
      "size": size
    }
    load({ keepDataWhileLoading: true, variables });
  }, [size]);

  if (loading || !data) {
    return null;
  }

  return <div css={css`padding: 12px;`}>
    {/* <button onClick={() => setFrom(Math.max(0, from-1))}>Previous</button><button onClick={() => setFrom(from+1)}>Next</button> */}
    <div css={css`margin-right: ${rightColWidth}px;`}>
      {data?.occurrenceSearch?.facet?.datasetKey.map(x => {
        return <Dataset data={x} key={x.dataset.key} {...{ storage, setStorage, setQ }} />
      })}
      <Button onClick={() => setSize(size + 50)}>Load more</Button>
    </div>
    <div css={css`position: fixed; top: 0; right: 0; height: 100vh; overflow: auto; padding: 12px; width: ${rightColWidth}px;`}>
      <Input value={q} placeholder="Search GrSciColl" onChange={(e) => { setQ(e.target.value) }} />
      <div>
        {results?.length > 0 && results.map(x => {
          return <div css={css`
          background: white; 
          padding: 12px; 
          margin: 12px;
          overflow: auto;
          `}>
            <div>{x.type} : {x.code}</div>
            <a target="_blank" href={`https://registry.gbif.org/${x.type}/${x.key}`}>{x.name}</a>
          </div>
        })}
        {results?.length === 0 && <div>No results</div>}
      </div>
    </div>
  </div>
}

function Dataset({ storage, setStorage, setQ, data, ...props }) {
  const { count, dataset, occurrences } = data;
  const facets = occurrences?.facet;
  const exampleRecord = occurrences?.documents?.results?.[0];
  let lookUpParams = '';
  let nameMap = {
    'institutionID': 'institutionId',
    'collectionID': 'collectionId',
  };
  ['institutionID', 'institutionCode', 'collectionID', 'collectionCode', 'datasetKey'].forEach(key => {
    if (exampleRecord[key]) {
      lookUpParams += `${nameMap[key] || key}=${encodeURIComponent(exampleRecord[key])}& `;
    }
  });

  return <div css={css`
    ${!storage?.collapsed?.[dataset.key] ? 'background: white;' : null}
    ${!storage?.collapsed?.[dataset.key] ? 'border: 1px solid #efefef;' : null}
    ${!storage?.collapsed?.[dataset.key] ? 'padding: 24px;' : 'padding: 0 24px;'}
    ${storage?.collapsed?.[dataset.key] ? 'opacity: .25;' : null}
    margin: 12px;
  `}>
    <div css={css`display: flex; `}>
      <h3 css={css`flex: 1 1 auto; `}><span style={{ display: 'inline-block', width: 1, height: 1, overflow: 'hidden', color: 'white' }}>{"Dataset: "}</span><a target="_blank" href={`https://www.gbif.org/dataset/${dataset.key}`}>{dataset.title}</a><MdSearch style={{ marginLeft: 8 }} onClick={() => setQ(dataset.title)} /></h3>
      <div><Button look="primaryOutline" css={css`user-select: none; flex: 0 0 auto;`} onClick={() => {
        let collapsed = { ...storage?.collapsed }
        collapsed[dataset.key] = !collapsed?.[dataset.key];
        const newStorage = { ...storage, collapsed };
        setStorage(newStorage);
      }}>Toggle</Button></div>
    </div >
    {!storage?.collapsed?.[dataset.key] && <>
      <div>Published by: <a target="_blank" href={`https://www.gbif.org/publisher/${dataset.publishingOrganizationKey}`}>{dataset.publishingOrganizationTitle}</a><MdSearch style={{ marginLeft: 8 }} onClick={() => setQ(dataset.publishingOrganizationTitle)} /> (country: {dataset.publishingOrganization.country})</div>
      <div>Records without a match: <FormattedNumber value={count} /></div>
      {facets?.institutionCode.length > 0 && <div>
        Top institutionCodes: <ul>{facets?.institutionCode?.map(x => <li>
          <span style={{ width: 1, height: 1, overflow: 'hidden', color: 'white' }}>* </span><a target="_blank" href={`http://hp-nhc.gbif-staging.org/institution/search?q=${encodeURIComponent(x.key)}`}>{x.key}</a><MdSearch style={{ marginLeft: 8 }} onClick={() => setQ(x.key)} />
        </li>)}
        </ul>
      </div>}
      <br />
      {facets?.collectionCode.length > 0 && <div>
        Top collectionCodes: <ul>{facets?.collectionCode?.map(x => <li>
          <span style={{ width: 1, height: 1, overflow: 'hidden', color: 'white' }}>* </span><a target="_blank" href={`http://hp-nhc.gbif-staging.org/collection/search?q=${encodeURIComponent(x.key)}`}>{x.key}</a><MdSearch style={{ marginLeft: 8 }} onClick={() => setQ(x.key)} />
        </li>)}
        </ul>
      </div>}
      <br />
      <div>
        <a target="_blank" href={`https://www.gbif.org/occurrence/${exampleRecord.key}`}>Example record:</a>
        <pre css={css`max-width: 100%; overflow: auto; background: #fbfbfb; font-family: monospace; border: 1px solid #eee;`}>
          <div style={{ width: 1, height: 1, overflow: 'hidden', color: 'white' }}>{"```"}</div>
          <HyperText text={JSON.stringify(exampleRecord, null, 2)} />
        </pre>
        <div style={{ width: 1, height: 1, overflow: 'hidden', color: 'white' }}>{"```"}</div>
      </div>
      <div>
        <a target="_blank" href={`https://api.gbif.org/v1/grscicoll/lookup?${lookUpParams}`}>Example lookup</a>
      </div>
      <br />
      <div style={{ width: 1, height: 1, overflow: 'hidden', color: 'white' }}>{"## GrSciColl"}</div>
      <br />
      <div css={css`user-select: none;`}>
        <div>
          <a target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?labels=GrSciColl&title=GrSciColl mapping: ${encodeURIComponent(dataset.title)}&body=`}>Create issue</a>
        </div>
        <div>
          <a target="_blank" href={`https://github.com/gbif/portal-feedback/issues?q=is%3Aopen+is%3Aissue+label%3AGrSciColl+${encodeURIComponent(dataset.title)}`}>Search existing issue</a>
        </div>
      </div>
    </>
    }
  </div >
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
              datasetKey
              datasetTitle
              catalogNumber
              collectionCode
              collectionID
              institutionID
              datasetID
              institutionCode
              occurrenceID
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