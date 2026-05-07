import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { MdBrokenImage } from 'react-icons/md';

export function Img({
  failedClassName,
  onError,
  className,
  style,
  src,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  failedClassName?: string;
  onError?: () => void;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>(undefined);
  const failed = failedSrc !== undefined && failedSrc === src;
  if (failed) {
    return (
      <div
        style={style}
        className={cn(
          'gb-image-failed g-h-36 g-mx-auto g-flex g-items-center g-justify-center',
          className,
          failedClassName
        )}
      >
        <MdBrokenImage />
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      style={style}
      onError={() => {
        setFailedSrc(src);
        onError && onError();
      }}
      className={className}
    />
  );
}
