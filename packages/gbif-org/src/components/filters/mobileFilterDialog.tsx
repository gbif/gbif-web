import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { FilterContext } from '@/contexts/filter';
import { SearchMetadata } from '@/contexts/search';
import { cn } from '@/utils/shadcn';
import { useContext, useMemo } from 'react';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { FilterSetting, getFilterSummary } from './filterTools';
import { MobileFilterDrawerContent } from './mobileFilterDrawer';
import { FormattedNumber } from 'react-intl';

type Filters = Record<string, FilterSetting>;

interface MobileFilterDialogProps {
  filters: Filters;
  groups?: string[];
  searchContext?: SearchMetadata;
  className?: string;
}

export function MobileFilterDialog({
  filters,
  groups,
  searchContext,
  className,
}: MobileFilterDialogProps) {
  const filterContext = useContext(FilterContext);

  const activeFilterCount = useMemo(() => {
    if (!filterContext) return 0;

    // Count all active filters
    const allFilterHandles = Object.keys(filters);
    return allFilterHandles.reduce((count, handle) => {
      const summary = getFilterSummary(filterContext.filter, handle);
      return count + summary.defaultCount;
    }, 0);
  }, [filterContext, filters]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn('g-relative g-px-1 g-mb-1 g-text-slate-400', className)}
        >
          <FilterIcon className="g-text-base" />
          {activeFilterCount > 0 && (
            <span className="g-absolute -g-top-1 -g-right-1 g-bg-primary-500 g-text-white g-text-xs g-rounded-full g-size-5 g-flex g-items-center g-justify-center g-font-medium">
              <FormattedNumber value={activeFilterCount} />
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent animation="bottom-slide" hideCloseButton className="g-h-[80vh] g-w-full g-p-0">
        <MobileFilterDrawerContent
          filters={filters}
          groups={groups}
          searchContext={searchContext}
        />
      </DialogContent>
    </Dialog>
  );
}
