import React, {useCallback, useContext, useEffect} from "react";
import PredicateDataFetcher from '../../../PredicateDataFetcher';
import SitesTable from "./SitesTable";
import {NumberParam, useQueryParam} from "use-query-params";
import {FilterContext} from "../../../../widgets/Filter/state";
import SearchContext from "../../../SearchContext";
import {useQuery} from "../../../../dataManagement/api";
import hash from "object-hash";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import {useUpdateEffect} from "react-use";

const QUERY = `
query list( $predicate: Predicate, $offset: Int, $limit: Int){
  results: eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $offset) {
    temporal {
      locationID {
        key
        count
        breakdown {
          y 
          c
          ms {
            m
            c
          }
        }
      } 
    }
  }
}
`;

function Sites() {

  const [offset = 0, setOffset] = useQueryParam('offset', NumberParam);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(QUERY, { lazyLoad: true, graph: 'EVENT' });

  let limit = 100;
  let customVariables = {};

  const variableHash = hash(customVariables);

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: {predicate, size: limit, from: offset, ...customVariables} });
  }, [currentFilterContext.filterHash, rootPredicate, offset, limit, variableHash]);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    setOffset(undefined);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setOffset(Math.max(0, offset + limit));
  });

  const prev = useCallback(() => {
    const offsetValue = Math.max(0, offset - limit);
    setOffset(offsetValue !== 0 ? offsetValue : undefined);
  });

  const first = useCallback(() => {
    setOffset(undefined);
  });

  if (error) {
    return <div>Failed to fetch data</div>
  }
  return <SitesTable
      error={error}
      loading={loading}
      data={data}
      next={next}
      prev={prev}
      first={first}
      from={offset}
      results={data}
  />
}

export default Sites;