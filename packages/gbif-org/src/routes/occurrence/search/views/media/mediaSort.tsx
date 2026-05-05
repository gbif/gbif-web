import { SimpleTooltip } from '@/components/simpleTooltip';
import {
  BasisOfRecordLabel,
  CountryLabel,
  DatasetLabel,
  EstablishmentMeansLabel,
  LifeStageLabel,
  SexLabel,
  TaxonLabel,
  TypeStatusVocabularyLabel,
} from '@/components/filters/displayNames';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { cn } from '@/utils/shadcn';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ComponentType } from 'react';
import { FaSortUp as SortAscIcon, FaSortDown as SortDescIcon } from 'react-icons/fa6';
import { FormattedMessage } from 'react-intl';

export type MediaGroupMode = 'default' | 'random' | 'group' | 'yearDesc' | 'yearAsc';

export type GroupValueLabel = ComponentType<{ id: string | number | object }>;

export type GroupField = {
  /** GraphQL facet field name (e.g. 'datasetKey', 'sex'). */
  id: string;
  /** i18n key shown in the dropdown menu. */
  labelId: string;
  /** Component used to render an individual bucket value (e.g. TaxonLabel).
   *  Omit for plain values (e.g. year — just render the integer). */
  ValueLabel?: GroupValueLabel;
  /** Filter field name to use when the user clicks "Filter by this".
   *  Defaults to `id` when omitted. */
  filterField?: string;
};

export const GROUP_FIELDS: GroupField[] = [
  { id: 'datasetKey', labelId: 'filters.datasetKey.name', ValueLabel: DatasetLabel },
  {
    id: 'speciesKey',
    labelId: 'occurrenceFieldNames.species',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'genusKey',
    labelId: 'occurrenceFieldNames.genus',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'familyKey',
    labelId: 'occurrenceFieldNames.family',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'orderKey',
    labelId: 'occurrenceFieldNames.order',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'classKey',
    labelId: 'occurrenceFieldNames.class',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'phylumKey',
    labelId: 'occurrenceFieldNames.phylum',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'kingdomKey',
    labelId: 'occurrenceFieldNames.kingdom',
    ValueLabel: TaxonLabel,
    filterField: 'taxonKey',
  },
  {
    id: 'countryCode',
    labelId: 'filters.occurrenceCountry.name',
    ValueLabel: CountryLabel,
    filterField: 'country',
  },
  { id: 'basisOfRecord', labelId: 'filters.basisOfRecord.name', ValueLabel: BasisOfRecordLabel },
  { id: 'sex', labelId: 'occurrenceFieldNames.sex', ValueLabel: SexLabel },
  { id: 'lifeStage', labelId: 'occurrenceFieldNames.lifeStage', ValueLabel: LifeStageLabel },
  {
    id: 'typeStatus',
    labelId: 'occurrenceFieldNames.typeStatus',
    ValueLabel: TypeStatusVocabularyLabel,
  },
  {
    id: 'establishmentMeans',
    labelId: 'occurrenceFieldNames.establishmentMeans',
    ValueLabel: EstablishmentMeansLabel,
  },
];

export type MediaGroupState = {
  mode: MediaGroupMode;
  groupBy?: string;
};

export const DEFAULT_MEDIA_GROUP_STATE: MediaGroupState = {
  mode: 'default',
  groupBy: undefined,
};

const RADIO_DEFAULT = '__default__';
const RADIO_RANDOM = '__random__';
const RADIO_YEAR_DESC = '__yearDesc__';
const RADIO_YEAR_ASC = '__yearAsc__';

type Props = {
  state: MediaGroupState;
  onChange: (state: MediaGroupState) => void;
};

export function MediaGroupDropdown({ state, onChange }: Props) {
  const radioValue =
    state.mode === 'random'
      ? RADIO_RANDOM
      : state.mode === 'yearDesc'
        ? RADIO_YEAR_DESC
        : state.mode === 'yearAsc'
          ? RADIO_YEAR_ASC
          : state.mode === 'group' && state.groupBy
            ? state.groupBy
            : RADIO_DEFAULT;

  const handleRadioChange = (value: string) => {
    if (value === RADIO_DEFAULT) onChange({ mode: 'default', groupBy: undefined });
    else if (value === RADIO_RANDOM) onChange({ mode: 'random', groupBy: undefined });
    else if (value === RADIO_YEAR_DESC) onChange({ mode: 'yearDesc', groupBy: undefined });
    else if (value === RADIO_YEAR_ASC) onChange({ mode: 'yearAsc', groupBy: undefined });
    else onChange({ mode: 'group', groupBy: value });
  };

  const isActive = state.mode !== 'default';

  return (
    <DropdownMenu>
      <SimpleTooltip i18nKey="search.group.groupBy" asChild side="left">
        <DropdownMenuTrigger
          className={cn(
            'g-relative g-inline-flex g-items-center g-px-1 g-py-0.5 g-rounded hover:g-text-primary-500',
            isActive ? 'g-text-slate-600' : 'g-text-slate-400'
          )}
          aria-label="Group"
        >
          <SortIcon active={isActive} />
        </DropdownMenuTrigger>
      </SimpleTooltip>
      {/* Portal directly to <body> so the menu isn't accidentally captured by the
          occurrence preview drawer's `.drawer-popover-container` (the gallery's
          dropdown lives outside the drawer). */}
      <DropdownMenuPrimitive.Portal>
        <div className="gbif">
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={4}
            className="g-z-50 g-min-w-[8rem] g-overflow-hidden g-rounded-md g-border g-border-solid g-bg-popover g-p-1 text-popover-foreground g-shadow-md g-bg-white g-shadow-blocker g-border-slate-200 g-max-h-[70vh] g-overflow-y-auto"
            style={{ zIndex: 100 }}
          >
            <DropdownMenuRadioGroup value={radioValue} onValueChange={handleRadioChange}>
              <DropdownMenuLabel>
                <FormattedMessage id="search.sort.sortBy" />
              </DropdownMenuLabel>
              <DropdownMenuRadioItem value={RADIO_DEFAULT}>
                <FormattedMessage id="search.group.default" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={RADIO_RANDOM}>
                <FormattedMessage id="search.group.random" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={RADIO_YEAR_DESC}>
                <FormattedMessage id="search.sort.yearDesc" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={RADIO_YEAR_ASC}>
                <FormattedMessage id="search.sort.yearAsc" />
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                <FormattedMessage id="search.group.groupBy" />
              </DropdownMenuLabel>
              {GROUP_FIELDS.map((field) => (
                <DropdownMenuRadioItem key={field.id} value={field.id}>
                  <FormattedMessage id={field.labelId} />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuPrimitive.Content>
        </div>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenu>
  );
}

function SortIcon({ active }: { active: boolean }) {
  // Reuse the table header sort icon: overlapped up/down chevrons.
  return (
    <span className="g-relative g-inline-block g-w-3 g-h-4">
      <SortAscIcon
        className={cn('g-absolute g-left-0 g-top-0', {
          'g-text-current': active,
          'g-text-slate-300': !active,
        })}
      />
      <SortDescIcon
        className={cn('g-absolute g-left-0 g-bottom-0', {
          'g-text-current': active,
          'g-text-slate-300': !active,
        })}
      />
    </span>
  );
}
