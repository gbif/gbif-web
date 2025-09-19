import { MdDone } from 'react-icons/md';
import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  title: React.ReactNode;
  message: React.ReactNode;
  onReset?: () => void;
  resetMessage?: React.ReactNode;
};

export function FormSuccess({ onReset, className, title, message, resetMessage }: Props) {
  return (
    <div
      className={cn('g-bg-gray-50 g-px-2 g-flex g-flex-col g-items-center g-shadow-sm', className)}
    >
      <div className="g-mb-10 g-mt-16 g-border-primary-500 g-border-8 g-rounded-full g-size-32 g-flex g-items-center g-justify-center">
        <MdDone className="g-text-primary-500 g-size-24" />
      </div>

      <h3 className="g-text-xl md:g-text-2xl g-font-medium g-text-center">{title}</h3>

      <p className="g-mt-4 g-mb-8">{message}</p>

      {resetMessage && onReset && (
        <button onClick={onReset} className="g-mb-24 g-underline g-text-sm">
          {resetMessage}
        </button>
      )}
    </div>
  );
}
