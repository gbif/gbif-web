import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import css from './globe.module.css';
import { GlobeQuery, GlobeQueryVariables } from '@/gql/graphql';

export default function Globe({
  lat,
  lon,
  svg,
  isTrackingData,
  className,
  style,
  children,
  ...props
}: {
  lat: number;
  lon: number;
  svg: string;
  children?: React.ReactNode;
  isTrackingData?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { data, error, loading, load } = useQuery<GlobeQuery, GlobeQueryVariables>(GLOBE, { lazyLoad: true });

  useEffect(() => {
    if (typeof lat !== 'undefined') {
      load({ variables: { lat, lon } });
    }
  }, [lat, lon]);

  return (
    <div className={cn('w-20 h-20', css.globe, className)} {...props}>
      {!loading && !error && !!data?.globe?.svg && (
        <>
          <div
            className={css.globeSvg}
            dangerouslySetInnerHTML={{ __html: data?.globe?.svg }}
          ></div>
          <div className={css.globeOverlay}></div>
          <div
            className={cn(css.globeSvg, isTrackingData ? css.isTrackingData : null)}
            dangerouslySetInnerHTML={{ __html: svg }}
          ></div>
        </>
      )}
    </div>
  );
}

const GLOBE = /* GraphQL */ `
query globe($lat: Float!, $lon: Float!){
  globe(cLat: $lat, cLon: $lon) {
    svg
  }
}
`;
