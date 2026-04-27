import { SuggestFnProps, SuggestionItem, SuggestResponseType } from '@/components/filters/suggest';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { SuggestConfig, TaxonDetailsLabel } from '@/utils/suggestEndpoints';
import { FormattedMessage } from 'react-intl';

function TaxonIdSuggestLabel(item: SuggestionItem): React.ReactNode {
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
              marginRight: 8,
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

export const taxonIdSuggest: SuggestConfig = {
  render: TaxonIdSuggestLabel,
  getSuggestions: ({ q, siteConfig, searchContext }: SuggestFnProps): SuggestResponseType => {
    const datasetKey =
      searchContext?.scope?.datasetKey ?? import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v2Endpoint}/taxon/suggest/${datasetKey}?limit=20&q=${q}`
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

export const taxonKeySuggest = {
  render: TaxonIdSuggestLabel,
  getSuggestions: ({ q, siteConfig }: SuggestFnProps): SuggestResponseType => {
    const datasetKey = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v2Endpoint}/taxon/suggest/${datasetKey}?limit=20&q=${q}`
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
