import { cn } from '@/utils/shadcn';

type Props = {
  label?: React.ReactNode;
  pills: Array<{ key: string; content: React.ReactNode }>;
  className?: string;
};

export function Pills({ label, pills, className }: Props) {
  return (
    <div className={cn(className)}>
      {label && <span className="me-4">{label}</span>}

      {pills.map(({ key, content }) => (
        <span
          key={key}
          className="bg-slate-200 text-slate-800 dark:text-slate-400 dark:bg-slate-900/50 py-1 px-2 rounded-full m-1 inline-block"
        >
          {content}
        </span>
      ))}
    </div>
  );
}
