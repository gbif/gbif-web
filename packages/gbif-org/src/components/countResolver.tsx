import { useConfig } from '@/config/config';
import { useEffect, useState } from 'react';

type Props = {
  countPart: string;
};

export function CountResolver({ countPart }: Props) {
  if (isAbsoluteEndpoint(countPart) || isRelativeEndpoint(countPart)) {
    return <CountFetcher countPart={countPart} />;
  }

  return countPart;
}

function CountFetcher({ countPart }: Props) {
  const config = useConfig();
  const [count, setCount] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = createEndpoint(config.countEndpoint, countPart);

    fetch(endpoint)
      .then((response) => response.json() as Promise<unknown>)
      .then((result) => {
        const count = extractCountFromResult(result);
        setCount(count);
      })
      .catch((error) => console.error(error));
  }, [config.countEndpoint, countPart]);

  return count;
}

const isAbsoluteEndpoint = (countPart: string) => countPart.startsWith('http');

const isRelativeEndpoint = (countPart: string) => countPart.startsWith('/api/');

const createEndpoint = (countEndpoint: string, countPart: string): string => {
  if (isAbsoluteEndpoint(countPart)) return countPart;
  const queryParams = countPart.split('?')[1];
  return `${countEndpoint}/content?${queryParams}`;
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

const extractCountFromResult = (result: unknown): string | null => {
  if (!isObject(result)) return null;
  if ('count' in result && typeof result.count === 'number') {
    return result.count.toString();
  }
  if (
    'documents' in result &&
    isObject(result.documents) &&
    'total' in result.documents &&
    typeof result.documents.total === 'number'
  ) {
    return result.documents.total.toString();
  }
  return null;
};
