import { fetchWithCancel } from '@/utils/fetchWithCancel';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

type AltmetricDonutData = {
  images?: {
    medium?: string;
  };
  details_url?: string;
};

export function AltmetricDonut({ doi, className, ...props }: { doi: string; className?: string }) {
  const [donut, setDonut] = useState<AltmetricDonutData | undefined>();

  useEffect(() => {
    if (typeof doi !== 'string') return;
    const { promise, cancel } = fetchWithCancel(`https://api.altmetric.com/v1/doi/${doi}`);
    promise
      .then((response) => response.json())
      .then((data) => {
        setDonut(data);
      })
      .catch((err) => {
        if (err.__CANCEL__) {
          //we safely ignore this. It was cancelled
        } else {
          // ignore any errors
        }
      });
    return function cleanup() {
      cancel();
    };
  }, [doi]);

  if (typeof doi !== 'string') return null;

  if (!doi || !donut || !donut.images?.medium) return null;
  return (
    <a href={donut?.details_url} className={className} {...props}>
      <img src={donut?.images?.medium} width={50} />
    </a>
  );
}

AltmetricDonut.propTypes = {
  doi: PropTypes.string,
};
