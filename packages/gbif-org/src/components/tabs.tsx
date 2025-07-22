import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { DynamicLink, useI18n } from '@/reactRouterPlugins';
import { debounce } from '@/utils/debounce';
import { cn } from '@/utils/shadcn';
import { useEffect, useRef, useState } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import { To } from 'react-router-dom';
import { TabLink } from './tabLink';

type Tab = {
  to: To;
  children: React.ReactNode;
  className?: string;
  testId?: string;
  isActive?: boolean;
  hidden?: boolean;
};

export type Props = {
  className?: string;
  links: Tab[];
  disableAutoDetectActive?: boolean;
};

export function Tabs({ links, className, disableAutoDetectActive = false }: Props) {
  const enabledLinks = links.filter((link) => !link.hidden);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const [visibleTabCount, setVisibleTabCount] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { locale } = useI18n();

  useEffect(() => {
    function updateVisibleTabCount() {
      if (containerRef.current == null) return;
      if (dropdownMenuTriggerRef.current == null) return;

      const containerWidth = containerRef.current.clientWidth;

      // If the total width of the tabs is less than the container width, show all tabs
      const tabs = containerRef.current.querySelectorAll('li');
      const tabsWidth = Array.from(tabs).reduce((acc, tab) => acc + tab.offsetWidth, 0);
      if (tabsWidth < containerWidth) return void setVisibleTabCount(tabs.length);

      // Otherwise show as many tabs as possible taking into account the width of the button
      const buttonWidth = dropdownMenuTriggerRef.current?.offsetWidth ?? 0;

      let visibleCount = 0;
      let accumulatedWidth = buttonWidth;

      while ((accumulatedWidth += tabs[visibleCount].offsetWidth) < containerWidth) visibleCount++;

      setVisibleTabCount(visibleCount);
    }

    // Update the visible tab count on mount
    updateVisibleTabCount();

    // Add a small debounce to avoid unnecessary re-renders when resizing
    const handleResize = debounce(updateVisibleTabCount, 30);

    // Update the visible tab count on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabledLinks, setVisibleTabCount]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'g-relative g-border-b g-border-slate-200 dark:g-border-slate-200/5',
        className
      )}
    >
      <ul className="g-flex g-whitespace-nowrap g-overflow-hidden -g-mb-px">
        {enabledLinks.map(({ to, children, className: cls, isActive }, idx) => {
          const visible = visibleTabCount == null || idx < visibleTabCount;

          return (
            <li key={to2Key(to)} className={cn({ 'g-invisible': !visible }, 'g-pr-1')}>
              <TabLink
                to={to}
                className={cls}
                isActive={isActive}
                autoDetectActive={!disableAutoDetectActive}
              >
                {children}
              </TabLink>
            </li>
          );
        })}
      </ul>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          ref={dropdownMenuTriggerRef}
          className={cn(
            {
              'g-invisible': visibleTabCount == null || visibleTabCount === enabledLinks.length,
              'g-right-0 g-pr-3': locale.textDirection === 'ltr',
              'g-left-0 g-pl-3': locale.textDirection === 'rtl',
            },
            'g-absolute g-top-1/2 -g-translate-y-1/2'
          )}
        >
          <MdMoreHoriz className="g-text-2xl" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {visibleTabCount &&
            enabledLinks.slice(visibleTabCount).map(({ to, children }) => (
              <DropdownMenuItem key={to2Key(to)}>
                <DynamicLink
                  preventScrollReset
                  onClick={() => setIsDropdownOpen(false)}
                  to={to}
                  className="g-w-full g-justify-center"
                >
                  {children}
                </DynamicLink>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const to2Key = (to: To) => (typeof to === 'string' ? to : JSON.stringify(to));
