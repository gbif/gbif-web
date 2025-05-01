import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useParams } from 'react-router-dom';
import { DataFromCountryMap } from './components/dataFromCountryMap';

export function CountryKeyPublishing() {
  const { countryCode } = useParams();

  if (!countryCode) throw new Error('Country code is required');

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataFromCountryMap countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
