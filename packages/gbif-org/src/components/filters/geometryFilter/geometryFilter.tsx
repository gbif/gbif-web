import { SearchInput } from '@/components/searchInput';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdOutlineRemoveCircle,
  MdArrowBack,
} from 'react-icons/md';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest } from '../suggest';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option, SkeletonOption } from '../option';
import {
  AdditionalFilterProps,
  ApplyCancel,
  AsyncOptions,
  filterLocationConfig,
  FilterSummaryType,
  getAsQuery,
  getFilterSummary,
  WildcardQuery,
} from '../filterTools';
import { useSearchContext } from '@/contexts/search';
import { AboutButton } from '../aboutButton';
import { Exists } from '../exists';
import StripeLoader from '../../stripeLoader';
import { Button } from '../../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import set from 'lodash/set';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '../../ui/smallCard';
import MapInput from './MapInput';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { GeometryInput } from './GeometryInput';

const initialSize = 25;

type WildcardProps = Omit<filterLocationConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const GeometryFilter = React.forwardRef<HTMLInputElement, WildcardProps>(
  (
    {
      className,
      searchConfig,
      filterHandle,
      disallowLikeFilters,
      displayName: DisplayName,
      suggestQuery,
      queryKey,
      keepCase,
      onApply,
      onCancel,
      pristine,
      about,
    }: WildcardProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash, negateField } =
      currentFilterContext;
    const hasCoordinate = filter?.must?.hasCoordinate?.[0];
    const hasGeospatialIssue = filter?.must?.hasGeospatialIssue?.[0];
    const [selected, setSelected] = useState<string[]>([]);

    const About = about;
    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          <>
            {selected.length > 0 && (
              <button
                className={cn('g-mx-1 g-px-1', !!About && 'g-pe-3 g-border-r g-me-2')}
                onClick={() => {
                  setFullField(filterHandle, [], []);
                }}
              >
                <MdDeleteOutline />
              </button>
            )}
          </>

          {About && (
            <AboutButton className="-g-me-1">
              <About />
            </AboutButton>
          )}
        </div>
      </>
    );

    return (
      <ClientSideOnly>
        <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
          <div
            className={cn(
              'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center'
            )}
          >
            {selected.length > -1 && (
              <div className="g-flex-none g-text-xs g-font-bold">
                <FormattedMessage id="counts.nSelected" values={{ total: selected?.length }} />
              </div>
            )}
            {options}
          </div>

          <div className="g-flex g-flex-wrap g-px-4 g-text-sm">
            <fieldset className="g-border-none g-p-0 g-m-0 g-flex g-mb-2">
              <div className="g-me-2">
                <Tertiary
                  value={hasCoordinate}
                  setValue={(val) => {
                    const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                    if (val === undefined) {
                      set(newFilter, `must.hasCoordinate`, []);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                    } else if (val === false) {
                      set(newFilter, `must.hasCoordinate`, ['false']);
                      set(newFilter, `must.hasGeospatialIssue`, []);
                    } else {
                      setFullField('hasCoordinate', ['true'], []);
                    }
                    setFilter(newFilter);
                  }}
                />
              </div>
              <legend className="g-p-0 g-mb-2">
                <FormattedMessage id="filters.hasCoordinate.name" />
              </legend>
            </fieldset>

            <fieldset className="g-border-none g-p-0 g-m-0 g-flex g-mb-2">
              <legend className="g-p-0 g-mb-2">
                <FormattedMessage id="filters.hasGeospatialIssues.name" />
              </legend>
              <div>
                <Tertiary
                  value={hasGeospatialIssue}
                  setValue={(val) => {
                    const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                    if (val === undefined) {
                      set(newFilter, `must.hasGeospatialIssue`, []);
                    } else if (val === false) {
                      set(newFilter, `must.hasCoordinate`, ['true']);
                      set(newFilter, `must.hasGeospatialIssue`, ['false']);
                    } else {
                      set(newFilter, `must.hasCoordinate`, ['true']);
                      set(newFilter, `must.hasGeospatialIssue`, ['true']);
                    }
                    setFilter(newFilter);
                  }}
                />
              </div>
            </fieldset>
          </div>

          <div className="g-px-4 g-py-1.5">
            <Tabs defaultValue="gbifLocationTabGeometry">
              <TabsList>
                <TabsTrigger value="gbifLocationTabMap">
                  <FormattedMessage id="filterSupport.location.map" />
                </TabsTrigger>
                <TabsTrigger value="gbifLocationTabGeometry">
                  <FormattedMessage id="filterSupport.location.geometry" />
                </TabsTrigger>
                <TabsTrigger value="gbifLocationTabRange">
                  <FormattedMessage id="filterSupport.location.range" />
                </TabsTrigger>
                <TabsTrigger value="gbifLocationTabRecent">
                  <FormattedMessage id="filterSupport.location.recent" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="gbifLocationTabMap">
                <Card className="g-mt-2">
                  <MapInput
                    geometryList={(filter.must?.geometry ?? []).map((x) => x.toString())}
                    onChange={({ wkt }) => {
                      const selection = [...new Set([...wkt])];
                      if (selection.length > 0) {
                        setFullField(filterHandle, selection, []);
                      } else {
                        // No idea why this makes a different. Should be the exact same as the line above. This is worrying.
                        setFullField(filterHandle, [], []);
                      }
                    }}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="gbifLocationTabGeometry">
                <Card className="g-mt-2">
                  <GeometryInput
                    onAdd={({ wkt }: {wkt: string[]}) => {
                      const options = filter.must?.geometry ?? [];
                      const allOptions = [...new Set([...wkt, ...options])];
                      setFullField(filterHandle, allOptions, []);
                    }}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="gbifLocationTabRange">
                <Card className="g-mt-2">gbifLocationTabRange</Card>
              </TabsContent>
              <TabsContent value="gbifLocationTabRecent">
                <Card className="g-mt-2">gbifLocationTabRecent</Card>
              </TabsContent>
            </Tabs>
          </div>

          <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
        </div>
      </ClientSideOnly>
    );
  }
);

function Tertiary({
  value,
  setValue,
}: {
  value?: boolean | string;
  setValue: (val?: boolean) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={typeof value === 'undefined' ? 'either' : value.toString()}
      variant="primary"
      onValueChange={(val) => {
        if (val === 'either' || val === undefined || val === '') {
          setValue(undefined);
        } else {
          setValue(val.toString() === 'true');
        }
      }}
    >
      <ToggleGroupItem value="true" variant="primary">
        <FormattedMessage id="search.ternary.yes" />
      </ToggleGroupItem>
      <ToggleGroupItem value="false" variant="primary">
        <FormattedMessage id="search.ternary.no" />
      </ToggleGroupItem>
      <ToggleGroupItem value="either" variant="primary">
        <FormattedMessage id="search.ternary.either" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
