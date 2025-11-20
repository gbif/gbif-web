import { Table as ClientTable } from '@/components/clientTable';
import { DEFAULT_SANITIZE_OPTIONS } from '@/components/hyperText';
import { FormattedMessage } from 'react-intl';
import { Message } from '@/components/message';

type HeaderProps = {
  titleId: string;
  descriptionId: string;
};

const DESCRIPTION_SANITIZE_OPTIONS: DOMPurify.Config = {
  ...DEFAULT_SANITIZE_OPTIONS,
  ALLOWED_TAGS: [...(DEFAULT_SANITIZE_OPTIONS?.ALLOWED_TAGS ?? []), 'ul', 'ol', 'li'],
};

export function Header({ titleId, descriptionId }: HeaderProps) {
  return (
    <div className="g-p-4">
      <h3 className="g-mb-2 g-text-lg g-font-bold g-text-slate-800">
        {<FormattedMessage id={titleId} />}
      </h3>
      <div className="g-text-slate-600 g-prose g-prose-sm g-inline">
        {<Message id={descriptionId} sanitizeOptions={DESCRIPTION_SANITIZE_OPTIONS} />}
      </div>
    </div>
  );
}

type ContainerProps = { children: React.ReactNode };

export function Container({ children }: ContainerProps) {
  return <div className="gbif-table-style g-bg-white g-rounded-lg">{children}</div>;
}

type TableProps = { children: React.ReactNode };

export function Table({ children }: TableProps) {
  return <ClientTable className="g-border-t">{children}</ClientTable>;
}

type TableRowProps = { children: React.ReactNode; onClick: () => void };

export function TableRow({ children, onClick }: TableRowProps) {
  return (
    <tr onClick={onClick} className="g-cursor-pointer hover:g-bg-slate-50 g-transition-colors">
      {children}
    </tr>
  );
}
