import { Cross2Icon } from '@radix-ui/react-icons';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'g-fixed g-top-0 g-z-[100] g-flex g-max-h-screen g-w-full g-flex-col-reverse g-p-4 sm:g-bottom-0 sm:g-right-0 sm:g-top-auto sm:g-flex-col md:g-max-w-[420px]',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'g-group g-pointer-events-auto g-relative g-flex g-w-full g-items-center g-justify-between g-space-x-2 g-overflow-hidden g-rounded-md g-border g-border-solid g-p-4 g-pr-6 g-shadow-lg g-transition-all data-[swipe=cancel]:g-translate-x-0 data-[swipe=end]:g-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:g-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:g-transition-none data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[swipe=end]:g-animate-out data-[state=closed]:g-fade-out-80 data-[state=closed]:g-slide-out-to-right-full data-[state=open]:g-slide-in-from-top-full data-[state=open]:sm:g-slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'g-border g-border-solid g-bg-primary-500 g-text-primaryContrast-500',
        destructive:
          'destructive g-group g-border-destructive g-bg-destructive g-text-destructive-foreground',
        warning: 'destructive g-group g-border-amber-600 g-bg-amber-500 g-text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'g-inline-flex g-h-8 g-shrink-0 g-items-center g-justify-center g-rounded-md g-border g-border-solid g-bg-transparent g-px-3 g-text-sm g-font-medium g-transition-colors hover:g-bg-secondary focus:g-outline-none focus:g-ring-1 focus:g-ring-ring disabled:g-pointer-events-none disabled:g-opacity-50 group-[.destructive]:g-border-muted/40 group-[.destructive]:g-hover group-[.destructive]:hover:g-bg-destructive group-[.destructive]:g-hover group-[.destructive]:focus:g-ring-destructive',
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'g-absolute g-right-1 g-top-1 g-rounded-md g-p-1 g-text-foreground/50 g-opacity-0 g-transition-opacity hover:g-text-foreground focus:g-opacity-100 focus:g-outline-none focus:g-ring-1 group-hover:g-opacity-100 group-[.destructive]:g-text-red-300 group-[.destructive]:g-hover group-[.destructive]:focus:g-ring-red-400 group-[.destructive]:focus:g-ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  >
    <Cross2Icon className="g-h-4 g-w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('g-text-sm g-font-semibold [&+div]:g-text-xs', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('g-text-sm g-opacity-90', className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastActionElement,
  type ToastProps,
};
