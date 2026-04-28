import { Button } from '@/components/ui/button';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Card } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { MdOutlineDownload } from 'react-icons/md';

type DownloadModalProps = {
  open: boolean;
  downloadUrl: string;
  onClose: () => void;
};

export function DownloadModal({ open, downloadUrl, onClose }: DownloadModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogPortal>
        <DialogOverlay className="g-bg-black/40 g-backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="gbif g-fixed g-z-50 g-left-[50%]"
          style={{
            top: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '28rem',
            width: '100%',
            padding: '0 1rem',
          }}
        >
          <Card className="g-bg-white g-overflow-hidden">
            <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100">
              <p className="g-font-semibold g-text-slate-800 g-text-base">
                <FormattedMessage
                  id="tools.speciesLookup.downloadAsCsv"
                  defaultMessage="Download as .csv"
                />
              </p>
              <p className="g-text-slate-500 g-text-sm g-mt-1">
                <FormattedMessage
                  id="tools.speciesLookup.downloadDescription"
                  defaultMessage="Your results are ready to download."
                />
              </p>
            </div>

            <div className="g-p-8 g-flex g-flex-col g-items-center g-gap-4">
              <Button asChild variant="default" className="g-w-full">
                <a
                  href={downloadUrl}
                  download="species-match.csv"
                  onClick={() => setTimeout(onClose, 800)}
                >
                  <FormattedMessage
                    id="tools.speciesLookup.downloadAsCsv"
                    defaultMessage="Download as .csv"
                  />
                </a>
              </Button>

              <Button variant="ghost" size="sm" onClick={onClose} className="g-text-slate-400">
                <FormattedMessage id="tools.speciesLookup.cancel" defaultMessage="Cancel" />
              </Button>
            </div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
