import EmptyTab from '@/components/EmptyTab';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { useStringParam } from '@/hooks/useParam';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';
import { useDatasetKeyContext } from './datasetKey';
import DataPackageSections, { DataPackageGroup } from './dataPackage/sections';

const groupOptions: DataPackageGroup[] = ['explore', 'validation'];
const defaultGroup: DataPackageGroup = 'explore';

export function DatasetKeyDataPackage() {
  const { showDataPackageTab } = useDatasetKeyContext();
  if (showDataPackageTab) return <DataPackageTab />;
  return <EmptyTab />;
}

function DataPackageTab() {
  const { formatMessage } = useIntl();
  const { dataset } = useDatasetKeyLoaderData().data;

  const [group = defaultGroup, setGroup] = useStringParam({
    key: 'group',
    defaultValue: defaultGroup,
    hideDefault: true,
  });

  // an unknown group in the url should not leave the page without a selected sub tab
  const activeGroup = groupOptions.includes(group as DataPackageGroup)
    ? (group as DataPackageGroup)
    : defaultGroup;

  return (
    <ArticleContainer className="g-bg-slate-100 g-min-h-[70vh]">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* Mobile select dropdown */}
        <div className="g-mb-6 md:g-hidden">
          <label htmlFor="data-package-group-select" className="g-sr-only">
            <FormattedMessage id="dataset.dataPackageTab.selectGroup" />
          </label>
          <select
            id="data-package-group-select"
            value={activeGroup}
            onChange={(e) => setGroup(e.target.value)}
            className="g-w-full g-px-4 g-py-2 g-border g-border-slate-300 g-rounded-md g-bg-white g-text-base focus:g-outline-none focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-transparent"
          >
            {groupOptions.map((option) => (
              <option key={option} value={option}>
                {formatMessage({
                  id: `dataset.dataPackageTab.group.${option}`,
                })}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop button group */}
        <div className="g-hidden md:g-flex g-flex-wrap g-gap-2 g-mb-8">
          {groupOptions.map((option) => (
            <Button
              key={option}
              onClick={() => setGroup(option)}
              variant={activeGroup === option ? 'default' : 'plain'}
              className={cn({
                'g-bg-slate-200 g-border g-border-slate-300': activeGroup !== option,
              })}
            >
              <FormattedMessage id={`dataset.dataPackageTab.group.${option}`} />
            </Button>
          ))}
        </div>
        <ErrorBoundary
          type="BLOCK"
          className="g-mb-8"
          invalidateOn={`${dataset.key}, ${activeGroup}`}
        >
          <DataPackageSections group={activeGroup} />
        </ErrorBoundary>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
