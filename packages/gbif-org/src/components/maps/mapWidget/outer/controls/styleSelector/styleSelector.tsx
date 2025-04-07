import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaybeArray, Setter } from '@/types';
import { toRecord } from '@/utils/toRecord';
import { useCallback, useEffect, useState } from 'react';
import { MdFormatPaint } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import {
  BaseMapOption,
  BinningOption,
  ColorOption,
  mapWidgetOptions,
  Params,
  RasterStyles,
} from '../../../options';
import { PopoverIconTrigger } from '../shared/popoverIconTrigger';
import { PopoverTitle } from '../shared/popoverTitle';
import { CustomTabContent } from './customTabContent';
import { interopDefault } from '@/utils/interopDefault';
import _useLocalStorage from 'use-local-storage';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);

type Props = {
  rasterStyles: RasterStyles;
  setRasterStyles: Setter<RasterStyles>;
};

const binningRecord = toRecord(mapWidgetOptions.binning, (x) => x.name);
const basemapsRecord = toRecord(mapWidgetOptions.basemaps, (x) => x.name);
const predefinedRecord = toRecord(mapWidgetOptions.predefined, (x) => x.name);
// Can't create a record for color options here because the name is not unique when we are't filtering by type

const defaultBaseMapOption = basemapsRecord[mapWidgetOptions.defaults.basemap];
const defaultBinningOption = binningRecord[mapWidgetOptions.defaults.bin];
const defaultColorOption = mapWidgetOptions.colors[mapWidgetOptions.defaults.color];

export function StyleSelector({ rasterStyles, setRasterStyles }: Props) {
  const [tab, setTab] = useState('PREDEFINED');
  const [selectedBaseMapOption, setSelectedBaseMapOption] = useLocalStorage<BaseMapOption>(
    'mapWidgetOptions.selectedBaseMapOption',
    defaultBaseMapOption
  );
  const [selectedBinningOption, setSelectedBinningOption] = useLocalStorage<BinningOption>(
    'mapWidgetOptions.selectedBinningOption',
    defaultBinningOption
  );
  const [selectedColorOption, setSelectedColorOption] = useLocalStorage<ColorOption>(
    'mapWidgetOptions.selectedColorOption',
    defaultColorOption
  );

  const setRasterStylesToCustom = useCallback(() => {
    const newRasterStyles: RasterStyles = {
      name: 'CUSTOM',
      baseMapStyle: selectedBaseMapOption.style,
      params: createParams(selectedColorOption.params, selectedBinningOption.params),
    };

    setRasterStyles(newRasterStyles);
  }, [selectedColorOption, selectedBinningOption, selectedBaseMapOption, setRasterStyles]);

  // Update the external rasterStyles state when the selected options change
  useEffect(() => {
    if (tab === 'CUSTOM') {
      setRasterStylesToCustom();
    }
  }, [setRasterStylesToCustom, tab]);

  return (
    <Popover>
      <PopoverIconTrigger icon={MdFormatPaint} />
      <PopoverContent side="top" className="g-min-w-64 g-p-0" style={popoverContentStyle}>
        <PopoverTitle>
          <FormattedMessage id="map.style" />
        </PopoverTitle>
        <Tabs value={tab} onValueChange={(newTab) => setTab(newTab as Tab)} className="g-p-4">
          <TabsList>
            <TabsTrigger value="PREDEFINED">
              <FormattedMessage id="map.select" />
            </TabsTrigger>
            <TabsTrigger value="CUSTOM">
              <FormattedMessage id="map.custom" />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="PREDEFINED">
            <PredefinedTabContent
              className="g-p-2"
              rasterStyles={rasterStyles}
              setRasterStyles={setRasterStyles}
              setRasterStylesToCustom={setRasterStylesToCustom}
            />
          </TabsContent>
          <TabsContent value="CUSTOM">
            <CustomTabContent
              setSelectedBaseMapOption={setSelectedBaseMapOption}
              setSelectedBinningOption={setSelectedBinningOption}
              setSelectedColorOption={setSelectedColorOption}
              selectedColorOption={selectedColorOption}
              selectedBinningOption={selectedBinningOption}
              selectedBaseMapOption={selectedBaseMapOption}
              binningType={selectedBinningOption?.type === 'POLY' ? 'POLY' : 'POINT'}
              basemapsRecord={basemapsRecord}
              binningRecord={binningRecord}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

type PredefinedTabContentProps = {
  rasterStyles: RasterStyles;
  setRasterStyles: Setter<RasterStyles>;
  setRasterStylesToCustom: () => void;
  className?: string;
};

function PredefinedTabContent({
  rasterStyles,
  setRasterStyles,
  setRasterStylesToCustom,
  className,
}: PredefinedTabContentProps) {
  return (
    <RadioGroup
      value={rasterStyles.name}
      className={className}
      onValueChange={(v) => {
        if (v === 'CUSTOM') {
          setRasterStylesToCustom();
          return;
        }

        const newRasterStyles = predefinedRecord[v];
        if (newRasterStyles) setRasterStyles(newRasterStyles);
      }}
    >
      <Label className="g-cursor-pointer">
        <RadioGroupItem value="CUSTOM" />
        <span className="g-pl-2">
          <FormattedMessage id="map.predefined.CUSTOM" />
        </span>
      </Label>
      {mapWidgetOptions.predefined.map(({ name }) => (
        <Label className="g-cursor-pointer" key={name}>
          <RadioGroupItem value={name} />
          <span className="g-pl-2">
            <FormattedMessage id={`map.predefined.${name}`} />
          </span>
        </Label>
      ))}
    </RadioGroup>
  );
}

function createParams(colorParamsMaybeArray: MaybeArray<Params>, binParams: Params): Params[] {
  const asArray = Array.isArray(colorParamsMaybeArray)
    ? colorParamsMaybeArray
    : [colorParamsMaybeArray];
  return asArray.map((colorParams) => {
    return { ...colorParams, ...binParams };
  });
}

const popoverContentStyle: React.CSSProperties = {
  minHeight: 300, // The hight of the popover with the tallest tab open
};
