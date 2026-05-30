import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDynamicNavigate } from '@/reactRouterPlugins';
import { MdSearch } from 'react-icons/md';
import { SearchInput } from '@/components/searchInput';
import { FormattedMessage, useIntl } from 'react-intl';
import { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/smallCard';
import { Setter } from '@/types';

export function SearchTrigger() {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const searchLabel = intl.formatMessage({
    id: 'header.search',
    defaultMessage: 'Search',
  });

  return (
    <div className="g-hidden sm:g-flex g-items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="g-text-xl g-px-2 g-mx-0.5 g-opacity-80 g-min-h-11 g-min-w-11"
            aria-label={searchLabel}
          >
            <MdSearch aria-hidden="true" />
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
              <Form setOpen={setOpen}></Form>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

type FormProps = {
  setOpen: Setter<boolean>;
};

function Form({ setOpen }: FormProps) {
  const intl = useIntl();
  const dynamicNavigate = useDynamicNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="g-flex g-items-center g-w-full g-rounded-md focus-within:g-outline g-outline-2 g-outline-primary/70 -g-outline-offset-2"
      onSubmit={(e) => {
        e.preventDefault();
        dynamicNavigate({
          pageId: 'omniSearch',
          searchParams: { q: inputRef.current?.value || '' },
        });
        setOpen(false);
      }}
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
  );
}

export default SearchTrigger;
