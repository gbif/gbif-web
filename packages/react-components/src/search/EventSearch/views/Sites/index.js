import React, {useCallback, useContext, useEffect, useState} from "react";
import SitesTable from "./SitesTable";
import {NumberParam, useQueryParam} from "use-query-params";
import {FilterContext} from "../../../../widgets/Filter/state";
import SearchContext from "../../../SearchContext";
import {useQuery} from "../../../../dataManagement/api";
import hash from "object-hash";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import {useUpdateEffect} from "react-use";
import {DetailsDrawer, Skeleton} from "../../../../components";
import {SiteSidebar} from "../../../../entities/SiteSidebar/SiteSidebar";
import {useDialogState} from "reakit/Dialog";
import * as style from "../List/style";

const QUERY = `
query list( $predicate: Predicate, $size: Int = 20, $from: Int = 0){
  results: eventSearch(
    predicate:$predicate) {
    temporal {
      locationID(size: $size, from: $from) {
        cardinality
        results {
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
}
`;

function SitesSkeleton() {
  return <div css={style.datasetSkeleton}>
    <Skeleton width="random" style={{ height: '1.5em' }} />
    <Skeleton width="random" />
    <Skeleton width="random" />
    <Skeleton width="random" />
  </div>
}

function Sites() {

  const [offset = 0, setOffset] = useQueryParam('offset', NumberParam);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(SearchContext);
  const { data, error, loading, load } = useQuery(QUERY, { lazyLoad: true, throwNetworkErrors: true });

  const [activeSiteID, setActiveSiteID] = useState(false);

  const dialog = useDialogState({ animated: true, modal: false });

  let limit = 40;
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

  // on unmount then reset offset
  useEffect(() => {
    return () => setOffset(undefined);
  }, []);
  
  useEffect(() => {
    if (activeSiteID) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeSiteID]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveSiteID(null);
    }
  }, [dialog.visible]);

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

  if (!data || loading) return <SitesSkeleton/>;

  return <>
    <DetailsDrawer href={`${activeSiteID}`} dialog={dialog}>
      <SiteSidebar
          siteID={activeSiteID}
          defaultTab='details'
          style={{ maxWidth: '100%', width: 700, height: '100%' }}
          onCloseRequest={() => dialog.setVisible(false)}
      />
    </DetailsDrawer>
    <SitesTable
        query={QUERY}
        error={error}
        loading={loading}
        next={next}
        prev={prev}
        first={first}
        from={offset}
        size={limit}
        results={data}
        total={data?.results?.temporal?.locationID?.cardinality}
        setSiteIDCallback={ setActiveSiteID }
    />
  </>
}

export default Sites;