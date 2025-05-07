import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

type Props = {
  title?: React.ReactNode;
  info?: React.ReactNode;
  imgfile: string;
};

// TODO: mode to config
const analyticsFigureUrl = 'https://analytics-files.gbif.org/country/DK/publishedBy/figure/';

export function Trend({ title, info, imgfile }: Props) {
  return (
    <div className="g-flex g-flex-col">
      <div>
        {title && <h4 className="g-font-bold g-pb-2">{title}</h4>}
        {info && <p className="g-text-sm g-pb-4">{info}</p>}
      </div>
      <div className="g-mt-auto">
        <Dialog>
          <DialogTrigger>
            <img src={`${analyticsFigureUrl}${imgfile}.svg`} />
          </DialogTrigger>
          <DialogContent className="g-p-4 g-max-w-screen-md">
            <img src={`${analyticsFigureUrl}${imgfile}.svg`} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function TrendContainer({ children }: { children: React.ReactNode }) {
  return <div className="g-grid g-grid-cols-3 g-gap-4">{children}</div>;
}
