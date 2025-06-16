import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { CheckIcon, ChevronRightIcon, DotFilledIcon } from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'g-flex g-cursor-default g-select-none g-items-center g-rounded-sm g-px-2 g-py-1.5 g-text-sm g-outline-none focus:g-bg-accent data-[state=open]:g-bg-accent',
      inset && 'g-pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="g-ml-auto g-h-4 g-w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'g-z-50 g-min-w-[8rem] g-overflow-hidden g-rounded-md g-border g-border-solid g-bg-popover g-p-1 text-popover-foreground g-shadow-lg data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0 data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-95 data-[side=bottom]:g-slide-in-from-top-2 data-[side=left]:g-slide-in-from-right-2 data-[side=right]:g-slide-in-from-left-2 data-[side=top]:g-slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <div className="gbif">
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'g-z-50 g-min-w-[8rem] g-overflow-hidden g-rounded-md g-border g-border-solid g-bg-popover g-p-1 text-popover-foreground g-shadow-md',
          'data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0 data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-95 data-[side=bottom]:g-slide-in-from-top-2 data-[side=left]:g-slide-in-from-right-2 data-[side=right]:g-slide-in-from-left-2 data-[side=top]:g-slide-in-from-bottom-2',
          className
        )}
        {...props}
      />
    </div>
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'g-relative g-flex g-cursor-default g-select-none g-items-center g-rounded-sm g-px-2 g-py-1.5 g-text-sm g-outline-none g-transition-colors focus:g-bg-accent focus:g-text-accent-foreground data-[disabled]:g-pointer-events-none data-[disabled]:g-opacity-50',
      inset && 'g-pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'g-relative g-flex g-cursor-default g-select-none g-items-center g-rounded-sm g-py-1.5 g-pl-8 g-pr-2 g-text-sm g-outline-none g-transition-colors focus:g-bg-accent focus:g-text-accent-foreground data-[disabled]:g-pointer-events-none data-[disabled]:g-opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="g-absolute g-left-2 g-flex g-h-3.5 g-w-3.5 g-items-center g-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="g-h-4 g-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'g-relative g-flex g-cursor-default g-select-none g-items-start g-rounded-sm g-py-1.5 g-pl-8 g-pr-2 g-text-sm g-outline-none g-transition-colors focus:g-bg-accent focus:g-text-accent-foreground data-[disabled]:g-pointer-events-none data-[disabled]:g-opacity-50',
      className
    )}
    {...props}
  >
    <span className="g-absolute g-left-2 g-flex g-h-3.5 g-w-3.5 g-items-center g-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="g-h-4 g-w-4 g-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('g-px-2 g-py-1.5 g-text-sm g-font-semibold', inset && 'g-pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-g-mx-1 g-my-1 g-h-px g-bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('g-ml-auto g-text-xs g-tracking-widest g-opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
