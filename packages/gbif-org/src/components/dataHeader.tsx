import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { MdApps, MdCode, MdInfo } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function DataHeader({
  children,
  title,
  aboutContent,
  apiContent,
  hasBorder,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hasBorder?: boolean;
  aboutContent?: React.ReactElement;
  apiContent?: React.ReactElement;
}) {
  return (
    <div
      className={`g-flex g-justify-center g-items-center g-ps-2 g-bg-paperBackground ${
        hasBorder ? 'g-border-b g-border-slate-200' : ''
      }`}
    >
      <>
        <CatalogSelector title={title} />
        {children && <Separator />}
      </>
      <div className="g-flex-auto g-min-w-0">{children}</div>
      <div className="g-flex-none g-mx-2">
        <div className="g-flex g-justify-center g-text-slate-400">
          {aboutContent && (
            <Popup trigger={<MdInfo className="g-mx-1 hover:g-text-slate-700" />}>
              {aboutContent}
            </Popup>
          )}
          {apiContent && (
            <Popup trigger={<MdCode className="g-mx-1 hover:g-text-slate-700" />}>
              {apiContent}
            </Popup>
          )}
        </div>
      </div>
    </div>
  );
}

export function Separator() {
  return <div className="g-border-l g-border-slate-200 g-h-6 g-mx-2"></div>;
}

function Popup({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactElement;
  children: React.ReactElement;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={cn('g-w-96', className)}>{children}</PopoverContent>
    </Popover>
  );
}

function CatalogSelector({ title }: { title: React.ReactNode }) {
  return (
    <div className="g-flex-none g-flex g-items-center g-mx-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="g-flex g-justify-center g-items-center">
            <MdApps />{' '}
            {title && <span className="g-ms-2 g-pt-2 g-pb-1.5 g-hidden lg:g-inline">{title}</span>}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <DynamicLink pageId="occurrenceSearch">
              <FormattedMessage id="catalogues.occurrences" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DynamicLink pageId="datasetSearch">
              <FormattedMessage id="catalogues.datasets" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DynamicLink pageId="publisherSearch">
              <FormattedMessage id="catalogues.publishers" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DynamicLink pageId="speciesSearch">
              <FormattedMessage id="catalogues.species" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DynamicLink pageId="institutionSearch">
              <FormattedMessage id="catalogues.institutions" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <DynamicLink pageId="collectionSearch">
              <FormattedMessage id="catalogues.collections" />
            </DynamicLink>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <DynamicLink pageId="literatureSearch">
              <FormattedMessage id="catalogues.literature" />
            </DynamicLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
