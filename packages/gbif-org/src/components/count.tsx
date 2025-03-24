import { stringify } from '@/utils/querystring';
import get from 'lodash/get';
import Queue from 'queue-promise';
import { useEffect, useState } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Skeleton } from './ui/skeleton';

const concurrent = 10;
const interval = 0;

const queues: {
  [key: string]: Queue;
} = {};

export type CountProps = {
  v1Endpoint: string;
  params?: Record<string, undefined | string | number | (number | string)[]>;
  queueId?: string;
  property?: string;
  responseIsNumber?: boolean;
};

type Props = CountProps & {
  message?: string;
};

export function Count({ v1Endpoint, params, queueId, property, message }: Props) {
  const { count, loading, error } = useCount({ v1Endpoint, params, queueId, property });

  if (loading || typeof count === 'undefined') {
    return (
      <Skeleton>
        <span className="g-opacity-0">Loading</span>
      </Skeleton>
    );
  }
  if (error) return false;

  if (message) {
    return <FormattedMessage id={message} values={{ total: count }} />;
  } else {
    return <FormattedNumber value={count} />;
  }
}

export function useCount({
  v1Endpoint,
  params = {},
  queueId = 'counts',
  property = 'count',
  responseIsNumber = false,
}: CountProps) {
  const [count, setCount] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const endpoint = `${import.meta.env.PUBLIC_API_V1}${v1Endpoint}?${stringify({
      limit: 0,
      ...params,
    })}`;

    setLoading(true);

    // create a function to start the request. we will put this in the queue afterwards
    const startRequest = () =>
      fetch(endpoint, { signal })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setError(false);
          const total = responseIsNumber ? data : get(data, property);
          if (typeof total === 'number') {
            setCount(total);
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.name === 'AbortError') {
            setError(false);
          } else {
            setError(true);
          }
        });

    // if no queue exists, create a new one
    if (!queues[queueId]) {
      queues[queueId] = new Queue({
        concurrent,
        interval,
        start: true,
      });
    }

    // add the request to the queue
    queues[queueId].enqueue(startRequest);

    return () => {
      // cancel the request before unmounting
      controller.abort();
    };
  }, [v1Endpoint, property]);

  return { count, loading, error };
}
