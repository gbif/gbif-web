import React from 'react';
import { MdApps, MdCode, MdInfo } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/shadcn';

export function DataHeader({
  children,
  title,
  aboutContent,
  apiContent,
  hasBorder,
}: {
  children?: React.ReactNode;
  title?: string;
  hasBorder?: boolean;
  aboutContent?: React.ReactElement;
  apiContent?: React.ReactElement;
}) {
  return (
    <div
      className={`g-flex g-justify-center g-items-center g-ms-2 ${
        hasBorder ? 'g-border-b g-border-slate-200' : ''
      }`}
    >
      <>
        <div className="g-flex-none g-flex g-items-center g-mx-2">
          <MdApps />
          {title && <span className="g-ms-2 g-pt-2 g-pb-1.5">{title}</span>}
        </div>
        {children && <Separator />}
      </>
      <div className="g-flex-auto">{children}</div>
      <div className="g-flex-none g-mx-2">
        <div className="g-flex g-justify-center g-text-slate-400">
          {aboutContent && (
            <Popup trigger={<MdInfo className="g-mx-1 hover:g-text-slate-700" />}>
              {aboutContent}
            </Popup>
          )}
          {apiContent && (
            <Popup trigger={<MdCode className="g-mx-1 hover:g-text-slate-700" />}>
              {apiContent}
            </Popup>
          )}
        </div>
      </div>
    </div>
  );
}

export function Separator() {
  return <div className="g-border-l g-border-slate-200 g-h-6 g-mx-2"></div>;
}

function Popup({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactElement;
  children: React.ReactElement;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={cn('g-w-96', className)}>{children}</PopoverContent>
    </Popover>
  );
}