import { useState, useEffect, useRef } from 'react';
import axios from './api/axios';
import env from '../../.env.json';
import en from '../../locales/dist/en.json'; 

const localeMappingPromise = axios.get(`${env.TRANSLATIONS}/translations.json`);

const useUnmounted = () => {
  const unmounted = useRef(false)
  useEffect(() => () => {
    unmounted.current = true
  }, [])
  return unmounted
}

function useTranslation({ locale }) {
  const [messages, setMessages] = useState(en);
  const [localeMap, setLocaleMap] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // functions are called when passed to useState so it has to be wrapped. 
  // We provide an empty call, just so we do not have to check for existence subsequently
  const [cancelRequest, setCancel] = useState(() => () => { });
  const unmounted = useUnmounted();
  
  function load({locale}) {
    if (locale === 'en') {
      setMessages(en);
      return;
    }
    setLoading(true);
    setError(false);
    localeMappingPromise
      .promise
      .then(mappingResponse => {
        const localeMapping = mappingResponse.data;
        setLocaleMap(localeMapping[locale]?.localeMap);
        const messagesUrl = localeMapping[locale]?.messages;
        if (messagesUrl) {
          const { promise: localePromise, cancel } = axios.get(messagesUrl);
          // functions cannot be direct values in states as function are taken as a way to create derived states
          // https://medium.com/swlh/how-to-store-a-function-with-the-usestate-hook-in-react-8a88dd4eede1
          setCancel(() => cancel);
          
          localePromise
            .then(messageResponse => {
              setMessages(messageResponse.data);
              setLoading(false);
            })
            .catch(err => {
              setMessages();
              setLoading(false);
              setError(true);
            });
        } else {
          setLoading(false);
          setError(true);
          console.log('Translation not found');
        }
      })
      .catch(console.log)
    

    // dataPromise.
    //   then(response => {
    //     if (unmounted.current) return;
    //     const { data, error } = response;
    //     if (error?.isCanceled?.message === RENEW_REQUEST) {
    //       return;
    //     }
    //     setError(error);
    //     setData(data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     if (unmounted.current) return;
    //     setError({ error: true, type: 'unknown' });
    //     setData();
    //     setLoading(false);
    //   });
  }

  // Cancel pending request on unmount
  useEffect(() => () => {
    cancelRequest();
  }, [cancelRequest]);

  useEffect(() => {
    load({locale});
    // we have above cleanup useEffect for unmounting
  }, [locale]);

  return { messages, localeMap, loading, error };
}

export default useTranslation;