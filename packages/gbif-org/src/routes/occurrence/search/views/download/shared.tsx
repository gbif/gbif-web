import { Message } from '@/components/message';
import { Button } from '@/components/ui/button';
import { FilterContext } from '@/contexts/filter';
import { useContext } from 'react';

export function FreeTextWarning() {
  const currentFilterContext = useContext(FilterContext);
  return (
    <>
      <DownloadCardTitle>
        <Message id="download.unsupported.title" />
      </DownloadCardTitle>
      <DownloadCardDescription>
        <Message id="download.unsupported.description" />
      </DownloadCardDescription>
      <Button
        className="g-mt-6"
        onClick={() => currentFilterContext.setField('q', [])}
        variant="primaryOutline"
      >
        <Message id="download.unsupported.remove" />
      </Button>
    </>
  );
}

export function DownloadCardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="g-my-2 g-font-medium g-text-slate-500">{children}</h3>;
}

export function DownloadCardDescription({ children }: { children: React.ReactNode }) {
  return <div className="g-text-sm g-mt-4 [&_p]:g-mb-2 g-text-slate-500">{children}</div>;
}
