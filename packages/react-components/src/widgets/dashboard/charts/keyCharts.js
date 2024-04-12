import React, { useContext } from 'react';
import { ResourceLink } from '../../../components';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { KeyChartGenerator } from './KeyChartGenerator';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';

export function Datasets({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'datasetKey',
    disableUnknown: true,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `dataset {title}`,
    title: <FormattedMessage id="filters.datasetKey.name" defaultMessage="Dataset" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="datasetKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { datasetKey: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function Publishers({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'publishingOrg',
    disableUnknown: true,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `publisher {title}`,
    title: <FormattedMessage id="filters.publisherKey.name" defaultMessage="Publisher" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="publisherKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { publishingOrg: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function HostingOrganizations({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'hostingOrganizationKey',
    disableUnknown: true,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `publisher {title}`,
    title: <FormattedMessage id="filters.hostingOrganizationKey.name" defaultMessage="Hosting organization" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="publisherKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          filter: { hostingOrganizationKey: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function Collections({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'collectionKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `collection {title: name}`,
    title: <FormattedMessage id="filters.collectionKey.name" defaultMessage="Dataset" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="collectionKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { collectionKey: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function Institutions({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'institutionKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `institution {title: name}`,
    title: <FormattedMessage id="filters.institutionKey.name" defaultMessage="Institution" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="institutionKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { institutionKey: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function Networks({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'networkKey',
    disableUnknown: false,
    disableOther: false,
    facetSize: 10,
    gqlEntity: `network {title}`,
    title: <FormattedMessage id="filters.networkKey.name" defaultMessage="Network" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="networkKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { networkKey: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function EstablishmentMeans({
  predicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const localeContext = useContext(LocaleContext);
  const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';

  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'establishmentMeans',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    gqlEntity: `concept {title: uiLabel(language: "${vocabularyLocale}")}`,
    title: <FormattedMessage id="filters.establishmentMeans.name" defaultMessage="establishmentMeans" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: x?.entity?.title,
          count: x.count,
          description: x.entity.description,
          filter: { establishmentMeans: [x.key] },
        }
      });
    }
  }} {...props} />
}

export function Synonyms({
  predicate: providedPredicate,
  detailsRoute,
  currentFilter = {}, //excluding root predicate
  ...props
}) {
  const predicate = {
    type: 'and',
    predicates: [
      providedPredicate,
      {
        type: 'equals',
        key: 'gbifClassification_synonym',
        value: true
      }
    ]
  }
  return <KeyChartGenerator {...{
    predicate, detailsRoute, currentFilter,
    fieldName: 'gbifClassification_usage_key',
    disableUnknown: true,
    disableOther: true,
    facetSize: 10,
    options: ['TABLE'],
    gqlEntity: `taxon {
      title: scientificName
      accepted
      acceptedKey
    }`,
    title: <FormattedMessage id="dashboard.synonyms" defaultMessage="Synonyms" />,
    subtitleKey: "dashboard.numberOfOccurrences",
    transform: data => {
      return data?.search?.facet?.results?.map(x => {
        return {
          key: x.key,
          title: <span>{x?.entity?.title} <ResourceLink discreet type="taxonKey" id={x.key}><MdLink /></ResourceLink></span>,
          plainTextTitle: x?.entity?.title,
          count: x.count,
          filter: { taxonKey: [x.key] },
          description: <div>Accepted name: <span>{x?.entity?.accepted} <ResourceLink discreet type="taxonKey" id={x?.entity?.acceptedKey}><MdLink /></ResourceLink></span></div>
        }
      });
    }
  }} {...props} />
}

// export function LiteratureTopics({
//   predicate,
//   detailsRoute,
//   currentFilter = {}, //excluding root predicate
//   ...props
// }) {
//   const localeContext = useContext(LocaleContext);
//   const vocabularyLocale = localeContext?.localeMap?.vocabulary || 'en';

//   return <KeyChartGenerator {...{
//     predicate, detailsRoute, currentFilter,
//     fieldName: 'topics',
//     disableUnknown: true,
//     disableOther: true,
//     facetSize: 10,
//     searchType: 'literatureSearch',
//     title: <FormattedMessage id="filters.topics.name" defaultMessage="topics" />,
//     subtitleKey: "dashboard.numberOfOccurrences",
//     transform: data => {
//       return data?.literatureSearch?.facet?.results?.map(x => {
//         return {
//           key: x.key,
//           title: 'sdf',//x?.key,
//           count: x.count,
//           description: x.entity.description,
//           filter: { must: { topics: [x.key] } },
//         }
//       });
//     }
//   }} {...props} />
// }