import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { useI18n } from '@/reactRouterPlugins';
import { MdSort } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { ResourceSortValue } from './useResourceSort';

type Props = {
  sort: ResourceSortValue;
  onChange: (sort: ResourceSortValue) => void;
  hasQuery: boolean;
};

export function ResourceSortDropdown({ sort, onChange, hasQuery }: Props) {
  const { locale } = useI18n();

  return (
    <DropdownMenu dir={locale.textDirection ?? 'ltr'}>
      <DropdownMenuTrigger
        className="g-text-sm g-inline-flex g-items-center g-cursor-pointer hover:g-underline g-text-inherit"
        aria-label="Sort"
      >
        <MdSort size={16} />
        <span className="g-ms-1">
          <FormattedMessage id="search.sort.sortBy" defaultMessage="Sort by" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <FormattedMessage id="search.sort.sortBy" defaultMessage="Sort by" />
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={(value) => onChange(value as ResourceSortValue)}
        >
          {hasQuery && (
            <DropdownMenuRadioItem value="relevance">
              <FormattedMessage id="resourceSearch.sort.relevance" defaultMessage="Relevance" />
            </DropdownMenuRadioItem>
          )}
          <DropdownMenuRadioItem value="createdAt_desc">
            <FormattedMessage id="resourceSearch.sort.newestFirst" defaultMessage="Newest first" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="createdAt_asc">
            <FormattedMessage id="resourceSearch.sort.oldestFirst" defaultMessage="Oldest first" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
