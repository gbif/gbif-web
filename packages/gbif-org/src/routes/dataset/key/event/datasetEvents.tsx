import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useLoaderData } from 'react-router-dom';
import EventList from './eventList';
const DatasetEvents = () => {
  const { data } = useLoaderData() as { data: DatasetQuery };
  const {
    dataset: { key },
  } = data;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <EventList datasetKey={key} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
};

export default DatasetEvents;
