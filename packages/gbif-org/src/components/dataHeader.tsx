import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useConfig } from '@/config/config';
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
  hideCatalogueSelector,
  className,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hasBorder?: boolean;
  aboutContent?: React.ReactElement;
  apiContent?: React.ReactElement;
  hideCatalogueSelector?: boolean;
  className?: string;
}) {
  const { availableCatalogues = [] } = useConfig();

  return (
    <div
      className={cn(
        `g-flex g-justify-center g-items-center g-px-2 g-h-12`,
        hasBorder ? 'g-border-b g-border-slate-200' : '',
        className
      )}
    >
      {!hideCatalogueSelector && availableCatalogues.length > 1 && (
        <>
          <CatalogSelector title={title} availableCatalogues={availableCatalogues} />
          {children && <Separator />}
        </>
      )}
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

function CatalogSelector({
  title,
  availableCatalogues,
}: {
  title: React.ReactNode;
  availableCatalogues: string[];
}) {
  if (availableCatalogues.length < 2) return null;

  const lookup = availableCatalogues.reduce((acc: { [key: string]: boolean }, cur) => {
    acc[cur] = true;
    return acc;
  }, {});

  return (
    <div className="g-flex-none g-flex g-items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="g-flex g-justify-center g-items-center g-px-2 g-pt-2.5 g-pb-2.5">
            <MdApps /> {title && <span className="g-ms-2 g-hidden md:g-block">{title}</span>}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {lookup.OCCURRENCE && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="occurrenceSearch">
                <FormattedMessage id="catalogues.occurrences" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {lookup.DATASET && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="datasetSearch">
                <FormattedMessage id="catalogues.datasets" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {lookup.PUBLISHER && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="publisherSearch">
                <FormattedMessage id="catalogues.publishers" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {lookup.TAXON && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="speciesSearch">
                <FormattedMessage id="catalogues.species" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {(lookup.INSTITUTION || lookup.COLLECTION) && <DropdownMenuSeparator />}
          {lookup.INSTITUTION && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="institutionSearch">
                <FormattedMessage id="catalogues.institutions" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {lookup.COLLECTION && (
            <DropdownMenuItem>
              <DynamicLink className="g-text-inherit" pageId="collectionSearch">
                <FormattedMessage id="catalogues.collections" />
              </DynamicLink>
            </DropdownMenuItem>
          )}
          {lookup.LITERATURE && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <DynamicLink className="g-text-inherit" pageId="literatureSearch">
                  <FormattedMessage id="catalogues.literature" />
                </DynamicLink>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
