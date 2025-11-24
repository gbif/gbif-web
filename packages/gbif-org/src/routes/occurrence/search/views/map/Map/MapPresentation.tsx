import React from 'react';
import { ViewHeader } from '@/components/ViewHeader';
import { cn } from '@/utils/shadcn';
import { OccurrenceOverlay } from './types';
import { OccurrenceSearchMetadata } from '@/contexts/search';
import AdHocMap, { AdHocMapProps } from './AdHocMap';

export interface MapPresentationProps {
  overlays?: OccurrenceOverlay[];
  loading?: boolean;
  total?: number;
  countLoading?: boolean;
  registerPredicate?: () => void;
  defaultMapSettings?: OccurrenceSearchMetadata['mapSettings'];
  style?: React.CSSProperties;
  className?: string;
  mapStyleAttr?: React.CSSProperties;
  features?: string[];
  onFeaturesChange?: (params: { features: string[] }) => void;
}

function MapPresentation({
  overlays = [],
  loading,
  total,
  countLoading,
  registerPredicate,
  defaultMapSettings,
  style,
  className,
  features,
  onFeaturesChange,
}: MapPresentationProps) {
  const mapProps: AdHocMapProps = {
    overlays,
    loading,
    onOverlayTileError: registerPredicate,
    defaultMapSettings,
    style,
    className,
    features,
    onFeaturesChange,
    tools: true,
  };

  return (
    <div
      className={cn('mapArea g-flex-auto g-flex g-h-full g-flex-col g-relative', className)}
      style={style}
    >
      <ViewHeader message="counts.nResultsWithCoordinates" loading={countLoading} total={total} />
      <AdHocMap className="g-flex-auto g-h-96 g-relative g-z-10" {...mapProps} />
    </div>
  );
}

export default MapPresentation;
