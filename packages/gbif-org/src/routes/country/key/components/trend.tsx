import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createContext, useContext } from 'react';

type Props = {
  title?: React.ReactNode;
  info?: React.ReactNode;
  imgfile: string;
};

export function Trend({ title, info, imgfile }: Props) {
  const { path } = useTrendContext();

  const figureUrl = `${import.meta.env.PUBLIC_ANALYTICS_FILES_URL}/${path}/figure/${imgfile}.svg`;

  return (
    <div className="g-flex g-flex-col">
      <div>
        {title && <h4 className="g-font-bold g-pb-2">{title}</h4>}
        {info && <p className="g-text-sm g-pb-4">{info}</p>}
      </div>
      <div className="g-mt-auto">
        <Dialog>
          <DialogTrigger>
            <img src={figureUrl} className="g-border g-p-1" />
          </DialogTrigger>
          <DialogContent className="g-p-2 sm:g-rounded-none g-rounded-none g-bg-white g-max-w-[min(95%,768px)]">
            <img src={figureUrl} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function TrendContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="g-grid g-grid-cols-1 sm:g-grid-cols-2 md:g-grid-cols-3 g-gap-4">{children}</div>
  );
}

export type ITrendContext = {
  path: string;
  countryCode?: string;
};

const TrendContext = createContext<ITrendContext | undefined>(undefined);

type TrendProviderProps = ITrendContext & {
  children: React.ReactNode;
};

export function TrendProvider({ children, path, countryCode }: TrendProviderProps) {
  return <TrendContext.Provider value={{ path, countryCode }}>{children}</TrendContext.Provider>;
}

export function useTrendContext() {
  const context = useContext(TrendContext);
  if (!context) throw new Error('TrendContext not found');
  return context;
}
