import React from 'react';
import { FormattedMessage } from 'react-intl';
import { RiSideBarFill as OpenInSideBar } from 'react-icons/ri';
import { InlineFilterChip } from '../../../../../widgets/Filter/utils/FilterChip';
import { Tooltip, TextButton } from '../../../../../components';

export default (intl) => ({
  columns: [
    // {
    //   trKey: 'filters.catalogNumber.name',
    //   value: {
    //     key: 'eventType',
    //     hideFalsy: true,
    //     formatter: (value, event) => (
    //       <div style={{ display: 'flex', alignItems: 'center' }}>
    //         <Tooltip
    //           placement='top'
    //           title={
    //             <span>
    //               <FormattedMessage id='filterSupport.viewDetails' />
    //             </span>
    //           }
    //         >
    //           <TextButton
    //             as='span'
    //             look='textHoverLinkColor'
    //             style={{ display: 'inline-flex', marginRight: 8 }}
    //           >
    //             <OpenInSideBar
    //               style={{ fontSize: '1.5em', marginRight: '.75em' }}
    //             />
    //           </TextButton>
    //         </Tooltip>
    //         {value.concept}
    //       </div>
    //     ),
    //   },
    // },
    {
      trKey: 'filters.catalogNumber.name',
      value: {
        key: 'extensions',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              placement='top'
              title={
                <span>
                  <FormattedMessage id='filterSupport.viewDetails' />
                </span>
              }
            >
              <TextButton
                as='span'
                look='textHoverLinkColor'
                style={{ display: 'inline-flex', marginRight: 8 }}
              >
                <OpenInSideBar
                  style={{ fontSize: '1.5em', marginRight: '.75em' }}
                />
              </TextButton>
            </Tooltip>
            {JSON.stringify(value.seedbank)}
          </div>
        ),
      },
    },
    {
      trKey: 'filters.eventID.name',
      value: {
        key: 'eventID',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip
              placement='top'
              title={
                <span>
                  <FormattedMessage id='filterSupport.viewDetails' />
                </span>
              }
            >
              <TextButton
                as='span'
                look='textHoverLinkColor'
                style={{ display: 'inline-flex', marginRight: 8 }}
              >
                <OpenInSideBar
                  style={{ fontSize: '1.5em', marginRight: '.75em' }}
                />
              </TextButton>
            </Tooltip>
            {value}
          </div>
        ),
      },
    },
    {
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey',
      value: {
        key: 'datasetKey',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='datasetKey'
                values={[event.datasetKey]}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: event.datasetTitle }}
                  data-loader
                ></span>
              </InlineFilterChip>
            </div>
          </div>
        ),
      },
      width: 'wide',
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
  ],
});
