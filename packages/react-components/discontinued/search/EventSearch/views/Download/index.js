import React, { useEffect, useContext, useState, useCallback } from "react";
import { FilterContext } from '../../../../widgets/Filter/state';
import EventContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { DownloadPresentation } from './DownloadPresentation';
import { ErrorBoundary } from "../../../../components";

const DOWNLOADS = `
query list($predicate: Predicate, $limit: Int){
  eventSearch(
    predicate:$predicate,
    ) {
    facet {
      datasetKey(size: $limit) {
        datasetTitle
        count
        key
        archive {
          url
          fileSizeInMB
          modified          
        }
        events {
          documents(size: 3) {
            total
          }
        }
      }
    }
  }
}
`;

function Downloads() {

  const [size, setSize] = useState(200);
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig } = useContext(EventContext);
  const { data, error, loading, load } = useQuery(DOWNLOADS, { lazyLoad: false, queryTag: 'downloads' });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    };
    load({ keepDataWhileLoading: true, variables: { predicate, size } });
  }, [currentFilterContext.filter, rootPredicate]);

  useEffect(() => {
    setSize(100);
  }, [currentFilterContext.filter]);

  const more = useCallback(() => {
    setSize(size + 100);
  });

  return <>
    <DownloadPresentation
      loading={loading}
      data={data}
      more={more}
      size={size}
    />
  </>
}

export default props => <ErrorBoundary><Downloads {...props} /></ErrorBoundary>;

