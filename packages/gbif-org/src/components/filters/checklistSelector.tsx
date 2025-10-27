import { DatasetLabel } from '@/components/filters/displayNames';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { FilterContext } from '@/contexts/filter';
import { useConfig } from '@/config/config';
import React, { useContext } from 'react';
import { MdInfo } from 'react-icons/md';
import { PiGitBranchBold as TaxonomyIcon } from 'react-icons/pi';
import { FormattedMessage } from 'react-intl';

export function ChecklistSelector(): React.ReactElement | null {
  const currentFilterContext = useContext(FilterContext);
  const siteConfig = useConfig();
  const availableChecklistKeys = siteConfig.availableChecklistKeys ?? [];

  // Don't render if there's only one or no checklist keys
  if (availableChecklistKeys.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant={
            currentFilterContext.filter.checklistKey !== siteConfig.defaultChecklistKey
              ? 'default'
              : 'ghost'
          }
          className="g-px-1 g-mb-1 g-text-slate-400"
        >
          <TaxonomyIcon className="g-text-base" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <FormattedMessage
            id="phrases.supportedChecklists"
            defaultMessage="Supported checklists"
          />
          <a
            href={`https://techdocs.gbif.org/en/data-processing/#taxonomy-interpretation`}
            className="g-ms-2"
          >
            <MdInfo />
          </a>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentFilterContext.filter.checklistKey ?? siteConfig.defaultChecklistKey}
          onValueChange={(value) => currentFilterContext.setChecklistKey(value)}
        >
          {availableChecklistKeys.map((key) => (
            <DropdownMenuRadioItem key={key} value={key} className="g-text-sm g-text-slate-700">
              <DatasetLabel id={key} />
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
