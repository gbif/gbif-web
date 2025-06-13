import { Setter } from '@/types';
import { cn } from '@/utils/shadcn';
import { toRecord } from '@/utils/toRecord';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { FormattedMessage } from 'react-intl';
import {
  BaseMapOption,
  BinningOption,
  ColorOption,
  BinningType,
  mapWidgetOptions,
} from '../../../options';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

type CustomTabContentProps = {
  setSelectedBaseMapOption: Setter<BaseMapOption | undefined>;
  setSelectedBinningOption: Setter<BinningOption | undefined>;
  setSelectedColorOption: Setter<ColorOption | undefined>;
  selectedColorOption: ColorOption;
  selectedBinningOption: BinningOption;
  selectedBaseMapOption: BaseMapOption;
  binningType: BinningType;
  className?: string;
  basemapsRecord: Record<string, BaseMapOption>;
  binningRecord: Record<string, BinningOption>;
};

export function CustomTabContent({
  setSelectedBaseMapOption,
  setSelectedBinningOption,
  setSelectedColorOption,
  selectedColorOption,
  selectedBinningOption,
  selectedBaseMapOption,
  binningType,
  className,
  basemapsRecord,
  binningRecord,
}: CustomTabContentProps) {
  const validColorOptions = mapWidgetOptions.colors.filter(
    (colorOption) => colorOption.type === binningType
  );
  const colorsRecord = toRecord(validColorOptions, (x) => x.name);

  // If the selected color option becomes invalid, switch to the first valid option
  useEffect(() => {
    if (binningType !== selectedColorOption.type) {
      const bestMatch =
        validColorOptions.find((option) => option.name === selectedColorOption.name) ??
        validColorOptions[0];
      setSelectedColorOption(bestMatch);
    }
  }, [binningType, selectedColorOption, setSelectedColorOption, validColorOptions]);

  return (
    <div className={cn('g-space-y-6', className)}>
      <Label className="g-text-xs">
        <FormattedMessage id="map.baseMap" />
        <Select
          value={selectedBaseMapOption.name}
          onValueChange={(basemapOptionName) =>
            setSelectedBaseMapOption(basemapsRecord[basemapOptionName])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={<FormattedMessage id="map.baseMap" />} />
          </SelectTrigger>
          <SelectContent>
            {mapWidgetOptions.basemaps.map((option) => (
              <SelectItem value={option.name} key={option.name}>
                <FormattedMessage id={`map.basemap.${option.name}`} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="g-text-xs">
        <FormattedMessage id="map.binning" />
        <Select
          value={selectedBinningOption.name}
          onValueChange={(binningOptionName) =>
            setSelectedBinningOption(binningRecord[binningOptionName])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={<FormattedMessage id="map.binning" />} />
          </SelectTrigger>
          <SelectContent>
            {mapWidgetOptions.binning.map((option) => (
              <SelectItem value={option.name} key={option.name}>
                <FormattedMessage id={`map.bin.${option.name}`} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="g-text-xs">
        <FormattedMessage id="map.chooseColors" />

        <Select
          value={selectedColorOption.name}
          onValueChange={(colorsOptionName) =>
            setSelectedColorOption(colorsRecord[colorsOptionName])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={<FormattedMessage id="map.chooseColors" />} />
          </SelectTrigger>
          <SelectContent>
            {validColorOptions.map((option) => (
              <SelectItem value={option.name} key={option.name + '-' + option.type}>
                <FormattedMessage id={`map.colors.${option.name}`} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
}
