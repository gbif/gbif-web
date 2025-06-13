import { LanguageOption, useConfig } from '@/config/config';
import useFetchGet from '@/hooks/useFetchGet';
import { useI18n } from '@/reactRouterPlugins';
import { Skeleton } from './ui/skeleton';

type Props = {
  value: string;
  vocabulary: 'EstablishmentMeans' | 'Sex' | 'LifeStage'; // Add more options using a union type as needed;
};

export function VocabularyValue({ value, vocabulary }: Props) {
  const config = useConfig();
  const { locale } = useI18n();

  const { data, loading } = useFetchGet({
    endpoint: `${config.v1Endpoint}/vocabularies/${vocabulary}/concepts/${value}`,
  });

  if (loading) return <Skeleton className="g-h-6 g-w-full" />;
  if (data) return <span>{getVocabularyLabel(data, locale).title}</span>;
  return null;
}

function getVocabularyLabel(result: any, locale: LanguageOption) {
  // transform result labels to an object with language as keys
  const labels = result.label.reduce((acc, label) => {
    acc[label.language] = label.value;
    return acc;
  }, {});

  const title = labels[locale.code] || labels.en || result.name || 'Unknown';
  return { title };
}
