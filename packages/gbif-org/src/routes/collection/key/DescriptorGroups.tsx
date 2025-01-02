import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import useQuery from '@/hooks/useQuery';
import { useEffect, useState } from 'react';
import { BiSpreadsheet as SpreadSheetIcon } from 'react-icons/bi';
import { MdDownload } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

interface DescriptorGroupsProps {
  collectionKey: string;
}

export function DescriptorGroups({ collectionKey }: DescriptorGroupsProps) {
  const { data, loading, load } = useQuery(DESCRIPTOR_GROUPS, { lazyLoad: true });

  useEffect(() => {
    if (typeof collectionKey !== 'undefined') {
      const query = {
        variables: {
          key: collectionKey,
        },
      };
      load(query);
    }
  }, [collectionKey]);

  if (loading) return <CardListSkeleton />;
  /*   if (error) return <Card error={error} />; */
  if (!data || !data?.collection) return null;

  return data?.collection?.descriptorGroups?.results?.map((group, index) => (
    <DescriptorGroupPresentation
      last={index === data.collection.descriptorGroups.results.length - 1}
      key={group.key}
      collectionKey={collectionKey}
      groupKey={group.key}
      {...group}
    />
  ));
}

interface DescriptorGroupPresentationProps {
  collectionKey: string;
  groupKey: string;
  title: string;
  description: string;
  last: boolean;
}

function DescriptorGroupPresentation({
  collectionKey,
  groupKey,
  title,
  description,
  last,
}: DescriptorGroupPresentationProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div
      style={{ display: 'flex', borderBottom: last ? 'none' : '1px solid #eee', padding: '12px 0' }}
    >
      <div style={{ marginRight: 12, flex: '0 0 auto' }}>
        <div style={{ color: 'var(--color800)' }}>
          <SpreadSheetIcon style={{ fontSize: 18 }} />
        </div>
      </div>
      <div style={{ flex: '1 1 auto', width: 100 }}>
        <h4 style={{ marginTop: 0, marginBottom: 8 }}>{title}</h4>
        <div style={{ color: 'var(--color600)' }}>{description}</div>
        <div style={{ fontSize: 12, marginTop: 12 }}>
          <Button variant="default" asChild>
            <a
              href={`${
                import.meta.env.PUBLIC_API_V1
              }/grscicoll/collection/${collectionKey}/descriptorGroup/${groupKey}/export?format=CSV`}
              style={{ color: 'var(--color800)' }}
            >
              <MdDownload style={{ marginRight: 8 }} />
              <FormattedMessage id="phrases.download" />
            </a>
          </Button>

          <label>
            <Checkbox
              checked={showPreview}
              style={{ marginLeft: 16, marginRight: 4 }}
              onCheckedChange={(checked) => {
                setShowPreview(checked === true);
              }}
            />
            <FormattedMessage id="phrases.preview" />
          </label>
        </div>
        {showPreview && (
          <div style={{ marginTop: 12 }}>
            <Table collectionKey={collectionKey} groupKey={groupKey} />
          </div>
        )}
      </div>
    </div>
  );
}

interface TableProps {
  collectionKey: string;
  groupKey: string;
}

function Table({ collectionKey, groupKey }: TableProps) {
  const { data, error, loading, load } = useQuery(DESCRIPTOR_GROUP, { lazyLoad: true });

  useEffect(() => {
    if (typeof collectionKey !== 'undefined' && typeof groupKey !== 'undefined') {
      const query = {
        keepDataWhileLoading: true,
        variables: {
          key: groupKey,
          collectionKey: collectionKey,
          limit: 10,
          offset: 0,
        },
      };
      load(query);
    }
  }, [collectionKey, groupKey]);

  const hasResults = data?.collectionDescriptorGroup?.descriptors?.results?.length > 0;
  const keys = hasResults
    ? Object.keys(data?.collectionDescriptorGroup?.descriptors?.results[0].verbatim)
    : [];

  if (error) return <FormattedMessage id="phrases.failedToLoadData" />;

  const descriptors = data?.collectionDescriptorGroup?.descriptors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {!hasResults && <Skeleton />}
      {hasResults && (
        <div className="g-w-full g-max-w-full g-overflow-auto g-pb-2">
          <table className="gbif-table-style g-whitespace-nowrap g-text-sm">
            <thead>
              <tr>
                {keys.map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {descriptors.results.slice(0, 3).map((d) => (
                <tr key={d.key}>
                  {keys.map((k) => (
                    <td key={k}>{d.verbatim[k]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const DESCRIPTOR_GROUPS = `
    query DescriptorGroups($key: ID!) {
      collection(key: $key) {
      descriptorGroups(limit: 100) {
      results {
      key
        title
        description
      }
    }
  }
}
    `;

const DESCRIPTOR_GROUP = `
query($key: ID!, $collectionKey: ID!, $limit: Int, $offset: Int) {
  collectionDescriptorGroup(key: $key, collectionKey: $collectionKey) {
  title
    description
    descriptors(limit: $limit, offset: $offset) {
      count
      offset
      limit
      results {
      key
        verbatim
      }
    }
  }
}
    `;
