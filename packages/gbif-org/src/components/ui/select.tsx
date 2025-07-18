import { CaretSortIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as React from 'react';

import { cn } from '@/utils/shadcn';
import { ClientSideOnly } from '../clientSideOnly';

// focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'g-flex g-h-9 g-w-full g-items-center g-justify-between g-whitespace-nowrap g-rounded-md g-border g-border-input g-bg-transparent g-px-3 g-py-2 g-text-sm g-shadow-sm placeholder:g-text-muted-foreground focus:g-outline-none focus:g-ring-1 focus:g-ring-ring disabled:g-cursor-not-allowed disabled:g-opacity-50 [&>span]:g-line-clamp-1',
      'focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-primary-500', //colored focus ring
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="g-h-4 g-w-4 g-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('g-flex g-cursor-default g-items-center g-justify-center g-py-1', className)}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('g-flex g-cursor-default g-items-center g-justify-center g-py-1', className)}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <ClientSideOnly>
    <SelectPrimitive.Portal>
      <div className="gbif">
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            'g-relative g-z-50 g-max-h-96 g-min-w-[8rem] g-overflow-hidden g-rounded-md g-border g-bg-popover g-text-popover-foreground g-shadow-md data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0 data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-95 data-[side=bottom]:g-slide-in-from-top-2 data-[side=left]:g-slide-in-from-right-2 data-[side=right]:g-slide-in-from-left-2 data-[side=top]:g-slide-in-from-bottom-2',
            position === 'popper' &&
              'data-[side=bottom]:g-translate-y-1 data-[side=left]:g--translate-x-1 data-[side=right]:g-translate-x-1 data-[side=top]:g--translate-y-1',
            className
          )}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              'g-p-1',
              position === 'popper' &&
                'g-h-[var(--radix-select-trigger-height)] g-w-full g-min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </div>
    </SelectPrimitive.Portal>
  </ClientSideOnly>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('g-px-2 g-py-1.5 g-text-sm g-font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "g-relative g-flex g-w-full g-cursor-default g-select-none g-items-center g-rounded-sm g-py-1.5 g-pl-2 g-pr-8 g-text-sm g-outline-none focus:g-bg-accent focus:g-text-accent-foreground data-[disabled='true']:g-pointer-events-none data-[disabled='true']:g-opacity-50",
      className
    )}
    {...props}
  >
    <span className="g-absolute g-right-2 g-flex g-h-3.5 g-w-3.5 g-items-center g-justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="g-h-4 g-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('g--mx-1 g-my-1 g-h-px g-bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
