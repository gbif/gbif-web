import { type DialogProps } from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/utils/shadcn';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'gbif g-flex g-h-full g-w-full g-flex-col g-overflow-hidden g-rounded-md g-bg-popover g-text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="gbif g-overflow-hidden g-p-0">
        <Command className="[&_[cmdk-group-heading]]:g-px-2 [&_[cmdk-group-heading]]:g-font-medium [&_[cmdk-group-heading]]:g-text-muted-foreground [&_[cmdk-group]:g-not([hidden])_~[cmdk-group]] [&_[cmdk-group]]:g-px-2 [&_[cmdk-input-wrapper]_svg]:g-h-5 [&_[cmdk-input-wrapper]_svg]:g-w-5 [&_[cmdk-input]]:g-h-12 [&_[cmdk-item]]:g-px-2 [&_[cmdk-item]]:g-py-3 [&_[cmdk-item]_svg]:g-h-5 [&_[cmdk-item]_svg]:g-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="g-flex g-items-center g-border-b g-px-3" cmdk-input-wrapper="g-">
    <MagnifyingGlassIcon className="g-mr-2 g-h-4 g-w-4 g-shrink-0 g-opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'g-flex g-h-10 g-w-full g-rounded-md g-bg-transparent g-py-3 g-text-base sm:g-text-sm g-outline-none placeholder:g-text-muted-foreground disabled:g-cursor-not-allowed disabled:g-opacity-50',
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('g-max-h-[300px] g-overflow-y-auto g-overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty ref={ref} className="g-py-6 g-text-center g-text-sm" {...props} />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'g-overflow-hidden g-p-1 g-text-foreground [&_[cmdk-group-heading]]:g-px-2 [&_[cmdk-group-heading]]:g-py-1.5 [&_[cmdk-group-heading]]:g-text-xs [&_[cmdk-group-heading]]:g-font-medium [&_[cmdk-group-heading]]:g-text-muted-foreground',
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('g--mx-1 g-h-px g-bg-border', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "g-relative g-flex g-cursor-default g-select-none g-items-center g-rounded-sm g-px-2 g-py-1.5 g-text-sm g-outline-none aria-selected:g-bg-accent aria-selected:g-text-accent-foreground data-[disabled='true']:g-pointer-events-none data-[disabled='true']:g-opacity-50",
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('g-ml-auto g-text-xs g-tracking-widest g-text-muted-foreground', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
