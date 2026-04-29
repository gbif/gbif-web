import { Button } from '@/components/ui/button';
import { Dialog, DialogOverlay, DialogPortal } from '@/components/ui/dialog';
import { Card } from '@/components/ui/largeCard';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

type CsvDownloadModalProps = {
  open: boolean;
  downloadUrl: string;
  filename: string;
  title: ReactNode;
  description: ReactNode;
  cancelLabel: ReactNode;
  onClose: () => void;
};

export function CsvDownloadModal({
  open,
  downloadUrl,
  filename,
  title,
  description,
  cancelLabel,
  onClose,
}: CsvDownloadModalProps) {
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
              <p className="g-font-semibold g-text-slate-800 g-text-base">{title}</p>
              <p className="g-text-slate-500 g-text-sm g-mt-1">{description}</p>
            </div>

            <div className="g-p-8 g-flex g-flex-col g-items-center g-gap-4">
              <Button asChild variant="default" className="g-w-full">
                <a
                  href={downloadUrl}
                  download={filename}
                  onClick={() => setTimeout(onClose, 800)}
                >
                  {title}
                </a>
              </Button>

              <Button variant="ghost" size="sm" onClick={onClose} className="g-text-slate-400">
                {cancelLabel}
              </Button>
            </div>
          </Card>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
