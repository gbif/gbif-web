import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useEffect } from 'react';
import { FaChevronLeft as LeftIcon, FaChevronRight as RightIcon } from 'react-icons/fa';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { FormattedMessage } from 'react-intl';

type Props = {
  isOpen: boolean;
  close: () => void;
  viewOnGbifHref?: string | null;
  children: React.ReactNode;
  next?: () => void;
  previous?: () => void;
  onCloseAutoFocus?: (event: Event) => void;
  screenReaderTitle?: React.ReactNode;
  screenReaderDescription?: React.ReactNode;
};

export function Drawer({
  isOpen,
  close,
  viewOnGbifHref,
  children,
  next,
  previous,
  onCloseAutoFocus,
  screenReaderTitle,
  screenReaderDescription,
}: Props) {
  useEffect(() => {
    function handleKeypress(e: KeyboardEvent) {
      if (!isOpen) return;
      switch (e.key) {
        case 'ArrowLeft':
          previous?.();
          return;
        case 'ArrowRight':
          next?.();
          return;
        default:
          return;
      }
    }
    if (document) {
      document.addEventListener('keydown', handleKeypress, false);
    }

    return function cleanup() {
      if (document) document.removeEventListener('keydown', handleKeypress, false);
    };
  }, [next, previous, isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && close()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="gbif g-fixed g-w-full g-h-dvh g-right-0 g-top-0 g-bg-gray-500 g-transition-all g-bg-opacity-50"
          style={{ zIndex: 'var(--drawerZIndex)' }}
        >
          <Dialog.Content
            onCloseAutoFocus={onCloseAutoFocus}
            style={{ maxWidth: '95%', width: '1200px' }}
            className="drawer-popover-container g-fixed g-h-dvh g-right-0 g-top-0 g-bg-white g-flex g-justify-end g-transition-all g-z-50"
          >
            <VisuallyHidden>
              <Dialog.Title>{screenReaderTitle}</Dialog.Title>(
              <Dialog.Description>{screenReaderDescription}</Dialog.Description>)
            </VisuallyHidden>
            <div className="g-flex g-flex-col g-bg-white g-w-full">
              <div className="g-overflow-y-auto g-overflow-x-hidden g-flex-grow g-w-full">
                {children}
              </div>
              <BottomBar viewOnGbifHref={viewOnGbifHref} next={next} previous={previous} />
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function BottomBar({
  viewOnGbifHref,
  next,
  previous,
}: Pick<Props, 'viewOnGbifHref' | 'next' | 'previous'>) {
  return (
    <div className="g-w-full g-h-10 g-border-t g-flex g-justify-between g-p-2 g-items-center">
      <Dialog.Close asChild>
        <Button variant="ghost" className="g-size-6 g-p-0">
          <CloseIcon />
        </Button>
      </Dialog.Close>
      {viewOnGbifHref && (
        <Button className="g-h-6" variant="ghost" asChild>
          <DynamicLink to={viewOnGbifHref}>
            <FormattedMessage id="phrases.goToRecord" />
          </DynamicLink>
        </Button>
      )}
      <div>
        <Button
          className={cn('g-size-6 g-p-0', { 'g-invisible': !previous })}
          variant="ghost"
          onClick={previous}
        >
          <LeftIcon />
        </Button>
        <Button
          className={cn('g-size-6 g-p-0', { 'g-invisible': !next })}
          variant="ghost"
          onClick={next}
        >
          <RightIcon />
        </Button>
      </div>
    </div>
  );
}
