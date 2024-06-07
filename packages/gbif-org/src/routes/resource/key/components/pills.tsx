import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  pills: Array<{ key: string; content: React.ReactNode }>;
  className?: string;
};

export function Pills({ label, pills, className }: Props) {
  return (
    <div className={cn(className)}>
      {label && <span className='g-me-4'>{label}</span>}

      {pills.map(({ key, content }) => (
        <span
          key={key}
          className='g-bg-slate-200 g-text-slate-800 dark:g-text-slate-400 dark:g-bg-zinc-800/80 g-py-1 g-px-2 g-rounded-full g-m-1 g-inline-block'
        >
          {content}
        </span>
      ))}
    </div>
  );
}
