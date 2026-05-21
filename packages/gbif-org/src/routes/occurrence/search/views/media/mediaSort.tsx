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
import { FormattedMessage } from 'react-intl';
import { MdSettings } from 'react-icons/md';
import { GROUP_FIELDS, MediaGroupState, RANK_TO_GROUP_FIELD } from './mediaGroupConfig';
import { useI18n } from '@/reactRouterPlugins';

const RADIO_DEFAULT = '__default__';
const RADIO_RANDOM = '__random__';
const RADIO_YEAR_DESC = '__yearDesc__';
const RADIO_YEAR_ASC = '__yearAsc__';

type Props = {
  state: MediaGroupState;
  onChange: (state: MediaGroupState) => void;
  /** When provided, replaces all static rank group-by options with a single
   *  suggestion for this rank (e.g. 'SPECIES' when the current filter is a genus). */
  suggestedGroupByRank?: string | null;
};

export function MediaGroupDropdown({ state, onChange, suggestedGroupByRank }: Props) {
  const { locale } = useI18n();
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

  const activeLabelId =
    state.mode === 'random'
      ? 'search.group.random'
      : state.mode === 'yearDesc'
        ? 'search.sort.yearDesc'
        : state.mode === 'yearAsc'
          ? 'search.sort.yearAsc'
          : state.mode === 'group' && state.groupBy
            ? GROUP_FIELDS.find((f) => f.id === state.groupBy)?.labelId
            : undefined;

  return (
    <DropdownMenu dir={locale.textDirection ?? 'ltr'}>
      <DropdownMenuTrigger
        className={cn(
          'g-relative g-inline-flex g-items-center g-px-1 g-py-0.5 g-rounded g-text-slate-600'
        )}
        aria-label="Group"
      >
        {isActive && activeLabelId && (
          <span className="g-text-xs g-me-1">
            <FormattedMessage id={activeLabelId} />
          </span>
        )}
        <span className="g-relative g-inline-block g-w-3 g-h-4">
          <MdSettings className="g-absolute g-start-0 g-top-0 g-text-current" />
        </span>
      </DropdownMenuTrigger>
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
                <DropdownMenuRadioItem
                  key={field.id}
                  value={field.id}
                  className={
                    suggestedGroupByRank && RANK_TO_GROUP_FIELD[suggestedGroupByRank] === field.id
                      ? 'g-font-semibold'
                      : undefined
                  }
                >
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
