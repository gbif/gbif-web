import { cn } from '@/utils/shadcn';
import { MdArchive, MdAudiotrack, MdFileDownload, MdImage, MdVideocam } from 'react-icons/md';
import { BsTable, BsFilePdfFill as PdfIcon } from 'react-icons/bs';
import { LuPresentation as PresentationIcon } from 'react-icons/lu';
import { GrTextAlignLeft } from 'react-icons/gr';
import styles from './documents.module.css';
import { fragmentManager } from '@/services/FragmentManager';
import { DocumentPreviewFragment } from '@/gql/graphql';

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
    <ul className={cn('grid grid-cols-2 gap-4', className)}>
      {documents.filter(isValid).map((document, index) => (
        <li
          key={index}
          className="border border-transparent hover:border-slate-100 p-3 hover:shadow-md p2 dark:bg-zinc-800 dark:text-slate-800 text-white"
        >
          <a
            className="flex flex-row cursor-pointer"
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
      <div className={`${color} mr-4 ${styles.note} flex-none`}>
        <div>{content}</div>
      </div>
      <div className="break-word dark:text-slate-200 text-slate-500">
        <div className="font-medium">{document?.title ?? document?.file?.fileName}</div>
        <div className="text-sm text-slate-400 divide-x-2 divide-slate-200 dark:divide-slate-600">
          {showSize && (
            <span className="pe-2">{getFormattedBits(document?.file?.details?.size ?? 0)}</span>
          )}
          {extension.length < 5 && <span className="ps-2">.{extension}</span>}
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
      color: 'bg-[#c44ff4]',
      showSize: true,
      content: <MdImage />,
    };
  }
  if (documentType === 'pdf') {
    return {
      color: 'bg-[#4ebcf4]',
      showSize: true,
      content: <PdfIcon />,
    };
  }
  if (documentType === 'doc') {
    return {
      color: 'bg-[#4ebcf4]',
      showSize: true,
      content: <GrTextAlignLeft />,
    };
  }
  if (documentType === 'xls') {
    return {
      color: 'bg-[#4ebcf4]',
      showSize: true,
      content: <BsTable />,
    };
  }
  if (documentType === 'ppt') {
    return {
      color: 'bg-[#4ebcf4]',
      showSize: true,
      content: <PresentationIcon />,
    };
  }
  if (documentType === 'video') {
    return {
      color: 'bg-[#c44ff4]',
      showSize: true,
      content: <MdVideocam />,
    };
  }
  if (documentType === 'audio') {
    return {
      color: 'bg-[#c44ff4]',
      showSize: true,
      content: <MdAudiotrack />,
    };
  }
  if (documentType === 'archive') {
    return {
      color: 'bg-[#666]',
      showSize: true,
      content: <MdArchive />,
    };
  }

  return {
    color: 'bg-[#666]',
    showSize: false,
    content: <MdFileDownload />,
  };
}

// function to get bits as a human readable string
function getFormattedBits(bits: number) {
  const i = Math.floor(Math.log(bits) / Math.log(1024));
  return `${(bits / Math.pow(1024, i)).toFixed(2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}
