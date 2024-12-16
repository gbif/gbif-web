import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/shadcn';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'g-fixed g-inset-0 g-z-50 g-bg-black/50 data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'g-fixed g-z-50 g-gap-4 g-bg-background g-p-6 g-shadow-lg g-transition g-ease-in-out data-[state=closed]:g-duration-300 data-[state=open]:g-duration-500 data-[state=open]:g-animate-in data-[state=closed]:g-animate-out',
  {
    variants: {
      side: {
        top: 'g-inset-x-0 g-top-0 g-border-b data-[state=closed]:g-slide-out-to-top data-[state=open]:g-slide-in-from-top',
        bottom:
          'g-inset-x-0 g-bottom-0 g-border-t data-[state=closed]:g-slide-out-to-bottom data-[state=open]:g-slide-in-from-bottom',
        left: 'g-inset-y-0 g-left-0 g-h-full g-w-4/5 g-border-r data-[state=closed]:g-slide-out-to-left data-[state=open]:g-slide-in-from-left sm:g-max-w-sm',
        right:
          'g-inset-y-0 g-right-0 g-h-full g-w-4/5 g-border-l data-[state=closed]:g-slide-out-to-right data-[state=open]:g-slide-in-from-right sm:g-max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <div className="gbif">
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        <SheetPrimitive.Close className="g-absolute g-right-4 g-top-4 g-rounded-sm g-opacity-70 g-ring-offset-background g-transition-opacity hover:g-opacity-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-ring focus:g-ring-offset-2 disabled:g-pointer-events-none data-[state=open]:g-bg-secondary">
          <Cross2Icon className="g-h-4 g-w-4" />
          <span className="g-sr-only">Close</span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </div>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('g-flex g-flex-col g-space-y-2 g-text-center sm:g-text-left', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'g-flex g-flex-col-reverse sm:g-flex-row sm:g-justify-end sm:g-space-x-2',
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('g-text-lg g-font-semibold g-text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('g-text-sm g-text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
