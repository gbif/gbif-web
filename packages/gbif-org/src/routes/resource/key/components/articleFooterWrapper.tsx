import { RenderIfChildren } from '@/components/renderIfChildren';
import { cn } from '@/utils/shadcn';

type Props = {
  children?: React.ReactNode;
  hrClassName?: string;
};

export function ArticleFooterWrapper({ children, hrClassName }: Props) {
  return (
    <RenderIfChildren
      as={({ children }: Props) => (
        <>
          <hr className={cn('g-mt-8', hrClassName)} />
          {children}
        </>
      )}
    >
      {children}
    </RenderIfChildren>
  );
}
