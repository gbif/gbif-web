import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { DataAboutCountryMap } from './components/dataAboutCountryMap';
import { useParams } from 'react-router-dom';

export function CountryKeyAbout() {
  const { countryCode } = useParams();

  if (!countryCode) throw new Error('Country code is required');

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DataAboutCountryMap countryCode={countryCode} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
