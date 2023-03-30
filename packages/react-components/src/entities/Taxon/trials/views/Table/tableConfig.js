import React from 'react';
import { FormattedMessage } from 'react-intl';
import { RiSideBarFill as OpenInSideBar } from 'react-icons/ri';
import { InlineFilterChip } from '../../../../../widgets/Filter/utils/FilterChip';
import { Tooltip, TextButton } from '../../../../../components';

export default (intl) => ({
  columns: [
    {
      trKey: 'filters.catalogNumber.name',
      value: {
        key: 'extensions.seedbank.accessionNumber',
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
    {
      trKey: 'extensions.seedbank.fields.testLengthInDays.name',
      filterKey: 'testLengthInDays',
      value: {
        key: 'extensions.seedbank.testLengthInDays',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='testLengthInDays' values={[value]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.testLengthInDays.unit',
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
      trKey: 'extensions.seedbank.fields.germinationRateInDays.name',
      filterKey: 'germinationRateInDays',
      value: {
        key: 'extensions.seedbank.germinationRateInDays',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='germinationRateInDays'
                values={[value]}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.germinationRateInDays.unit',
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
      trKey: 'extensions.seedbank.fields.numberTested.name',
      filterKey: 'numberGerminated',
      value: {
        key: 'extensions.seedbank.numberTested',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='numberTested' values={[value]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.numberTested.unit',
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
      trKey: 'extensions.seedbank.fields.numberEmpty.name',
      filterKey: 'numberEmpty',
      value: {
        key: 'extensions.seedbank.numberEmpty',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='numberEmpty' values={[value]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.numberEmpty.unit',
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
      trKey: 'extensions.seedbank.fields.numberFull.name',
      filterKey: 'numberGerminated',
      value: {
        key: 'extensions.seedbank.numberFull',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='numberFull' values={[value]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.numberFull.unit',
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
      trKey: 'extensions.seedbank.fields.numberGerminated.name',
      filterKey: 'numberGerminated',
      value: {
        key: 'extensions.seedbank.numberGerminated',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip filterName='numberGerminated' values={[value]}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.numberGerminated.unit',
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
      trKey: 'extensions.seedbank.fields.adjustedGerminationPercentage.name',
      filterKey: 'adjustedGerminationPercentage',
      value: {
        key: 'extensions.seedbank.adjustedGerminationPercentage',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='adjustedGerminationPercentage'
                values={[value]}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.adjustedGerminationPercentage.unit',
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
      trKey: 'extensions.seedbank.fields.viabilityPercentage.name',
      filterKey: 'viabilityPercentage',
      value: {
        key: 'extensions.seedbank.viabilityPercentage',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='viabilityPercentage'
                values={[value]}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.viabilityPercentage.unit',
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
      trKey: 'extensions.seedbank.fields.preTestProcessingNotes.name',
      filterKey: 'preTestProcessingNotes',
      value: {
        key: 'extensions.seedbank.preTestProcessingNotes',
        hideFalsy: true,
        formatter: (value, event) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <InlineFilterChip
                filterName='preTestProcessingNotes'
                values={[value]}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      value +
                      intl.formatMessage({
                        id: 'extensions.seedbank.fields.preTestProcessingNotes.unit',
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
  ],
});
