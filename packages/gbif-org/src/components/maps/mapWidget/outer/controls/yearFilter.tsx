import { Button } from '@/components/ui/button';
import { useI18n } from '@/reactRouterPlugins';
import { Setter } from '@/types';
import { cn } from '@/utils/shadcn';
import * as Slider from '@radix-ui/react-slider';
import { useCallback, useEffect, useState } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

type Props = {
  upperLimit: number;
  lowerLimit: number;
  setStartYear: Setter<number | undefined>;
  setEndYear: Setter<number | undefined>;
  startYear?: number;
  endYear?: number;
  isYearFilterActive: boolean;
  setIsYearFilterActive: Setter<boolean>;
};

export function YearFilter({
  lowerLimit,
  upperLimit,
  setStartYear: setExternalStartYear,
  setEndYear: setExternalEndYear,
  startYear: externalStartYear,
  endYear: externalEndYear,
  isYearFilterActive,
  setIsYearFilterActive,
}: Props) {
  const inverted = useI18n().locale.textDirection === 'rtl';

  const [internalStartYear, setInternalStartYear] = useState(externalStartYear);
  const [internalEndYear, setInternalEndYear] = useState(externalEndYear);

  useEffect(() => setInternalEndYear(externalEndYear), [externalEndYear]);
  useEffect(() => setInternalStartYear(externalStartYear), [externalStartYear]);

  const handleInternalValueChange = useCallback(
    ([newStart, newEnd]: [number, number]) => {
      if (!isYearFilterActive) setIsYearFilterActive(true);
      setInternalStartYear(newStart);
      setInternalEndYear(newEnd);
    },
    [setInternalStartYear, setInternalEndYear, isYearFilterActive, setIsYearFilterActive]
  );

  const handleExternalValueChange = useCallback(
    ([newStart, newEnd]: [number, number]) => {
      setExternalStartYear(newStart);
      setExternalEndYear(newEnd);
    },
    [setExternalStartYear, setExternalEndYear]
  );

  return (
    <div className="g-flex g-items-center g-gap-2 g-flex-col md:g-flex-row">
      <div className="g-bg-gray-300 g-rounded g-flex">
        <Button
          size="sm"
          variant={isYearFilterActive ? 'plain' : 'default'}
          className={cn({ 'g-text-gray-700': isYearFilterActive })}
          onClick={() => setIsYearFilterActive(false)}
        >
          <FormattedMessage id="map.anyYear" />
        </Button>
        <Button
          size="sm"
          variant={isYearFilterActive ? 'default' : 'plain'}
          className={cn({ 'g-text-gray-700': !isYearFilterActive })}
          onClick={() => setIsYearFilterActive(true)}
        >
          <FormattedYear year={internalStartYear} /> - <FormattedYear year={internalEndYear} />
        </Button>
      </div>
      <Slider.Root
        min={lowerLimit}
        max={upperLimit}
        inverted={inverted}
        step={1}
        value={
          typeof internalStartYear === 'number' && typeof internalEndYear === 'number'
            ? [internalStartYear, internalEndYear]
            : undefined
        }
        onValueChange={handleInternalValueChange}
        onValueCommit={handleExternalValueChange}
        className={cn('g-relative g-flex g-items-center g-w-40 g-py-2', {
          'g-opacity-50': !isYearFilterActive,
        })}
      >
        <Slider.Track className="g-relative g-grow g-bg-gray-300 g-h-1 g-rounded g-cursor-pointer">
          <Slider.Range className="g-absolute g-bg-gray-500 g-h-1 g-rounded" />
        </Slider.Track>
        <Slider.Thumb className="g-block g-size-4 g-bg-gray-500 g-rounded-full focus:g-outline-primary-500 g-cursor-grab active:g-cursor-grabbing" />
        <Slider.Thumb className="g-block g-size-4 g-bg-gray-500 g-rounded-full focus:g-outline-primary-500 g-cursor-grab active:g-cursor-grabbing" />
      </Slider.Root>
    </div>
  );
}

function FormattedYear({ year }: { year?: number }) {
  if (!year) return null;
  const yearAsDate = new Date(year, 0, 1);
  return <FormattedDate value={yearAsDate.toISOString()} year="numeric" />;
}
