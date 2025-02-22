import { Card } from '@/components/ui/largeCard';
import { DownloadKeyQuery } from '@/gql/graphql';
import { MdPerson } from 'react-icons/md';

export function UserDescription({ download }: { download: DownloadKeyQuery['download'] }) {
  if (!download?.request?.description) return null;
  return (
    <div className="g-flex g-gap-4 g-mb-8 g-mt-8">
      <div className="g-flex-none">
        <div className="g-rounded-full g-bg-gray-200 g-p-2">
          <MdPerson className="md:g-text-4xl sm:g-text-2xl" />
        </div>
      </div>
      <div className="g-flex-auto g-flex-grow g-gap-4">
        <div className="g-flex-auto g-inline-block">
          <div className="g-text-slate-600">Description by download creator</div>
          <Card className="g-p-4">{download?.request?.description}</Card>
        </div>
      </div>
    </div>
  );
}
