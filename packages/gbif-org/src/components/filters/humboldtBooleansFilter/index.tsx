import { ClientSideOnly } from '@/components/clientSideOnly';
import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import set from 'lodash/set';
import startCase from 'lodash/startCase';
import React, { useContext, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { AboutButton } from '../aboutButton';
import { AdditionalFilterProps, ApplyCancel, filterHumboldtBooleansConfig } from '../filterTools';
import { Tertiary } from '../geometryFilter/geometryFilter';
import { object } from 'zod';

type WildcardProps = Omit<filterHumboldtBooleansConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const HumboldtBooleansFilter = React.forwardRef<HTMLInputElement, WildcardProps>(
  ({ className, filterHandle, onApply, onCancel, pristine, about }: WildcardProps, ref) => {
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, setFullField, setFilter, filterHash } = currentFilterContext;
    const humboldtAreNonTargetTaxaFullyReported =
      filter?.must?.humboldtAreNonTargetTaxaFullyReported?.[0];
    const humboldtHasMaterialSamples = filter?.must?.humboldtHasMaterialSamples?.[0];
    const humboldtHasNonTargetOrganisms = filter?.must?.humboldtHasNonTargetOrganisms?.[0];
    const humboldtHasNonTargetTaxa = filter?.must?.humboldtHasNonTargetTaxa?.[0];
    const humboldtHasVouchers = filter?.must?.humboldtHasVouchers?.[0];
    const humboldtIsAbsenceReported = filter?.must?.humboldtIsAbsenceReported?.[0];
    const humboldtIsAbundanceCapReported = filter?.must?.humboldtIsAbundanceCapReported?.[0];
    const humboldtIsAbundanceReported = filter?.must?.humboldtIsAbundanceReported?.[0];
    const humboldtIsDegreeOfEstablishmentScopeFullyReported =
      filter?.must?.humboldtIsDegreeOfEstablishmentScopeFullyReported?.[0];
    const humboldtIsGrowthFormScopeFullyReported =
      filter?.must?.humboldtIsGrowthFormScopeFullyReported?.[0];
    const humboldtIsLeastSpecificTargetCategoryQuantityInclusive =
      filter?.must?.humboldtIsLeastSpecificTargetCategoryQuantityInclusive?.[0];
    const humboldtIsLifeStageScopeFullyReported =
      filter?.must?.humboldtIsLifeStageScopeFullyReported?.[0];
    const humboldtIsSamplingEffortReported = filter?.must?.humboldtIsSamplingEffortReported?.[0];
    const humboldtIsTaxonomicScopeFullyReported =
      filter?.must?.humboldtIsTaxonomicScopeFullyReported?.[0];
    const humboldtIsVegetationCoverReported = filter?.must?.humboldtIsVegetationCoverReported?.[0];

    const allBooleans = {
      humboldtAreNonTargetTaxaFullyReported,
      humboldtHasMaterialSamples,
      humboldtHasNonTargetOrganisms,
      humboldtHasNonTargetTaxa,
      humboldtHasVouchers,
      humboldtIsAbsenceReported,
      humboldtIsAbundanceCapReported,
      humboldtIsAbundanceReported,
      humboldtIsDegreeOfEstablishmentScopeFullyReported,
      humboldtIsGrowthFormScopeFullyReported,
      humboldtIsLeastSpecificTargetCategoryQuantityInclusive,
      humboldtIsLifeStageScopeFullyReported,
      humboldtIsSamplingEffortReported,
      humboldtIsTaxonomicScopeFullyReported,
      humboldtIsVegetationCoverReported,
    };

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
                  const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                  Object.keys(allBooleans).forEach((key) => {
                    set(newFilter, `must.${key}`, []);
                  });
                  setFilter(newFilter);
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
      Object.keys(allBooleans).map((key) => {
        setSelected(filter?.must?.[key] ?? []);
      });

      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSelected, filterHash]);

    useEffect(() => {
      const c = [
        humboldtAreNonTargetTaxaFullyReported,
        humboldtHasMaterialSamples,
        humboldtHasNonTargetOrganisms,
        humboldtHasNonTargetTaxa,
        humboldtHasVouchers,
        humboldtIsAbsenceReported,
        humboldtIsAbundanceCapReported,
        humboldtIsAbundanceReported,
        humboldtIsDegreeOfEstablishmentScopeFullyReported,
        humboldtIsGrowthFormScopeFullyReported,
        humboldtIsLeastSpecificTargetCategoryQuantityInclusive,
        humboldtIsLifeStageScopeFullyReported,
        humboldtIsSamplingEffortReported,
        humboldtIsTaxonomicScopeFullyReported,
        humboldtIsVegetationCoverReported,
      ].reduce((prev, cur) => (typeof cur !== 'undefined' ? prev + 1 : prev), selected.length);

      setCount(c);
    }, [
      selected,
      humboldtAreNonTargetTaxaFullyReported,
      humboldtHasMaterialSamples,
      humboldtHasNonTargetOrganisms,
      humboldtHasNonTargetTaxa,
      humboldtHasVouchers,
      humboldtIsAbsenceReported,
      humboldtIsAbundanceCapReported,
      humboldtIsAbundanceReported,
      humboldtIsDegreeOfEstablishmentScopeFullyReported,
      humboldtIsGrowthFormScopeFullyReported,
      humboldtIsLeastSpecificTargetCategoryQuantityInclusive,
      humboldtIsLifeStageScopeFullyReported,
      humboldtIsSamplingEffortReported,
      humboldtIsTaxonomicScopeFullyReported,
      humboldtIsVegetationCoverReported,
    ]);

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
            <div className="g-max-h-[50dvh] g-px-4 g-text-sm">
              {Object.keys(allBooleans).map((key) => (
                <fieldset key={key} className="g-border-none g-p-0 g-m-0 g-mb-2">
                  <div className="g-me-2">
                    <Tertiary
                      value={allBooleans[key]}
                      setValue={(val) => {
                        const newFilter = JSON.parse(JSON.stringify(filter ?? {}));
                        if (val === undefined) {
                          set(newFilter, `must.${key}`, []);
                        } else if (val === false) {
                          set(newFilter, `must.${key}`, ['false']);
                        } else {
                          set(newFilter, `must.${key}`, ['true']);
                        }
                        setFilter(newFilter);
                      }}
                    />
                  </div>
                  <legend className="g-p-0 g-mb-2">
                    <FormattedMessage
                      id={`filters.${key}.name`}
                      defaultMessage={startCase(key.split('humboldt')?.[1])}
                    />
                  </legend>
                </fieldset>
              ))}
            </div>
          </div>

          <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
        </div>
      </ClientSideOnly>
    );
  }
);

export default HumboldtBooleansFilter;
