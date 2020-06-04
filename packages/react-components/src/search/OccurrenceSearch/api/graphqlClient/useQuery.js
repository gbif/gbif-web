import { useState, useEffect } from 'react';
import queryGraphQL from './queryGraphQL';

const RENEW_REQUEST = 'RENEW_REQUEST';
const UNMOUNTED = 'UNMOUNTED';

function useQuery(query, options = {}) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cancelRequest, setCancel] = useState();

  function init() {
    setData();
    setLoading(true);
    setError(false)
    if (typeof cancelRequest === 'function') {
      cancelRequest(RENEW_REQUEST);
    }
  }

  function load(options) {
    init();
    const variables = options.variables;
    const { promise: dataPromise, cancel } = queryGraphQL(query, { variables });

    // functions cannot be direct values in states as function are taken as a way to create derived states
    // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
    setCancel(() => cancel);
    dataPromise.
      then(response => {
        const { data, error } = response;
        if (error?.isCanceled?.message === RENEW_REQUEST) {
          return;
        }
        // if (error?.isCanceled?.message === UNMOUNTED) {
        //   console.log('UNMOUNTED caught');
        //   return;
        // }
        setError(error);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.log('error happened');
        setError({ error: true, type: 'unknown' });
        setData();
        setLoading(false);
      });
    return function cleanup() {
      if (typeof cancel === 'function') {
        cancel(UNMOUNTED);
      }
    }
  }

  useEffect(() => {
    if (!options.lazyLoad) {
      const cleanup = load(options);
      return cleanup;
    }
  }, [
    query,
    options.lazyLoad,
    options.ignoreVariableUpdates ? void 0 : options.variables
  ]);

  return { data, loading, error, load, cancel: cancelRequest || (() => { }) };
}

export default useQuery;