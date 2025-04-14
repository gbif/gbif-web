// Don't import anything from open layers in this component
// We want to keep the open layers dependency in a separate chunk
// This is to avoid loading open layers on the initial page load

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { Projection } from '@/config/config';
import useBelow from '@/hooks/useBelow';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useDynamicNavigate } from '@/reactRouterPlugins/dynamicLink';
import { BoundingBox } from '@/types';
import { cn } from '@/utils/shadcn';
import { lazy, useEffect, useRef, useState } from 'react';
import { mapWidgetOptions, RasterStyles } from '../options';
import { BasisOfRecordFilter } from './controls/basisOfRecordFilter';
import { ClickToExploreAreaButton } from './controls/clickToExploreAreaButton';
import { ExploreLink } from './controls/exploreLink';
import { ProjectionSelector } from './controls/projectionSelector';
import { StyleSelector } from './controls/styleSelector/styleSelector';
import { YearFilter } from './controls/yearFilter';
import { useCapabilities } from './useCapabilities';
import { useFilterParams } from './useFilterParams';

const MapWidgetInner = lazy(() => import('../inner'));

type Props = {
  className?: string;
  capabilitiesParams?: Record<string, string>;
  mapStyle?: string;
};

const LOWER_LIMIT = 1500;
const UPPER_LIMIT = new Date().getFullYear();

const defaultRasterStyles = mapWidgetOptions.predefined.find((x) => x.name === 'GREEN')!;

export function MapWidgetOuter({ className, capabilitiesParams = {}, mapStyle }: Props) {
  const isSmallScreen = useBelow(800, true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => setIsFullScreen((current) => !current);

  const [selectedProjection, setSelectedProjection] = useState<Projection>('EPSG_4326');

  const [rasterStyles, setRasterStyles] = useState<RasterStyles>(
    mapWidgetOptions.predefined.find((x) => x.name === mapStyle) || defaultRasterStyles
  );

  const [basisOfRecord, setBasisOfRecord] = useState<string[]>([]);

  // Year filter state
  const [isYearFilterActive, setIsYearFilterActive] = useState(false);
  const [startYear, setStartYear] = useState<number>();
  const [endYear, setEndYear] = useState<number>();

  // The bounding box of the area that is currently visible on the map
  const [boundingBox, setBoundingBox] = useState<BoundingBox>();

  const [clickToSearchAreaEnabled, setClickToSearchAreaEnabled] = useState(false);
  // Disable the click to explore funciton if clicking outside the map
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setClickToSearchAreaEnabled(false));

  // Create a params object based on all the state filters
  const filterParams = useFilterParams(
    basisOfRecord,
    isYearFilterActive,
    startYear,
    endYear,
    capabilitiesParams?.taxonKey,
    capabilitiesParams?.country
  );

  const dynamicNavigate = useDynamicNavigate();

  const { data: capabilities } = useCapabilities({ capabilitiesParams });

  useEffect(() => {
    if (!!capabilities && (capabilitiesParams?.taxonKey || capabilitiesParams?.country)) {
      setBoundingBox({
        top: capabilities.minLat,
        left: capabilities.maxLat,
        bottom: capabilities.minLng,
        right: capabilities.maxLng,
      });
    }
  }, [capabilities, capabilitiesParams?.taxonKey, capabilitiesParams?.country]);

  // Update the start and end year based on the capabilities
  useEffect(() => {
    if (capabilities?.minYear) {
      setStartYear((current) => Math.max(current ?? 0, capabilities.minYear));
    }
  }, [capabilities?.minYear]);
  useEffect(() => {
    if (capabilities?.maxYear) {
      setEndYear((current) => Math.max(current ?? 0, capabilities.maxYear));
    }
  }, [capabilities?.maxYear]);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullScreen]);

  const yearFilter = (
    <YearFilter
      isYearFilterActive={isYearFilterActive}
      setIsYearFilterActive={setIsYearFilterActive}
      startYear={startYear}
      endYear={endYear}
      setStartYear={setStartYear}
      setEndYear={setEndYear}
      lowerLimit={capabilities?.minYear ?? LOWER_LIMIT}
      upperLimit={capabilities?.maxYear ?? UPPER_LIMIT}
    />
  );

  return (
    <div className={cn('g-w-full', className)}>
      {/* Placeholder with the same size as the map+controls that will prevent the page from hopping up and down when entering and exiting the full screen mode */}
      {isFullScreen && <div className="g-aspect-[2.5] g-min-h-[300px]  g-w-full g-mb-12" />}
      <div
        className={cn('g-flex g-flex-col g-w-full', {
          'g-fixed g-z-50 g-top-0 g-left-0 g-h-screen': isFullScreen,
        })}
      >
        <div className="g-flex-1 g-w-full g-aspect-[2.5] g-min-h-[300px] g-bg-gray-100 g-border-t">
          <ErrorBoundary type="BLOCK" publicDescription="Failed to load javascript to display map">
            <div ref={ref} className="g-w-full g-h-full g-aspect-[2.5] g-min-h-[300px]">
              <StaticRenderSuspence>
                <MapWidgetInner
                  className="g-w-full g-h-full"
                  isFullSize={isFullScreen}
                  toggleFullScreen={toggleFullScreen}
                  generatedAt={capabilities?.generated}
                  capabilities={capabilities}
                  filterParams={filterParams}
                  selectedProjection={selectedProjection}
                  rasterStyles={rasterStyles}
                  setBoundingBox={setBoundingBox}
                  enabledSearchAreaClick={clickToSearchAreaEnabled}
                  onSearchAreaClick={(geometryFilter) => {
                    dynamicNavigate({
                      pageId: 'occurrenceSearch',
                      searchParams: { ...filterParams, geometry: geometryFilter },
                    });
                  }}
                />
              </StaticRenderSuspence>
            </div>
          </ErrorBoundary>
        </div>
        <div className="g-bg-white g-w-full g-flex g-justify-between g-px-2 g-border-t g-h-12">
          {isSmallScreen ? <div /> : yearFilter}
          <div className="g-flex g-items-center g-gap-2">
            <ExploreLink
              className="g-pr-2"
              boundingBox={boundingBox}
              projection={selectedProjection}
              filterParams={filterParams}
            />
            <BasisOfRecordFilter
              selected={basisOfRecord}
              setSelected={setBasisOfRecord}
              yearFilter={isSmallScreen ? yearFilter : undefined}
            />
            <StyleSelector rasterStyles={rasterStyles} setRasterStyles={setRasterStyles} />
            <ProjectionSelector
              selectedProjection={selectedProjection}
              setSelectedProjection={setSelectedProjection}
            />
            <ClickToExploreAreaButton
              clickToSearchAreaEnabled={clickToSearchAreaEnabled}
              setClickToSearchAreaEnabled={setClickToSearchAreaEnabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
