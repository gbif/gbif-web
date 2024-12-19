import { StandaloneWrapper } from '@/components/standaloneWrapper';
import { useStringParam } from '@/hooks/useParam';
import { RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { useEffect, useMemo, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { occurrenceKeyRoutes } from '.';
import { OccurrenceKeySkeleton } from './occurrenceKey';

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

  return (
    <StandaloneWrapper
      loadingElement={<OccurrenceKeySkeleton />}
      routes={routes}
      url={`/occurrence/${occurrenceKey}`}
    />
  );
}

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
    const rootOccurrenceKey = new URLSearchParams(window.location.search)
      .get('entity')
      ?.split('o_')[1];
    const drawerOccurrenceKey = drawerLocation.pathname.split('/occurrence/')[1].split('/')[0];

    if (rootOccurrenceKey === drawerOccurrenceKey) return;

    setEntityParam.current(drawerOccurrenceKey);
  }, [drawerLocation]);

  return <Outlet />;
}
