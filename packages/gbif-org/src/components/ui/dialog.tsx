import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'g-fixed g-inset-0 g-z-50 g-bg-black/80 data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    hideCloseButton?: boolean;
    animation?: 'default' | 'bottom-slide';
  }
>(({ className, children, hideCloseButton = false, animation = 'default', ...props }, ref) => {
  const layoutClasses =
    animation === 'bottom-slide'
      ? 'g-bottom-0 g-left-0 g-right-0 g-top-auto g-border-t'
      : 'g-left-[50%] g-top-[50%] g-grid g-max-w-lg g-translate-x-[-50%] g-translate-y-[-50%] g-gap-4 g-p-6 sm:g-rounded-lg';

  const animationClasses =
    animation === 'bottom-slide'
      ? 'g-duration-300 data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-slide-out-to-bottom data-[state=open]:g-slide-in-from-bottom'
      : 'g-duration-200 data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-fade-out-0 data-[state=open]:g-fade-in-0 data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-95 data-[state=closed]:g-slide-out-to-left-1/2 data-[state=closed]:g-slide-out-to-top-[48%] data-[state=open]:g-slide-in-from-left-1/2 data-[state=open]:g-slide-in-from-top-[48%]';

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'gbif g-fixed g-z-50 g-w-full g-border g-border-solid g-bg-background g-shadow-lg',
          layoutClasses,
          animationClasses,
          className
        )}
        {...props}
      >
        {children}
        {!hideCloseButton && (
          <DialogPrimitive.Close className="g-absolute g-right-4 g-top-4 g-rounded-sm g-opacity-70 g-ring-offset-background g-transition-opacity hover:g-opacity-100 focus:g-outline-none focus:g-ring-2 focus:g-ring-ring focus:g-ring-offset-2 disabled:g-pointer-events-none data-[state=open]:g-bg-accent data-[state=open]:g-text-muted-foreground">
            <Cross2Icon className="g-h-4 g-w-4" />
            <span className="g-sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('g-flex g-flex-col g-space-y-1.5 g-text-center sm:g-text-left', className)}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'g-flex g-flex-col-reverse sm:g-flex-row sm:g-justify-end sm:g-space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('g-text-lg g-font-semibold g-leading-none g-tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('g-text-sm g-text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
