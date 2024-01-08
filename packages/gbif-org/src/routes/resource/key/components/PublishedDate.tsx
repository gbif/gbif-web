import { useI18n } from '@/contexts/i18n';
import { cn } from '@/utils/shadcn';

// TODO Should be translated

type Props = {
  date: Date | string;
  className?: string;
};

export function PublishedDate({ date, className }: Props) {
  const { locale } = useI18n();

  return (
    <p className={cn('text-slate-500 dark:text-gray-400 mt-2 text-sm font-medium', className)}>
      Published {new Date(date).toLocaleDateString(locale.code)}
    </p>
  );
}
