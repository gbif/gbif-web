import { FormattedNumber } from '@/components/dashboard/shared';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { ParamQuery } from '@/utils/querystring';
import { FaDatabase, FaKiwiBird } from 'react-icons/fa';
import { MdBusiness, MdChevronRight, MdFileCopy, MdPinDrop } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { CategoryCount } from './search';

const categories: CategoryCount[] = [
  { type: 'speciesSearch', count: 0, label: 'Species', icon: 'Bird' },
  { type: 'datasetSearch', count: 0, label: 'Datasets', icon: 'Database' },
  { type: 'publisherSearch', count: 0, label: 'Publishers', icon: 'Building2' },
  { type: 'resourceSearch', count: 0, label: 'Resources and articles', icon: 'FileText' },
];

const iconMap = {
  Bird: FaKiwiBird,
  Pin: MdPinDrop,
  Database: FaDatabase,
  Building2: MdBusiness,
  FileText: MdFileCopy,
};

interface CategoryLinksProps {
  counts: Record<string, number>;
  query?: string;
  occurrenceDescription: JSX.Element;
  occurrenceSearchParams: ParamQuery;
}

export function CategoryLinks({
  counts,
  query,
  occurrenceDescription,
  occurrenceSearchParams,
}: CategoryLinksProps) {
  return (
    <div className="g-pb-2 g--mx-4 g-px-4">
      {/* <div className="g-flex g-gap-3 md:g-grid md:g-grid-cols-2 lg:g-grid-cols-5 g-min-w-max md:g-min-w-0"> */}
      <div className="">
        <ListCard
          pageId="occurrenceSearch"
          searchParams={occurrenceSearchParams}
          Icon={iconMap.Pin}
          label={<FormattedMessage id="search.crossContentSearch.categories.occurrenceSearch" />}
          description={occurrenceDescription}
        />
        {categories.map((category) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap];
          const count = counts[category.type] || 0;

          return (
            <ListCard
              key={category.type}
              pageId={category.type}
              searchParams={count > 0 ? { q: query } : {}}
              Icon={Icon}
              label={
                <FormattedMessage id={`search.crossContentSearch.categories.${category.type}`} />
              }
              description={
                count > 0 ? (
                  <FormattedNumber value={count} />
                ) : (
                  <FormattedMessage id="search.crossContentSearch.seeAll" />
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function ListCard({
  pageId,
  searchParams,
  Icon,
  label,
  description,
}: {
  pageId: string;
  searchParams: ParamQuery;
  Icon: React.ElementType;
  label: string | React.ReactNode;
  description: React.ReactNode;
}) {
  return (
    <Card>
      <DynamicLink
        pageId={pageId}
        searchParams={searchParams}
        className="g-flex g-items-center g-bg-white g-rounded-lg g-border g-border-gray-100 hover:g-border-primary-500 hover:g-shadow-md g-transition-all g-group"
      >
        <div className="g-flex g-flex-1 g-items-center g-gap-3 g-p-3 md:g-p-4">
          <div className="g-p-2 g-rounded-lg g-bg-primary-50 g-text-primary-600">
            <Icon className="g-h-5 g-w-5" />
          </div>
          <div className="g-flex-1 g-flex g-flex-col g-gap-1">
            <h3 className="g-font-medium g-text-gray-900">{label}</h3>
            <p className="g-text-sm g-text-gray-500">{description}</p>
          </div>
        </div>
        <div className="g-border-l g-border-gray-100 g-p-3 g-flex g-flex-none g-items-center">
          <MdChevronRight className="g-h-5 g-w-5 g-text-gray-400 group-hover:g-text-primary-500 g-transition-colors" />
        </div>
      </DynamicLink>
    </Card>
  );
}
