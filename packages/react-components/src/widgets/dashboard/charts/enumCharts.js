import { jsx, css } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import monthEnum from '../../../enums/basic/month.json';
import { EnumChartGenerator } from './EnumChartGenerator';

export function Licenses({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    // enumKeys: licenseEnum,
    translationTemplate: 'enums.license.{key}',
    fieldName: 'license',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    title: <FormattedMessage id="filters.license.name" defaultMessage="Licenses" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    messages: ['dashboard.notVocabularyWarning']
  }} {...props} />
}

export function BasisOfRecord({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    // enumKeys: basisOfRecordEnum,
    fieldName: 'basisOfRecord',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    title: <FormattedMessage id="filters.basisOfRecord.name" defaultMessage="Basis of record" />,
    subtitleKey: "dashboard.numberOfOccurrences"
  }} {...props} />
}

export function Months({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    enumKeys: monthEnum,
    fieldName: 'month',
    facetSize: 12,
    disableUnknown: false,
    showUnknownInChart: true,
    disableOther: true,
    title: <FormattedMessage id="filters.month.name" defaultMessage="Month" />,
    subtitleKey: "dashboard.numberOfOccurrences"
  }} {...props} />
}

export function OccurrenceIssue({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'issue',
    translationTemplate: 'enums.occurrenceIssue.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['TABLE'],
    title: <FormattedMessage id="filters.occurrenceIssue.name" defaultMessage="Issues" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function Country({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'countryCode',
    filterKey: 'country',
    translationTemplate: 'enums.countryCode.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['TABLE'],
    title: <FormattedMessage id="filters.country.name" defaultMessage="Country" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function IucnCounts({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'iucnRedListCategory',
    translationTemplate: 'enums.iucnRedListCategory.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['PIE', 'TABLE', 'COLUMN'],
    title: <FormattedMessage id="filters.iucnRedListCategory.name" defaultMessage="iucnRedListCategory" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function LiteratureTopics({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'topics',
    translationTemplate: 'enums.topics.{key}',
    facetSize: 50,
    disableOther: true,
    disableUnknown: true,
    options: ['PIE'],
    searchType: 'literatureSearch',
    title: <FormattedMessage id="filters.topics.name" defaultMessage="Topics" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function LiteratureType({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'literatureType',
    translationTemplate: 'enums.literatureType.{key}',
    facetSize: 50,
    disableOther: true,
    disableUnknown: true,
    options: ['PIE'],
    searchType: 'literatureSearch',
    title: <FormattedMessage id="filters.literatureType.name" defaultMessage="Type" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function LiteratureRelevance({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'relevance',
    translationTemplate: 'enums.relevance.{key}',
    facetSize: 50,
    disableOther: true,
    disableUnknown: true,
    options: ['PIE'],
    searchType: 'literatureSearch',
    title: <FormattedMessage id="filters.relevance.name" defaultMessage="Relevance" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function LiteratureCountriesOfResearcher({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'countriesOfResearcher',
    translationTemplate: 'enums.countryCode.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['TABLE', 'PIE', 'COLUMN'],
    searchType: 'literatureSearch',
    title: <FormattedMessage id="filters.countriesOfResearcher.name" defaultMessage="countriesOfResearcher" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}

export function LiteratureCountriesOfCoverage({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <EnumChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'countriesOfCoverage',
    translationTemplate: 'enums.countryCode.{key}',
    facetSize: 10,
    disableOther: true,
    disableUnknown: true,
    options: ['TABLE', 'PIE', 'COLUMN'],
    searchType: 'literatureSearch',
    title: <FormattedMessage id="filters.countriesOfCoverage.name" defaultMessage="countriesOfCoverage" />,
    subtitleKey: "dashboard.numberOfOccurrences",
  }} {...props} />
}
