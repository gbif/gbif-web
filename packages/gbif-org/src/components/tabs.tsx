import { cn } from '@/utils/shadcn';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useEffect, useRef, useState } from 'react';
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
  const ulRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const activeLinkRef = useRef<string | null>(null);

  const checkScroll = () => {
    const el = ulRef.current;
    if (el) {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 0);
      // Use a small tolerance for float calculation differences
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    const el = ulRef.current;
    if (el) {
      checkScroll();
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);

      // Scroll active tab into view
      const active =
        el.querySelector('[aria-current="page"]') || el.querySelector('[data-active="true"]');
      if (active) {
        const id = active.getAttribute('href') || active.textContent || '';
        if (id !== activeLinkRef.current) {
          active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          activeLinkRef.current = id;
        }
      }

      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [enabledLinks]);

  const scroll = (direction: 'left' | 'right') => {
    const el = ulRef.current;
    if (el) {
      const scrollAmount = el.clientWidth / 2;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div
      className={cn(
        'g-relative g-border-b g-border-slate-200 dark:g-border-slate-200/5',
        className
      )}
    >
      {canScrollLeft && (
        <div className="g-absolute g-left-0 g-top-0 g-h-[calc(100%-2px)]">
          <button
            onClick={() => scroll('left')}
            className="g-m-0 g-pr-3 g-flex g-items-start g-pt-4 g-justify-center g-bg-gradient-to-r g-from-white g-from-50% g-to-transparent g-text-slate-500 hover:g-text-slate-900 g-h-full"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="g-w-4 g-h-4" />
          </button>
        </div>
      )}

      <ul ref={ulRef} className="g-flex g-whitespace-nowrap g-overflow-x-auto -g-mb-px">
        {enabledLinks.map(({ to, children, className: cls, isActive }) => (
          <li key={to2Key(to)} className={cn('g-pr-1')} data-active={isActive ? 'true' : undefined}>
            <TabLink
              to={to}
              className={cls}
              isActive={isActive}
              autoDetectActive={!disableAutoDetectActive}
            >
              {children}
            </TabLink>
          </li>
        ))}
      </ul>

      {canScrollRight && (
        <div className="g-absolute g-right-0 g-top-0 g-h-[calc(100%-2px)]">
          <button
            onClick={() => scroll('right')}
            className="g-m-0 g-pl-3 g-flex g-items-start g-pt-4 g-justify-center g-bg-gradient-to-l g-from-white g-from-50% g-to-transparent g-text-slate-500 hover:g-text-slate-900 g-h-full"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="g-w-4 g-h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const to2Key = (to: To) => (typeof to === 'string' ? to : JSON.stringify(to));
