import { StandaloneWrapper } from '@/components/standaloneWrapper';
import { occurrenceKeyRoutes } from '.';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useRef } from 'react';
import { useStringParam } from '@/hooks/useParam';

type Props = {
  occurrenceKey?: string | null;
};

export function StandaloneOccurrenceKeyPage({ occurrenceKey }: Props) {
  const [, setEntity] = useStringParam({ key: 'entity' });
  const setEntityParam = useRef((id: string) => {
    setEntity(`o_${id}`);
  });

  const routes: RouteObjectWithPlugins[] = useMemo(
    () => [
      {
        element: <SyncDrawerOccurenceIdWithRootRouter setEntityParam={setEntityParam} />,
        children: occurrenceKeyRoutes,
      },
    ],
    []
  );

  return <StandaloneWrapper routes={routes} url={`/occurrence/${occurrenceKey ?? 'loading'}`} />;
}

const extractOccurrenceKey = (pathname: string): string => {
  return pathname.split('/occurrence/')[1].split('/')[0];
};

// This component is used to handle the case where the user navigates to another occurrence within the drawer.
// The new occurrence will be displayed in the drawer, but the URL will not be updated.
// Therefore, we need to update the URL when the user navigates to another occurrence.
function SyncDrawerOccurenceIdWithRootRouter({
  setEntityParam,
}: {
  setEntityParam: React.MutableRefObject<(id: string) => void>;
}) {
  const drawerLocation = useLocation();

  useEffect(() => {
    const rootOccurrenceKey = extractOccurrenceKey(window.location.pathname);

    if (
      drawerLocation.pathname !== '/occurrence/loading' ||
      !drawerLocation.pathname.startsWith(`/occurrence/${rootOccurrenceKey}`)
    ) {
      const drawerOccurrenceKey = extractOccurrenceKey(drawerLocation.pathname);
      setEntityParam.current(drawerOccurrenceKey);
    }
  }, [drawerLocation]);

  return <Outlet />;
}
