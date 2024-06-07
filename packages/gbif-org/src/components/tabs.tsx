import { useEffect, useRef, useState } from 'react';
import { TabLink } from './tabLink';
import { cn } from '@/utils/shadcn';
import { debounce } from '@/utils/debounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { DynamicLink } from './dynamicLink';
import { MdMoreHoriz } from 'react-icons/md';
import { useI18n } from '@/contexts/i18n';

export type Props = {
  className?: string;
  links: Array<{ to: string; children: React.ReactNode }>;
};

export function Tabs({ links, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const [visibleTabCount, setVisibleTabCount] = useState(0);
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
      if (tabsWidth < containerWidth) return void setVisibleTabCount(links.length);

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
  }, [links, setVisibleTabCount]);

  return (
    <div ref={containerRef} className={cn('g-relative', className)}>
      <ul className='g-border-b g-border-slate-200 g-flex g-whitespace-nowrap dark:g-border-slate-200/5 g-overflow-hidden -g-mb-px'>
        {links.map(({ to, children }, idx) => {
          const visible = idx < visibleTabCount;

          return (
            <li key={to} className={cn({ 'g-invisible': !visible }, 'g-pr-1')}>
              <TabLink to={to}>{children}</TabLink>
            </li>
          );
        })}
      </ul>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          ref={dropdownMenuTriggerRef}
          className={cn(
            {
              'g-invisible': visibleTabCount === links.length,
              'g-right-0 g-pr-3': locale.textDirection === 'ltr',
              'g-left-0 g-pl-3': locale.textDirection === 'rtl',
            },
            'g-absolute g-top-1/2 -g-translate-y-1/2'
          )}
        >
          <MdMoreHoriz className='g-text-2xl' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {links.slice(visibleTabCount).map(({ to, children }) => (
            <DropdownMenuItem key={to}>
              <DynamicLink
                onClick={() => setIsDropdownOpen(false)}
                to={to}
                className='g-w-full g-justify-center'
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
