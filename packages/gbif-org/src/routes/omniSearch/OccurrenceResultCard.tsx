import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { ParamQuery } from '@/utils/querystring';
import { MdChevronRight } from 'react-icons/md';

interface ResultCardProps {
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  searchParams?: ParamQuery;
  label: React.ReactNode;
  queryString: React.ReactNode;
}

export default function OccurrenceResultCard({
  Icon,
  searchParams,
  label,
  queryString,
}: ResultCardProps) {
  return (
    <Card className="g-mb-4">
      <DynamicLink
        pageId="occurrenceSearch"
        searchParams={searchParams}
        className="g-flex g-items-center g-group g-px-4 lg:g-px-8"
      >
        <div className="g-flex g-flex-1 g-items-center g-gap-3 g-py-3 md:g-py-4">
          <div className="g-p-2 g-rounded-lg g-bg-primary-50 g-text-primary-600">
            <Icon className="g-h-5 g-w-5" />
          </div>
          <div className="g-flex-1 g-flex g-flex-col g-gap-1">
            <p className="g-text-sm g-text-gray-500">{label}</p>
            <h3 className="g-font-medium g-text-gray-900">“{queryString}”</h3>
          </div>
        </div>
        <div className="g-border-l g-border-gray-100 g-p-3 g-flex g-flex-none g-items-center">
          <MdChevronRight className="g-h-5 g-w-5 g-text-gray-400 group-hover:g-text-primary-500 g-transition-colors" />
        </div>
      </DynamicLink>
    </Card>
  );
}
