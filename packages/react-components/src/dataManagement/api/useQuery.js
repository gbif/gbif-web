import { useState, useEffect, useRef, useContext } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import ApiContext from './ApiContext';
import { CollateContext, DataContext } from '../../dataContext';

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

  const [data, setData] = useState(dataContext.data?.[callId]?.data?.data || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // functions are called when passed to useState so it has to be wrapped. 
  // We provide an empty call, just so we do not have to check for existence subsequently
  const [cancelRequest, setCancel] = useState(() => () => { });
  const unmounted = useUnmounted();
  const apiClient = useContext(ApiContext);
  const client = options?.client || apiClient;

  function init({ keepDataWhileLoading }) {
    if (!keepDataWhileLoading) setData();
    setLoading(true);
    setError(false)
    cancelRequest(RENEW_REQUEST);
  }

  function load(options) {
    console.log('load in useQuery called');
    // //init(options);
    const variables = options?.variables;
    const { promise: dataPromise, cancel } = client.query({ query, variables });
    console.log(collateContext);
    // functions cannot be direct values in states as function are taken as a way to create derived states
    // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
    // setCancel(() => cancel);
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

    if (!collateContext.resolved) {
      let cancel = Function.prototype;

      const effectPr = new Promise((resolve) => {
        cancel = () => {
          if (!dataContext[callId]) {
            dataContext[callId] = { error: { message: "timeout" }, id: callId };
          }
          resolve(callId);
        };
        return dataPromise
          .then((res) => {
            dataContext[callId] = { data: res };
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
        cancel: cancel,
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

  if (typeof window === 'undefined' && !options?.lazyLoad) {
    load(options);
  }

  return { data, loading, error, load, cancel: cancelRequest || (() => { }) };
}

export default useQuery;