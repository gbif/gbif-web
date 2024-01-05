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
    <p className={cn('text-gray-600 text-sm', className)}>
      Published {new Date(date).toLocaleDateString(locale.code)}
    </p>
  );
}
