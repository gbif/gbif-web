import { cn } from '@/utils/shadcn';

type Props = {
  children: React.ReactNode;
  className?: string;
  topPadded?: boolean;
  bottomPadded?: boolean;
};

export function PageContainer({ className, topPadded, bottomPadded, children }: Props) {
  return (
    <div
      className={cn(
        `g-px-4 lg:g-px-8 ${topPadded ? 'g-pt-4 lg:g-pt-12' : ''} ${
          bottomPadded ? 'g-pb-4 lg:g-pb-8' : ''
        }`,
        className
      )}
    >
      {children}
    </div>
  );
}
