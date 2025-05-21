import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/shadcn';

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      'g-relative g-z-10 g-flex g-max-w-max g-flex-1 g-items-center g-justify-center',
      className
    )}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      'g-group g-flex g-flex-1 g-list-none g-items-center g-justify-center g-space-x-1',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
  'g-group g-inline-flex g-h-9 g-w-max g-items-center g-justify-center g-rounded-md g-px-4 g-py-2 g-text-sm g-font-medium g-transition-colors hover:g-bg-accent hover:g-text-accent-foreground focus:g-bg-accent focus:g-text-accent-foreground focus:g-outline-none disabled:g-pointer-events-none disabled:g-opacity-50 data-[active]:g-bg-accent/50 data-[state=open]:g-bg-accent/50'
);

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
    onPointerEnter={(event) => event.preventDefault()}
    onPointerLeave={(event) => event.preventDefault()}
    onPointerMove={(event) => event.preventDefault()}
  >
    {children}{' '}
    <ChevronDownIcon
      className="g-relative g-top-[1px] g-ml-1 g-h-3 g-w-3 g-transition g-duration-300 group-data-[state=open]:g-rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'g-left-0 g-top-0 g-w-full data-[motion^=from-]:g-animate-in data-[motion^=to-]:g-animate-out data-[motion^=from-]:g-fade-in data-[motion^=to-]:g-fade-out data-[motion=from-end]:g-slide-in-from-right-52 data-[motion=from-start]:g-slide-in-from-left-52 data-[motion=to-end]:g-slide-out-to-right-52 data-[motion=to-start]:g-slide-out-to-left-52 md:g-absolute md:g-w-auto ',
      className
    )}
    {...props}
    onPointerLeave={(event) => event.preventDefault()}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('g-absolute g-left-0 g-top-full g-flex g-justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'g-origin-top-center g-relative g-mt-1.5 g-h-[var(--radix-navigation-menu-viewport-height)] g-w-full g-overflow-hidden g-rounded-md g-border g-border-solid g-bg-popover g-text-popover-foreground g-shadow data-[state=open]:g-animate-in data-[state=closed]:g-animate-out data-[state=closed]:g-zoom-out-95 data-[state=open]:g-zoom-in-90 md:g-w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      'g-top-full g-z-[1] g-flex g-h-1.5 g-items-end g-justify-center g-overflow-hidden data-[state=visible]:g-animate-in data-[state=hidden]:g-animate-out data-[state=hidden]:g-fade-out data-[state=visible]:g-fade-in',
      className
    )}
    {...props}
  >
    <div className="g-relative g-top-[60%] g-h-2 g-w-2 g-rotate-45 g-rounded-tl-sm g-bg-border g-border-solid g-shadow-md" />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName = NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};
