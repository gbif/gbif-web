import { ClientSideOnly } from '@/components/clientSideOnly';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import { truncate } from '@/utils/truncate';
import set from 'lodash/set';
import React, { useContext, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Card } from '../../ui/smallCard';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';
import { AboutButton } from '../aboutButton';
import { PolygonLabel } from '../displayNames';
import { AdditionalFilterProps, ApplyCancel, filterLocationConfig } from '../filterTools';
import { Option } from '../option';
import { GeometryInput, isValidWKT } from './GeometryInput';
import MapInput from './MapInput';
import { RangeInput } from './RangeInput';
import { CopyToClipboard, InvalidWkt, RecentInput } from './RecentInput';

type WildcardProps = Omit<filterLocationConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

const GeometryFilter = React.forwardRef<HTMLInputElement, WildcardProps>(
  ({ className, filterHandle, onApply, onCancel, pristine, about }: WildcardProps, ref) => {
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, setFullField, setFilter, filterHash } = currentFilterContext;
    const hasCoordinate = filter?.must?.hasCoordinate?.[0];
    const hasGeospatialIssue = filter?.must?.hasGeospatialIssue?.[0];
    const [selected, setSelected] = useState<string[]>([]);
    const [count, setCount] = useState(selected.length);

    const About = about;
    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          <>
            {count > 0 && (
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

    useEffect(() => {
      setSelected(filter?.must?.geometry ?? []);
      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSelected, filterHash]);

    useEffect(() => {
      let c = selected.length;
      if (typeof hasCoordinate !== 'undefined') {
        c++;
      }
      if (typeof hasGeospatialIssue !== 'undefined') {
        c++;
      }
      setCount(c);
    }, [selected, hasCoordinate, hasGeospatialIssue]);

    return (
      <ClientSideOnly>
        <div className={cn('g-flex g-flex-col g-max-h-[90dvh]', className)}>
          <div
            className={cn(
              'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center'
            )}
          >
            {count > -1 && (
              <div className="g-flex-none g-text-xs g-font-bold">
                <FormattedMessage id="counts.nSelected" values={{ total: count }} />
              </div>
            )}
            {options}
          </div>
          <div className="g-flex-auto g-overflow-auto gbif-small-scrollbar">
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
              <div>
                <Tabs defaultValue="gbifLocationTabMap">
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
                        onAdd={({ wkt }: { wkt: string[] }) => {
                          const options = filter.must?.geometry ?? [];
                          const allOptions = [...new Set([...wkt, ...options])];
                          setFullField(filterHandle, allOptions, []);
                        }}
                      />
                    </Card>
                  </TabsContent>
                  <TabsContent value="gbifLocationTabRange">
                    <Card className="g-mt-2 g-p-2 g-text-sm">
                      <RangeInput
                        onAdd={({ wkt }) => {
                          const options = filter.must?.geometry ?? [];
                          const allOptions = [...new Set([...wkt, ...options])];
                          setFullField(filterHandle, allOptions, []);
                        }}
                      />
                    </Card>
                  </TabsContent>
                  <TabsContent value="gbifLocationTabRecent">
                    <Card className="g-mt-2 g-p-2">
                      <RecentInput
                        onAdd={({ wkt }) => {
                          const options = filter.must?.geometry ?? [];
                          const allOptions = [...new Set([...wkt, ...options])];
                          setFullField(filterHandle, allOptions, []);
                        }}
                        currentlySelected={filter.must?.geometry ?? []}
                      />
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="g-px-4 g-py-1.5 g-text-sm">
                {selected.length > 0 && (
                  <div>
                    {selected.map((concept) => {
                      const isValid = isValidWKT(concept);
                      return (
                        <Option
                          className="g-mb-1"
                          // innerRef={index === 0 ? focusRef : null}
                          key={concept}
                          helpText={
                            isValid ? (
                              <div
                                className="g-text-slate-400"
                                style={{ fontSize: 12, lineHeight: 1.2 }}
                              >
                                <PolygonLabel id={concept} />
                              </div>
                            ) : (
                              <InvalidWkt />
                            )
                          }
                          checked={true}
                          onClick={() => {
                            toggle(filterHandle, concept);
                          }}
                        >
                          <span className="g-break-all">
                            {truncate(concept, 50)} <CopyToClipboard text={concept} />
                          </span>
                        </Option>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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

export default GeometryFilter;
