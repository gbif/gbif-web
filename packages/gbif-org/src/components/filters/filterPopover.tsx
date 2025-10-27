import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FilterContext, FilterProvider, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useUncontrolledProp } from 'uncontrollable';
import { ErrorBoundary } from '../ErrorBoundary';
import { Dialog, DialogBottomSheetContent, DialogTrigger } from '../ui/dialog';
import useBelow from '@/hooks/useBelow';

export function FilterPopover({
  open,
  setOpen,
  children,
  trigger,
  title,
  className,
}: {
  open?: boolean;
  setOpen?: (b: boolean) => void;
  children: React.ReactElement<
    {
      onApply?: ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType }) => void;
      onCancel: () => void;
      pristine: boolean;
    } & React.RefAttributes<HTMLDivElement>
  >;
  trigger: React.ReactNode;
  title?: React.ReactNode;
  className?: string;
}) {
  const [controlledOpen, setControlledOpen] = useUncontrolledProp(open, false, setOpen);
  const focusRef = useRef<HTMLDivElement>(null);
  const currentFilterContext = useContext(FilterContext);
  const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
  const [pristine, setPristine] = useState(true);
  const child = React.Children.only(children);

  useEffect(() => {
    setFilter(currentFilterContext.filter);
    setPristine(true);
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash]);

  const onApply = useCallback(
    ({ keepOpen, filter }: { keepOpen?: boolean; filter?: FilterType } = {}) => {
      currentFilterContext.setFilter(filter ?? tmpFilter);
      if (!keepOpen) {
        setControlledOpen(false);
      }
      setPristine(true);
    },
    [tmpFilter, currentFilterContext, setControlledOpen]
  );

  const onCancel = useCallback(() => {
    setFilter(currentFilterContext.filter);
    setControlledOpen(false);
    setPristine(true);
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, setControlledOpen]);

  const onFilterChange = useCallback((filter: FilterType) => {
    setFilter(filter);
    setPristine(false);
  }, []);

  const isMobile = useBelow(640); // Tailwind's sm breakpoint

  // Use a dialog instead of a popover on mobile
  if (isMobile) {
    return (
      <Dialog open={controlledOpen} onOpenChange={setControlledOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogBottomSheetContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onEscapeKeyDown={onCancel}
          onPointerDownOutside={() => onApply({ keepOpen: false })}
          className="g-w-full g-p-0"
        >
          <div className="g-flex g-flex-col g-h-full g-bg-white">
            <ErrorBoundary type="BLOCK">
              <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
                {React.isValidElement(child) && (
                  <>
                    {title}
                    <form onSubmit={(e) => e.preventDefault()}>
                      {React.cloneElement(child, {
                        onApply,
                        onCancel,
                        pristine,
                        ref: focusRef,
                      })}
                    </form>
                  </>
                )}
              </FilterProvider>
            </ErrorBoundary>
          </div>
        </DialogBottomSheetContent>
      </Dialog>
    );
  }

  return (
    <Popover open={controlledOpen} onOpenChange={setControlledOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        onPointerDownOutside={() => onApply({ keepOpen: false })}
        onOpenAutoFocus={(event) => {
          if (focusRef?.current) {
            event.preventDefault();
            focusRef?.current?.focus();
          }
        }}
        onEscapeKeyDown={onCancel}
        align="start"
        className={cn(
          'g-w-96 g-flex g-flex-col g-p-0 g-max-w-[var(--radix-popper-available-width)] g-shadow-[0_10px_600px_-12px_rgba(0,0,0,0.2)]',
          className
        )}
      >
        <ErrorBoundary type="BLOCK">
          <FilterProvider filter={tmpFilter} onChange={onFilterChange}>
            {React.isValidElement(child) && (
              <>
                {title}
                <form onSubmit={(e) => e.preventDefault()}>
                  {React.cloneElement(child, {
                    onApply,
                    onCancel,
                    pristine,
                    ref: focusRef,
                  })}
                </form>
              </>
            )}
          </FilterProvider>
        </ErrorBoundary>
      </PopoverContent>
    </Popover>
  );
}
