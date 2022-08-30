import { useState, useEffect, useRef, useContext } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import ApiContext from './ApiContext';
import { CollateContext, DataContext } from '../../dataContext';
import { useFirstMountState} from 'react-use';
import hash from 'object-hash';
const RENEW_REQUEST = 'RENEW_REQUEST';

const useUnmounted = () => {
  const unmounted = useRef(false)
  useEffect(() => () => {
    unmounted.current = true
  }, [])
  return unmounted
}

function useQuery(query, options = {}) {
  const collateContext = useContext(CollateContext);
  const dataContext = useContext(DataContext);
  let callId = collateContext.current;
  collateContext.current++;

  const [latestVariables, setVariables] = useState(options?.variables);
  const [data, setData] = useState(dataContext.data?.[callId]?.data || null);
  const [loading, setLoading] = useState(false);
  
  const [error, setError] = useState(false);
  // functions are called when passed to useState so it has to be wrapped. 
  // We provide an empty call, just so we do not have to check for existence subsequently
  const [cancelRequest, setCancel] = useState(() => () => { });
  const unmounted = useUnmounted();
  const apiClient = useContext(ApiContext);
  const client = options?.client || apiClient;

  function init(options) {
    if (!options?.keepDataWhileLoading) setData();
    setLoading(true);
    setError(false)
    cancelRequest(RENEW_REQUEST);
  }

  function load(options) {
    const variables = options?.variables;
    if (data && !error && hash(variables) === hash(latestVariables)) return;
    const { promise: dataPromise, cancel } = client.query({ query, variables });
    if (typeof window !== 'undefined') {
      init(options);  
      // functions cannot be direct values in states as function are taken as a way to create derived states
      // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
      setCancel(() => cancel);
      setVariables(variables);
    }
    dataPromise.
      then(response => {
        if (unmounted.current) return;
        const { data, error } = response;
        if (error?.isCanceled?.message === RENEW_REQUEST) {
          return;
        }
        setError(error);
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        if (unmounted.current) return;
        setError({ error: true, type: 'unknown' });
        setData();
        setLoading(false);
      });

    // if we are on the server and haven't resolved the intial data, then collect the requests
    if (!collateContext.resolved) {
      let cancelCollator = Function.prototype;

      const effectPr = new Promise((resolve) => {
        cancelCollator = () => {
          if (!dataContext[callId]) {
            dataContext[callId] = { error: { message: 'timeout' }, id: callId };
          }
          cancel();
          resolve(callId);
        };
        return dataPromise
          .then((response) => {
            const { data, error } = response;
            dataContext[callId] = { data, error };
            resolve(callId);
          })
          .catch((error) => {
            dataContext[callId] = { error: { error: true, type: 'unknown' } };
            resolve(callId);
          });
      });

      collateContext.requests.push({
        id: callId,
        promise: effectPr,
        cancel: cancelCollator,
      });
    }
  }

  // Cancel pending request on unmount
  useEffect(() => () => {
    cancelRequest();
  }, [cancelRequest]);

  useDeepCompareEffect(() => {
    if (!options?.lazyLoad) {
      load(options);
    }
    // we leave cleaning to a seperate useEffect cleanup step
  }, [
    query,
    options
  ]);

  // On the server we want to load immediately unless specified as lazy loading
  if (typeof window === 'undefined' && !options?.lazyLoad) {
    load(options);
  }

  return { data, loading, error, load, cancel: cancelRequest || (() => { }) };
}

export default useQuery;