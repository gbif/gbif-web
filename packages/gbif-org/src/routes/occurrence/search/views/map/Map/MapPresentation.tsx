import React, { useCallback, useState } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ViewHeader } from '@/components/ViewHeader';
import { cn } from '@/utils/shadcn';
import { useEntityDrawer } from '../../browseList/useEntityDrawer';
import { useOrderedList } from '../../browseList/useOrderedList';
import { OccurrenceOverlay, PointClickData } from './types';
import { OccurrenceSearchMetadata } from '@/contexts/search';
import ListBox from './ListBox';
import { OccurrencePointQuery } from '@/gql/graphql';
import { QueryError } from '@/hooks/useQuery';
import AdHocMap, { AdHocMapProps } from './AdHocMap';

export interface MapPresentationProps {
  overlays?: OccurrenceOverlay[];
  pointData?: OccurrencePointQuery;
  pointError?: QueryError;
  pointLoading?: boolean;
  loading?: boolean;
  total?: number;
  registerPredicate?: () => void;
  loadPointData?: (data: PointClickData) => void;
  defaultMapSettings?: OccurrenceSearchMetadata['mapSettings'];
  style?: React.CSSProperties;
  className?: string;
  mapStyleAttr?: React.CSSProperties;
  features?: string[];
  onFeaturesChange?: (params: { features: string[] }) => void;
}

function MapPresentation({
  overlays = [],
  pointData,
  pointError,
  pointLoading,
  loading,
  total,
  registerPredicate,
  loadPointData,
  defaultMapSettings,
  style,
  className,
  features,
  onFeaturesChange,
}: MapPresentationProps) {
  const { setOrderedList } = useOrderedList();
  const [listVisible, showList] = useState<boolean>(false);
  const [, setPreviewKey] = useEntityDrawer();
  const items = React.useMemo(
    () => pointData?.occurrenceSearch?.documents?.results || [],
    [pointData]
  );
  const updateList = useCallback(() => {
    setOrderedList(items.filter((x) => x != null).map((item) => `o_${item.key}`));
  }, [items, setOrderedList]);

  const selectPreview = useCallback(
    (key: string) => {
      updateList();
      setPreviewKey(`o_${key}`);
    },
    [setPreviewKey, updateList]
  );

  const mapProps: AdHocMapProps = {
    overlays,
    loading,
    onOverlayTileError: registerPredicate,
    loadPointData,
    defaultMapSettings,
    style,
    className,
    features,
    onFeaturesChange,
    showList,
    tools: true,
  };

  return (
    <>
      <div
        className={cn('mapArea g-flex-auto g-flex g-h-full g-flex-col g-relative', className)}
        style={style}
      >
        <ViewHeader message="counts.nResultsWithCoordinates" loading={loading} total={total} />
        {listVisible && (
          <div className="gbif-resultList g-z-20 g-absolute g-start-0 g-top-6 g-m-2 g-w-96 g-max-w-full g-max-h-[calc(100%-4rem)] g-h-full">
            <ErrorBoundary type="CARD">
              <ListBox
                onCloseRequest={() => showList(false)}
                onClick={({ index }: { index: number }) => {
                  const itemKey = items[index]?.key;
                  if (typeof itemKey !== 'undefined') {
                    selectPreview(`${itemKey}`);
                  }
                }}
                data={pointData}
                error={pointError}
                loading={pointLoading}
              />
            </ErrorBoundary>
          </div>
        )}
        <AdHocMap className="g-flex-auto g-h-96 g-relative g-z-10" {...mapProps} />
      </div>
    </>
  );
}

export default MapPresentation;
