import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicLink, useDynamicNavigate } from '@/reactRouterPlugins';
import { MdSearch } from 'react-icons/md';
import { SearchInput } from '@/components/searchInput';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/smallCard';

export function SearchTrigger() {
  const intl = useIntl();
  const dynamicNavigate = useDynamicNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {/* Mobile: direct link to omni search (visible <sm) */}
      <div className="sm:g-hidden">
        <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5">
          <DynamicLink pageId="omniSearch" className="g-opacity-80">
            <MdSearch />
          </DynamicLink>
        </Button>
      </div>
      {/* Desktop: popover with search field (hidden <sm) */}
      <div className="g-hidden sm:g-inline-block">
        <Popover>
          <PopoverTrigger>
            <Button variant="ghost" asChild className="g-text-xl g-px-2 g-mx-0.5">
              <span className="g-opacity-80">
                <MdSearch />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="g-w-[24rem] g-p-0">
            <Card>
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="search.crossContentSearch.title" />
                </CardTitle>
                <CardDescription>
                  <FormattedMessage id="search.crossContentSearch.description" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    dynamicNavigate({
                      pageId: 'omniSearch',
                      searchParams: { q: inputRef.current?.value || '' },
                    });
                  }}
                  className="g-flex g-items-center g-w-full g-rounded-md focus-within:g-outline g-outline-2 g-outline-primary/70 -g-outline-offset-2"
                >
                  <SearchInput
                    ref={inputRef}
                    type="search"
                    placeholder={intl.formatMessage({
                      id: 'search.crossContentSearch.placeholder',
                    })}
                    className="g-w-full g-border g-rounded-md"
                    inputClassName="remove-search-clear-icon"
                  />
                </form>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default SearchTrigger;
