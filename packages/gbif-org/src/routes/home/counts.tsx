// import { useCount } from '@/components/count';
import { CountProps, useCount } from '@/components/count';
import { HomePageCountIconsFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { FormattedNumber } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment HomePageCountIcons on Home {
    occurrenceIcon {
      file {
        url
      }
    }
    datasetIcon {
      file {
        url
      }
    }
    publisherIcon {
      file {
        url
      }
    }
    literatureIcon {
      file {
        url
      }
    }
  }
`);

type Props = {
  iconData: HomePageCountIconsFragment;
};

export function HomePageCounts({ iconData }: Props) {
  return (
    <div className="g-grid g-grid-cols-1 sm:g-grid-cols-2 lg:g-grid-cols-4 g-gap-8 g-max-w-6xl g-m-auto g-px-10 g-py-16">
      <DynamicLink pageId="occurrenceSearch" searchParams={{ occurrenceStatus: 'PRESENT' }}>
        <CountItem
          icon={iconData.occurrenceIcon?.file.url}
          defaultCount={3000000000}
          label="Occurrence records"
          countOptions={{
            v1Endpoint: '/occurrence/search',
            params: {
              occurrenceStatus: 'PRESENT',
            },
          }}
        />
      </DynamicLink>

      <DynamicLink pageId="datasetSearch">
        <CountItem
          icon={iconData.datasetIcon?.file.url}
          defaultCount={100000}
          label="Datasets"
          countOptions={{
            v1Endpoint: '/dataset/search',
          }}
        />
      </DynamicLink>

      <DynamicLink pageId="publisherSearch">
        <CountItem
          icon={iconData.publisherIcon?.file.url}
          defaultCount={2400}
          label="Publishing institutions"
          countOptions={{
            v1Endpoint: '/organization/count',
            responseIsNumber: true,
          }}
        />
      </DynamicLink>

      <DynamicLink
        pageId="literatureSearch"
        searchParams={{ literatureType: 'journal', relevance: 'GBIF_USED', peerReview: 'true' }}
      >
        <CountItem
          icon={iconData.literatureIcon?.file.url}
          defaultCount={12000}
          label="Peer-reviewed papers using data"
          countOptions={{
            v1Endpoint: '/literature/search',
            params: {
              literatureType: 'journal',
              relevance: 'GBIF_USED',
              peerReview: 'true',
            },
          }}
        />
      </DynamicLink>
    </div>
  );
}

function CountItem({
  icon,
  countOptions,
  defaultCount,
  label,
}: {
  icon?: string;
  defaultCount: number;
  label: React.ReactNode;
  countOptions: CountProps;
}) {
  const { count } = useCount(countOptions);

  return (
    <div className="g-flex g-flex-col g-items-center g-flex-1">
      <img className="g-w-28" src={icon} />
      <span
        className={cn('g-text-3xl g-font-medium g-text-gray-600 dark:g-text-slate-200', {
          'g-opacity-50': count == null,
        })}
      >
        <FormattedNumber value={count ?? defaultCount} />
      </span>
      <span className="g-pt-2 g-text-lg g-text-gray-700 g-text-center">{label}</span>
    </div>
  );
}
