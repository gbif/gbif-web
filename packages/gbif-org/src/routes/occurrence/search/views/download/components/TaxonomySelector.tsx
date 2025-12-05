import { useSupportedChecklists } from '@/hooks/useSupportedChecklists';
import { TaxonomyIcon } from '@/components/highlights';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormattedMessage } from 'react-intl';
import ExpandableSection from './ExpandableSection';
import { optionStyles } from './utils';

interface TaxonomySelectorProps {
  value: string;
  onChange: (taxonomy: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function TaxonomySelector({
  value,
  onChange,
  isExpanded,
  onToggle,
}: TaxonomySelectorProps) {
  const { checklists, loading } = useSupportedChecklists();

  return (
    <ExpandableSection
      icon={<TaxonomyIcon size={20} className="g-text-primary-600 g-flex-none" />}
      title={<FormattedMessage id="occurrenceDownloadFlow.taxonomySelector.title" />}
      description={<FormattedMessage id="occurrenceDownloadFlow.taxonomySelector.description" />}
      summary={checklists.find((x) => x.key === value)?.alias ?? ''}
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {!loading && (
        <RadioGroup value={value} onValueChange={onChange}>
          {checklists.map((checklist) => (
            <label key={checklist.key} className={optionStyles.optionCard}>
              <RadioGroupItem value={checklist.key} className="g-mt-1" />
              <div className={optionStyles.optionLabel}>
                <span className={optionStyles.optionTitle}>{checklist.title}</span>
                {checklist.isDefault && (
                  <p className={optionStyles.optionDescription}>
                    <FormattedMessage id="occurrenceDownloadFlow.taxonomySelector.defaultRecommended" />
                  </p>
                )}
              </div>
            </label>
          ))}
        </RadioGroup>
      )}
    </ExpandableSection>
  );
}
