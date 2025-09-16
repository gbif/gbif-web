import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useConfig } from '@/config/config';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import React, { useMemo } from 'react';
import { MdApps, MdCode, MdInfo, MdOutlineFeedback } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { DoiTag } from './identifierTag';
import { Button } from './ui/button';
import { FeedbackPopover } from '@/gbif/header/feedback/feedback';

export function DataHeader({
  children,
  title,
  aboutContent,
  apiContent,
  doi,
  hasBorder,
  hideCatalogueSelector,
  className,
  /**If there are no catalogues, then there is only about and api info available. And that looks odd. In those cases we will just hide it. Notice that this is only relevant for hosted portals */
  hideIfNoCatalogue,
}: {
  children?: React.ReactNode;
  title?: React.ReactNode;
  hasBorder?: boolean;
  aboutContent?: React.ReactElement;
  apiContent?: React.ReactElement;
  hideCatalogueSelector?: boolean;
  doi?: string | null;
  className?: string;
  hideIfNoCatalogue?: boolean;
}) {
  const { availableCatalogues = [], dataHeader, feedback = {} } = useConfig();
  const { showFeedbackInDataHeader = false, enabled = false } = feedback;

  if (hideIfNoCatalogue && (availableCatalogues.length < 2 || hideCatalogueSelector)) return null;

  return (
    <div
      style={{ fontSize: '0.9375rem' }}
      className={cn(
        `g-flex g-justify-center g-items-center g-px-2 g-h-12`,
        hasBorder ? 'g-border-b g-border-solid g-border-slate-200' : '',
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
        <div className="g-flex g-justify-center g-items-center g-gap-1">
          {doi && <DoiTag id={doi} className="g-me-2 g-text-xs g-hidden md:g-inline" />}
          {enabled && showFeedbackInDataHeader && (
            <FeedbackPopover
              trigger={
                <Button variant="ghost" size="sm" className="g-px-1 g-text-slate-400">
                  <MdOutlineFeedback className="hover:g-text-slate-700 g-text-slate-400 g-block g-text-base g-relative g-top-[1px]" />
                </Button>
              }
            />
          )}
          {aboutContent && dataHeader.enableInfoPopup && (
            <Popup
              trigger={
                <MdInfo className="hover:g-text-slate-700 g-text-slate-400 g-block g-text-base" />
              }
            >
              {aboutContent}
            </Popup>
          )}
          {apiContent && dataHeader.enableApiPopup && (
            <Popup
              trigger={
                <MdCode className="hover:g-text-slate-700 g-text-slate-400 g-block g-text-base" />
              }
            >
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
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="g-px-1 g-text-slate-400">
          {trigger}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('g-w-96', className)}>{children}</PopoverContent>
    </Popover>
  );
}

const availableCatalogueOptions = [
  'OCCURRENCE',
  'PUBLISHER',
  'DATASET',
  'TAXON',
  'RESOURCE',
  'LITERATURE',
  'COLLECTION',
  'INSTITUTION',
] as const;

type CatalogueOption = (typeof availableCatalogueOptions)[number];

function CatalogSelector({
  title,
  availableCatalogues,
}: {
  title: React.ReactNode;
  availableCatalogues: string[];
}) {
  const options = useMemo(() => {
    const optionKeys = availableCatalogues.filter((o): o is CatalogueOption =>
      (availableCatalogueOptions as readonly string[]).includes(o)
    );

    const lookUp: Record<CatalogueOption, { pageId: string; label: string }> = {
      OCCURRENCE: { pageId: 'occurrenceSearch', label: 'catalogues.occurrences' },
      PUBLISHER: { pageId: 'publisherSearch', label: 'catalogues.publishers' },
      DATASET: { pageId: 'datasetSearch', label: 'catalogues.datasets' },
      TAXON: { pageId: 'speciesSearch', label: 'catalogues.species' },
      INSTITUTION: { pageId: 'institutionSearch', label: 'catalogues.institutions' },
      COLLECTION: { pageId: 'collectionSearch', label: 'catalogues.collections' },
      LITERATURE: { pageId: 'literatureSearch', label: 'catalogues.literature' },
      RESOURCE: { pageId: 'resourceSearch', label: 'catalogues.resources' },
    };
    return optionKeys.map((k) => ({ key: k, item: lookUp[k] }));
  }, [availableCatalogues]);

  if (options.length < 2) return null;

  return (
    <div className="g-flex-none g-flex g-items-center">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="g-flex g-justify-center g-items-center g-px-2 g-pt-2.5 g-pb-2.5">
            <MdApps /> {title && <span className="g-ms-2 g-hidden md:g-block">{title}</span>}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((x) => (
            <MenuItem pageId={x.item.pageId} key={x.key}>
              <FormattedMessage id={x.item.label} />
            </MenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function MenuItem({ pageId, children }: { pageId: string; children: React.ReactNode }) {
  return (
    <DropdownMenuItem className="g-p-0">
      <DynamicLink className="g-text-inherit g-px-2 g-py-1.5" pageId={pageId}>
        {children}
      </DynamicLink>
    </DropdownMenuItem>
  );
}
