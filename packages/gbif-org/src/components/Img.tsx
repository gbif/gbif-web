import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { MdBrokenImage } from 'react-icons/md';

export function Img({
  failedClassName,
  onError,
  className,
  style,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & {
  failedClassName?: string;
  onError?: () => void;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
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
      style={style}
      onError={() => {
        setFailed(true);
        onError && onError();
      }}
      className={className}
    />
  );
}
