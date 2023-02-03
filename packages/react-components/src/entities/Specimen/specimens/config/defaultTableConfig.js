import React from 'react';
import { FormattedMessage } from 'react-intl';
import { MdDehaze } from 'react-icons/md';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';
import { Tooltip, TextButton } from '../../../../components';

export default (intl) => ({
  columns: [
    {
      trKey: 'filters.taxonKey.name',
      value: {
        key: 'distinctTaxa',
        formatter: ([value]) => value?.scientificName || 'Unknown',
        hideFalsy: true,
      },
      width: 'wide',
    },
    {
      trKey: 'filters.taxonRank.name',
      value: {
        key: 'distinctTaxa',
        formatter: ([value]) => value?.rank || 'Unknown',
        hideFalsy: true,
      },
    },
    {
      trKey: 'filters.eventType.name',
      value: {
        key: 'eventType.concept',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='eventType'
                values={[event.eventType.concept]}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: value }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    {
      trKey: 'filters.month.name',
      filterKey: 'month',
      value: {
        key: 'month',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='month' values={[event.month]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: `enums.month.${event.month}`,
                    }),
                  }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    {
      trKey: 'filters.year.name',
      filterKey: 'year',
      value: {
        key: 'year',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='year' values={[event.year]}>
                <span
                  dangerouslySetInnerHTML={{ __html: event.year }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
    },
    {
      name: 'measurementOrFactTypes',
      trKey: 'filters.measurementOrFactTypes.name',
      value: {
        key: 'measurementOrFactTypes',
        formatter: (value, item) => (
          <>{(value || []).slice(0, 10).join(', ')}</>
        ),
      },
    },
  ],
});
