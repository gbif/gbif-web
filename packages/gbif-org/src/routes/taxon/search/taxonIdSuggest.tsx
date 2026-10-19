import { SuggestFnProps, SuggestionItem, SuggestResponseType } from '@/components/filters/suggest';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { apiConstants } from '@/config/apiConstants';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { TaxonSearchMetadata } from '@/contexts/search';
import { FormattedMessage } from 'react-intl';

type TaxonIdSuggestionItem = SuggestionItem & { taxonomicStatus?: string; context?: string };

function TaxonIdSuggestLabel(item: TaxonIdSuggestionItem): React.ReactNode {
  return (
    <div>
      {item.taxonomicStatus !== 'ACCEPTED' && (
        <SimpleTooltip
          title={
            <span>
              <FormattedMessage id={`enums.taxonomicStatus.${item.taxonomicStatus}`} />
            </span>
          }
        >
          <span
            style={{
              display: 'inline-block',
              marginInlineEnd: 8,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: 'orange',
            }}
          ></span>
        </SimpleTooltip>
      )}
      {item.title}
      <div className="g-text-sm g-text-slate-500">{item.context}</div>
    </div>
  );
}

export const taxonIdSuggest = {
  render: TaxonIdSuggestLabel,
  getSuggestions: ({ q, searchContext, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const datasetKey =
      (searchContext as TaxonSearchMetadata)?.checklistKey ?? siteConfig?.defaultChecklistKey;
    const { cancel, promise } = fetchWithCancel(
      `${apiConstants.taxonApi}/suggest/${datasetKey}?limit=20&q=${q}`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map(
          (item: {
            taxonID: string;
            scientificName: string;
            taxonomicStatus: string;
            context: string;
          }) => ({
            ...item,
            key: item?.taxonID,
            title: item?.scientificName,
          })
        );
      });
    return { cancel, promise: result };
  },
};
