import { cn } from '@/utils/shadcn';
import { IoClose as CloseIcon } from 'react-icons/io5';
import { FaChevronLeft as LeftIcon, FaChevronRight as RightIcon } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/reactRouterPlugins';

type Props = {
  isOpen: boolean;
  close: () => void;
  viewOnGbifHref?: string;
  children: React.ReactNode;
  next?: () => void;
  previous?: () => void;
};

export function Drawer({ isOpen, close, viewOnGbifHref, children, next, previous }: Props) {
  return (
    <Backdrop isOpen={isOpen} close={close}>
      <DrawerContainer isOpen={isOpen}>
        <div className="g-flex g-flex-grow g-overflow-hidden">
          <div className="g-overflow-x-auto g-flex-grow g-w-full">{children}</div>
        </div>

        <BottomBar viewOnGbifHref={viewOnGbifHref} next={next} previous={previous} close={close} />
      </DrawerContainer>
    </Backdrop>
  );
}

function DrawerContainer({ children, isOpen }: Pick<Props, 'children' | 'isOpen'>) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn(
        'g-bg-white g-h-full g-max-w-[1500px] g-w-[95%] g-transition-all g-cursor-auto g-flex g-flex-col',
        {
          'g-translate-x-0': isOpen,
          'g-translate-x-full': !isOpen,
        }
      )}
    >
      {children}
    </div>
  );
}

function Backdrop({ isOpen, close, children }: Pick<Props, 'isOpen' | 'close' | 'children'>) {
  return (
    <div
      onClick={close}
      className={cn(
        'g-fixed g-w-screen g-h-screen g-right-0 g-top-0 g-bg-gray-500 g-flex g-justify-end g-transition-all g-cursor-pointer g-z-20',
        {
          'g-pointer-events-none g-bg-opacity-0': !isOpen,
          'g-bg-opacity-50 g-overflow-hidden': isOpen,
        }
      )}
    >
      {children}
    </div>
  );
}

function BottomBar({
  viewOnGbifHref,
  next,
  previous,
  close,
}: Pick<Props, 'viewOnGbifHref' | 'next' | 'previous' | 'close'>) {
  return (
    <div className="g-h-10 g-border-t g-flex g-justify-between g-p-2">
      <Button variant="ghost" className="g-size-6 g-p-0" onClick={close}>
        <CloseIcon />
      </Button>
      {viewOnGbifHref && (
        <Button className="g-h-6" variant="ghost" asChild>
          <DynamicLink to={viewOnGbifHref}>Go to record</DynamicLink>
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