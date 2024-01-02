import { useI18n } from '@/contexts/i18n';

// TODO Should be translated

type Props = {
  date: Date | string;
  className?: string;
};

export function PublishedDate({ date }: Props) {
  const { locale } = useI18n();

  return (
    <p className="text-gray-600 text-sm">
      Published {new Date(date).toLocaleDateString(locale.code)}
    </p>
  );
}
