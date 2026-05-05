import { SimpleTooltip } from '@/components/simpleTooltip';
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { OccurrenceSortBy, SortOrder } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { FaSortUp as SortAscIcon, FaSortDown as SortDescIcon } from 'react-icons/fa6';
import { FormattedMessage } from 'react-intl';

export type MediaSortMode = 'default' | 'random' | 'sort';

export type MediaSortState = {
  mode: MediaSortMode;
  sortBy?: OccurrenceSortBy;
  sortOrder: SortOrder;
};

type SortField = {
  value: OccurrenceSortBy;
  labelId: string;
};

// Mirrors the sortable columns in the occurrence table (see columns.tsx).
const SORT_FIELDS: SortField[] = [
  { value: OccurrenceSortBy.TaxonKey, labelId: 'filters.taxonKey.name' },
  { value: OccurrenceSortBy.Year, labelId: 'filters.year.name' },
  { value: OccurrenceSortBy.EventDate, labelId: 'filters.eventDate.name' },
  { value: OccurrenceSortBy.CountryCode, labelId: 'filters.occurrenceCountry.name' },
  { value: OccurrenceSortBy.BasisOfRecord, labelId: 'filters.basisOfRecord.name' },
  { value: OccurrenceSortBy.DatasetKey, labelId: 'filters.datasetKey.name' },
  { value: OccurrenceSortBy.CatalogNumber, labelId: 'filters.catalogNumber.name' },
  { value: OccurrenceSortBy.RecordedBy, labelId: 'filters.recordedBy.name' },
  { value: OccurrenceSortBy.IdentifiedBy, labelId: 'filters.identifiedBy.name' },
  { value: OccurrenceSortBy.RecordNumber, labelId: 'filters.recordNumber.name' },
  { value: OccurrenceSortBy.Preparations, labelId: 'occurrenceFieldNames.preparations' },
  { value: OccurrenceSortBy.CollectionCode, labelId: 'occurrenceFieldNames.collectionCode' },
  { value: OccurrenceSortBy.OrganismId, labelId: 'occurrenceFieldNames.organismID' },
  { value: OccurrenceSortBy.InstitutionCode, labelId: 'occurrenceFieldNames.institutionCode' },
  { value: OccurrenceSortBy.Locality, labelId: 'occurrenceFieldNames.locality' },
  { value: OccurrenceSortBy.FieldNumber, labelId: 'occurrenceFieldNames.fieldNumber' },
  { value: OccurrenceSortBy.IndividualCount, labelId: 'occurrenceFieldNames.individualCount' },
  { value: OccurrenceSortBy.StateProvince, labelId: 'occurrenceFieldNames.stateProvince' },
  { value: OccurrenceSortBy.EstablishmentMeans, labelId: 'occurrenceFieldNames.establishmentMeans' },
  { value: OccurrenceSortBy.Sex, labelId: 'occurrenceFieldNames.sex' },
  { value: OccurrenceSortBy.LifeStage, labelId: 'occurrenceFieldNames.lifeStage' },
];

const RADIO_DEFAULT = '__default__';
const RADIO_RANDOM = '__random__';

type Props = {
  sortState: MediaSortState;
  onSortChange: (mode: MediaSortMode, sortBy?: OccurrenceSortBy) => void;
  onSortOrderChange: (order: SortOrder) => void;
};

export function MediaSortDropdown({ sortState, onSortChange, onSortOrderChange }: Props) {
  const radioValue =
    sortState.mode === 'random'
      ? RADIO_RANDOM
      : sortState.mode === 'sort' && sortState.sortBy
        ? sortState.sortBy
        : RADIO_DEFAULT;

  const handleRadioChange = (value: string) => {
    if (value === RADIO_DEFAULT) onSortChange('default');
    else if (value === RADIO_RANDOM) onSortChange('random');
    else onSortChange('sort', value as OccurrenceSortBy);
  };

  const isActive = sortState.mode !== 'default';
  const showOrder = sortState.mode === 'sort';

  return (
    <DropdownMenu>
      <SimpleTooltip i18nKey="search.sort.sortBy" asChild side="left">
        <DropdownMenuTrigger
          className={cn(
            'g-relative g-inline-flex g-items-center g-px-1 g-py-0.5 g-rounded hover:g-text-primary-500',
            isActive ? 'g-text-primary-500' : 'g-text-slate-500'
          )}
          aria-label="Sort"
        >
          <SortIcon active={isActive} sortOrder={sortState.sortOrder} />
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
            <DropdownMenuLabel>
              <FormattedMessage id="search.sort.sortBy" />
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup value={radioValue} onValueChange={handleRadioChange}>
              <DropdownMenuRadioItem value={RADIO_DEFAULT}>
                <FormattedMessage id="search.sort.default" />
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={RADIO_RANDOM}>
                <FormattedMessage id="search.sort.random" />
              </DropdownMenuRadioItem>
              <DropdownMenuSeparator />
              {SORT_FIELDS.map((field) => (
                <DropdownMenuRadioItem key={field.value} value={field.value}>
                  <FormattedMessage id={field.labelId} />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            {showOrder && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <FormattedMessage id="search.sort.order" />
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sortState.sortOrder}
                  onValueChange={(v) => onSortOrderChange(v as SortOrder)}
                >
                  <DropdownMenuRadioItem value={SortOrder.Asc}>
                    <FormattedMessage id="search.sort.ascending" />
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={SortOrder.Desc}>
                    <FormattedMessage id="search.sort.descending" />
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </>
            )}
          </DropdownMenuPrimitive.Content>
        </div>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenu>
  );
}

function SortIcon({ active, sortOrder }: { active: boolean; sortOrder: SortOrder }) {
  // Reuse the table header sort icon: overlapped up/down chevrons.
  // When sorting, highlight the matching half; otherwise both stay muted.
  return (
    <span className="g-relative g-inline-block g-w-3 g-h-4">
      <SortAscIcon
        className={cn('g-absolute g-left-0 g-top-0', {
          'g-text-current': active && sortOrder === SortOrder.Asc,
          'g-text-slate-300': !(active && sortOrder === SortOrder.Asc),
        })}
      />
      <SortDescIcon
        className={cn('g-absolute g-left-0 g-bottom-0', {
          'g-text-current': active && sortOrder === SortOrder.Desc,
          'g-text-slate-300': !(active && sortOrder === SortOrder.Desc),
        })}
      />
    </span>
  );
}
