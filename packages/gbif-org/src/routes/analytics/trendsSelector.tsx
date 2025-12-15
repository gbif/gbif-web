import regions from '@/enums/basic/gbifRegion.json';
import { useSortedCountries } from '@/hooks/useSortedCountries';
import { useI18n } from '@/reactRouterPlugins';
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

type Props = {
  value: string;
};

export function TrendsSelector({ value }: Props) {
  const { formatMessage } = useIntl();
  const { localizeLink } = useI18n();
  const navigate = useNavigate();
  const sortedCountries = useSortedCountries();

  return (
    <select
      value={value}
      className="g-border g-p-2 g-max-w-full"
      onChange={(e) => {
        const targetValue = e.target.value;
        if (targetValue === value) return;

        if (targetValue === 'GLOBAL') {
          navigate(localizeLink('/analytics/global'));
          return;
        }

        if (regions.includes(targetValue)) {
          navigate(localizeLink(`/analytics/region/${targetValue}`));
          return;
        }

        if (sortedCountries.some((country) => country.key === targetValue)) {
          navigate(localizeLink(`/country/${targetValue}/about#trends`));
          return;
        }
      }}
    >
      <option value="GLOBAL">
        <FormattedMessage id="trends.exploreGlobalTrends" />
      </option>
      <optgroup label={formatMessage({ id: 'trends.exploreByGbifRegion' })}>
        {regions.map((region) => (
          <option value={region} key={region}>
            <FormattedMessage id={`enums.gbifRegion.${region}`} />
          </option>
        ))}
      </optgroup>
      <optgroup label={formatMessage({ id: 'trends.exploreByCountry' })}>
        {sortedCountries.map((country) => (
          <option value={country.key} key={country.key}>
            {country.title}
          </option>
        ))}
      </optgroup>
    </select>
  );
}
