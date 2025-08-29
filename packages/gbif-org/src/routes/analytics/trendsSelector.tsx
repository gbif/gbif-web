import countries from '@/enums/basic/country.json';
import regions from '@/enums/basic/gbifRegion.json';
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

        if (countries.includes(targetValue)) {
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
        {countries.map((country) => (
          <option value={country} key={country}>
            <FormattedMessage id={`enums.countryCode.${country}`} />
          </option>
        ))}
      </optgroup>
    </select>
  );
}
