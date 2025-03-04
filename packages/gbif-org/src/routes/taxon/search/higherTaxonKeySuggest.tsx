import { SuggestFnProps, SuggestionItem, SuggestResponseType } from '@/components/filters/suggest';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { TaxonDetailsLabel } from '@/utils/suggestEndpoints';
import { FormattedMessage } from 'react-intl';

export const taxonKeySuggest = {
  render: (item: SuggestionItem) => {
    return (
      <div>
        {item.status !== 'ACCEPTED' && (
          <SimpleTooltip
            title={
              <span>
                <FormattedMessage id={`enums.taxonomicStatus.${item.status}`} />
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
        <div>
          <TaxonDetailsLabel {...item} />
        </div>
      </div>
    );
  },
  getSuggestions: ({ q, siteConfig, searchContext }: SuggestFnProps): SuggestResponseType => {
    const { cancel, promise } = fetchWithCancel(
      `${siteConfig.v1Endpoint}/species/suggest?limit=20&q=${q}${
        searchContext?.scope?.datasetKey?.[0]
          ? `&datasetKey=${searchContext.scope.datasetKey[0]}`
          : ''
      }`
    );
    const result = promise
      .then((res) => res.json())
      .then((data) => {
        return data.map((item: { key: string; scientificName: string }) => ({
          key: item?.key,
          title: item?.scientificName,
          ...item,
        }));
      });
    return { cancel, promise: result };
  },
};
