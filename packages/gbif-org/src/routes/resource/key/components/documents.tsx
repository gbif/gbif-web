import { Separator } from '@/components/ui/separator';
import { DocumentPreviewFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { BsTable, BsFilePdfFill as PdfIcon } from 'react-icons/bs';
import { GrTextAlignLeft } from 'react-icons/gr';
import { LuPresentation as PresentationIcon } from 'react-icons/lu';
import { MdArchive, MdAudiotrack, MdFileDownload, MdImage, MdVideocam } from 'react-icons/md';
import styles from './documents.module.css';

fragmentManager.register(/* GraphQL */ `
  fragment DocumentPreview on DocumentAsset {
    title
    file {
      url
      fileName
      contentType
      volatile_documentType
      details {
        size
      }
    }
  }
`);

type Props = {
  documents: Array<null | DocumentPreviewFragment>;
  className?: string;
};

export function Documents({ documents, className }: Props) {
  return (
    <ul className={cn('g-grid g-grid-cols-1 sm:g-grid-cols-2 g-gap-4', className)}>
      {documents.filter(isValid).map((document, index) => (
        <li
          key={index}
          className="g-border g-border-solid g-border-transparent hover:g-border-slate-100 g-p-3 hover:g-shadow-md dark:g-bg-zinc-800 dark:g-text-slate-800 g-text-white"
        >
          <a
            className="g-flex g-flex-row g-cursor-pointer"
            href={document?.file?.url ?? ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DocumentContnet document={document} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function isValid(document: null | DocumentPreviewFragment): document is DocumentPreviewFragment {
  return !!document && !!document?.file?.url;
}

function DocumentContnet({ document }: { document: DocumentPreviewFragment }) {
  const { color, showSize, content } = getType(document?.file?.volatile_documentType);
  // get extension of file name if any
  const url = document?.file?.url;
  const extension = url?.substring(url.lastIndexOf('.') + 1).toLowerCase() ?? '';

  return (
    <>
      <div className={`${color} g-me-4 ${styles.note} g-flex-none`}>
        <div>{content}</div>
      </div>
      <div className="g-break-word dark:g-text-slate-200 g-text-slate-500">
        <div className="g-font-medium">{document?.title ?? document?.file?.fileName}</div>
        <div className="g-text-sm g-text-slate-400 g-flex g-gap-2 g-items-center">
          {showSize && <span>{getFormattedBits(document?.file?.details?.size ?? 0)}</span>}
          {showSize && extension.length < 5 && (
            <Separator orientation="vertical" className="g-h-4 g-w-[2px] g-bg-slate-200" />
          )}
          {extension.length < 5 && <span>.{extension}</span>}
        </div>
      </div>
    </>
  );
}

function getType(documentType: string | null | undefined) {
  // based on the icon select an appropriate icon
  // image, pdf, word, excel, powerpoint, video, audio, text, zip, other
  if (documentType === 'image') {
    return {
      color: 'g-bg-[#c44ff4]',
      showSize: true,
      content: <MdImage />,
    };
  }
  if (documentType === 'pdf') {
    return {
      color: 'g-bg-[#4ebcf4]',
      showSize: true,
      content: <PdfIcon />,
    };
  }
  if (documentType === 'doc') {
    return {
      color: 'g-bg-[#4ebcf4]',
      showSize: true,
      content: <GrTextAlignLeft />,
    };
  }
  if (documentType === 'xls') {
    return {
      color: 'g-bg-[#4ebcf4]',
      showSize: true,
      content: <BsTable />,
    };
  }
  if (documentType === 'ppt') {
    return {
      color: 'g-bg-[#4ebcf4]',
      showSize: true,
      content: <PresentationIcon />,
    };
  }
  if (documentType === 'video') {
    return {
      color: 'g-bg-[#c44ff4]',
      showSize: true,
      content: <MdVideocam />,
    };
  }
  if (documentType === 'audio') {
    return {
      color: 'g-bg-[#c44ff4]',
      showSize: true,
      content: <MdAudiotrack />,
    };
  }
  if (documentType === 'archive') {
    return {
      color: 'g-bg-[#666]',
      showSize: true,
      content: <MdArchive />,
    };
  }

  return {
    color: 'g-bg-[#666]',
    showSize: false,
    content: <MdFileDownload />,
  };
}

// function to get bits as a human readable string
function getFormattedBits(bits: number) {
  const i = Math.floor(Math.log(bits) / Math.log(1024));
  return `${(bits / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}
