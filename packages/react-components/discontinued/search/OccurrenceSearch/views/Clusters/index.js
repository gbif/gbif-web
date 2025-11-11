import React, { useEffect, useContext, useState, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { ClusterPresentation } from './ClusterPresentation';
import { useQueryParam, NumberParam } from 'use-query-params';
import uniqBy from 'lodash/uniqBy'

const OCCURRENCE_CLUSTERS = `
query clusters($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      results {
        key
        basisOfRecord
        catalogNumber
        publishingOrgKey
        publisherTitle
        stillImageCount
        primaryImage {
          identifier
        }
        datasetKey
        datasetTitle
        typeStatus
        taxonKey: acceptedTaxonKey
        volatile {
          features {
            isSequenced
            isTreament
          }
        }
        related(size: 10) {
          count
          size
          from
          relatedOccurrences {
            reasons
            stub {
              gbifId
            }
            occurrence {
              key
              basisOfRecord
              catalogNumber
              publishingOrgKey
              publisherTitle
              stillImageCount
              primaryImage {
                identifier
              }
              datasetKey
              datasetTitle
              typeStatus
              taxonKey: acceptedTaxonKey
              volatile {
                features {
                  isSequenced
                  isTreament
                }
              }
              related(size: 8) {
								count
                relatedOccurrences {
                  reasons
                  stub {
                    gbifId
                  }
                  occurrence {
                    key
                    basisOfRecord
                    catalogNumber
                    publishingOrgKey
                    publisherTitle
                    stillImageCount
                    primaryImage {
                      identifier
                    }
                    datasetKey
                    datasetTitle
                    typeStatus
                    taxonKey: acceptedTaxonKey
                    volatile {
                      features {
                        isSequenced
                        isTreament
                      }
                    }
                    related(size: 5) {
                      count
                      relatedOccurrences {
                        stub {
                          gbifId
                        }
                        reasons
                        occurrence {
                          key
                          basisOfRecord
                          catalogNumber
                          publishingOrgKey
                          publisherTitle
                          stillImageCount
                          primaryImage {
                            identifier
                          }
                          datasetKey
                          datasetTitle
                          typeStatus
                          taxonKey: acceptedTaxonKey
                          volatile {
                            features {
                              isSequenced
                              isTreament
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

function Clusters() {
  const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const [graph, setGraph] = useState();
  const [attempt, setAttempt] = useState();
  const [criticalError, setCriticalError] = useState();

  const size = 30;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_CLUSTERS, { lazyLoad: true, throwNetworkErrors: true , queryTag: 'clusters' });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig),
        {
          type: 'equals',
          key: 'isInCluster',
          value: true
        }
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate, size, from } });
    setCriticalError(false);
  }, [currentFilterContext.filterHash, rootPredicate, from, attempt]);

  useEffect(() => {
    return function cleanup() {
      setFrom();
    };
  }, []);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setFrom(0);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  const reload = useCallback(() => {
    setAttempt(Math.random());
  });

  // process and remap data to structure we can use
  useEffect(() => {
    if (data) {
      
      // this isn't ideal, but try to process the request even if it did fail
      if (error) {
        console.log(error);
        // setGraph();
      }
      
      try {
        const graph = transformResult({ data });
        setGraph(graph);
        setCriticalError(false);
      } catch(err) {
        setCriticalError(true);
      }
      
    }
  }, [data]);

  return <>
    <ClusterPresentation
      loading={loading}
      error={criticalError}
      reload={reload}
      graph={graph}
      next={next}
      prev={prev}
      first={first}
      size={size}
      from={from}
      total={data?.occurrenceSearch?.documents?.total}
    />
  </>
}

export default Clusters;


function getNodeFromOccurrence(o, isEntry, hasTooManyRelations, rootKey) {
  if (!o) {
    return {
      type: 'DELETED',
      name: Math.random
    }
  }
  const isSpecimen = ['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN', 'LIVING_SPECIMEN', 'MATERIAL_SAMPLE'].indexOf(o.basisOfRecord) > -1;
  return {
    key: o.key,
    name: o.key + '',
    catalogNumber: o.catalogNumber,
    type: isSpecimen ? 'SPECIMEN' : 'OBSERVATION',
    basisOfRecord: o.basisOfRecord,
    isType: o.typeStatus.length > 0,
    isTreatment: o?.volatile?.features?.isTreament,
    isSequenced: o?.volatile?.features?.isSequenced,
    stillImageCount: o.stillImageCount,
    publishingOrgKey: o.publishingOrgKey,
    taxonKey: o.taxonKey,
    // taxonKey: o.taxon,
    isEntry,
    capped: hasTooManyRelations,
    rootKey: rootKey || o.key
  };
}

function getNodeFromImage(o) {
  return {
    name: `${o.key}_image`,
    title: 'Imaged',
    image: o.primaryImage,
    type: 'IMAGE'
  };
}

function getNodeFromSequence(o) {
  return {
    name: `${o.key}_sequence`,
    title: 'Sequenced',
    type: 'SEQUENCE'
  };
}

function getNodeFromTypeStatus(o) {
  return {
    name: `${o.key}_type`,
    title: 'Type',
    type: 'TYPE'
  };
}

function processOccurrence(x, rootKey, nodes, links, isEntry, hasTooManyRelations) {
  const mainNode = getNodeFromOccurrence(x, isEntry, hasTooManyRelations, rootKey);
  nodes.push(mainNode);

  //add sequence node
  if (x?.volatile?.features?.isSequenced) {
    let sequenceNode = getNodeFromSequence(x);
    nodes.push(sequenceNode);
    links.push({ source: x.key + '', target: sequenceNode.name })
  }

  // add image nodes
  if (x?.stillImageCount > 0) {
    let imageNode = getNodeFromImage(x);
    nodes.push(imageNode);
    links.push({ source: x.key + '', target: imageNode.name })
  }

  // add type nodes
  if (x?.typeStatus.length > 0) {
    let typeNode = getNodeFromTypeStatus(x);
    nodes.push(typeNode);
    links.push({ source: x.key + '', target: typeNode.name })
  }

  return mainNode;
}

function processRelated({parent, related, nodes, links, rootKey, clusterContext}) {
  if (related && related.count > 0) {
    related.relatedOccurrences.forEach(e => {
      if (!e.occurrence) {
        clusterContext.invalidCluster = true;
        const mainNode = {type: 'DELETED', key: e?.stub?.gbifID, name: e?.stub?.gbifID + ''};
        nodes.push(mainNode);
        links.push({ source: parent.key + '', target: e?.stub?.gbifID + '', reasons: e.reasons });
        return;
      }
      const mainNode = processOccurrence(e.occurrence, rootKey, nodes, links, false, e.occurrence?.related?.count > e.occurrence?.related?.relatedOccurrences?.length);
      clusterContext.clusterNodes.push(mainNode);
      // and add link to the related
      links.push({ source: parent.key + '', target: e.occurrence.key + '', reasons: e.reasons });
      const itemRelations = e.occurrence.related;
      processRelated({parent: e.occurrence, related: itemRelations, nodes, links, rootKey, clusterContext});
    });
  }
}

function transformResult({ data }) {
  let nodes = [];
  let links = [];
  let clusterMap = {};
  const items = data.occurrenceSearch.documents.results;
  items.forEach(x => {
    // should we compare using accepted taxonKeys or not?
    // x.taxon = x.acceptedTaxonKey;
    // x.taxon = x.taxonKey;

    let clusterContext = {clusterNodes: []};
    if (x.related && x.related.count > 0) {
      const mainNode = processOccurrence(x, x.key, nodes, links, true, x.related.count > x.related.relatedOccurrences.length);
      clusterContext.clusterNodes.push(mainNode);
      processRelated({parent: x, related: x.related, nodes, links, rootKey: x.key, clusterContext});

      const uniqNodes = uniqBy(clusterContext.clusterNodes, x => x.key);
      const distinctTaxonKeys = uniqBy(uniqNodes, x => x.taxonKey);
      clusterContext.clusterNodes = uniqNodes.map(x => x.key);
      clusterContext.size = clusterContext.clusterNodes.length;
      clusterContext.distinctTaxa = distinctTaxonKeys.length;
      mainNode.distinctTaxa = clusterContext.distinctTaxa;
      clusterMap[x.key] = clusterContext;
    }
  });

  let n = uniqBy(nodes, 'name');
  let l = uniqBy(links, x => {
    let sorted = [x.source, x.target].sort();
    let val = `${sorted[0]} - ${sorted[1]}`;
    return val;
  });
  return { nodes: n, links: l, clusterMap };
}