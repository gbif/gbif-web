import { AutomaticPropertyValue, Term as T, Value as V } from '@/components/properties';
import {
  OccurrenceQuery,
  OccurrenceTermFragment,
  PersonKeyQuery,
  PersonKeyQueryVariables,
  PredicateType,
  SlowOccurrenceKeyQuery,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import equal from 'fast-deep-equal/react';
import { FormattedMessage } from 'react-intl';
import { LongDate } from '@/components/dateFormats';
import { BasicField, Field } from '../properties';
import { useConfig } from '@/config/config';
import { truncate } from '@/utils/truncate';
import { Img } from '@/components/Img';
import { SiteOccurrenceCount } from '@/components/count';

export function InstitutionKey({
  occurrence,
  slowOccurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  slowOccurrence: SlowOccurrenceKeyQuery['occurrence'];
}) {
  if (!occurrence?.institutionKey) return null;
  return (
    <BasicField label="occurrenceDetails.institutionGrSciColl">
      <DynamicLink
        className="g-underline"
        to={`/institution/${occurrence?.institutionKey}`}
        pageId="institutionKey"
        variables={{ key: occurrence?.institutionKey }}
      >
        {slowOccurrence?.institution?.name ?? occurrence.institutionKey}
      </DynamicLink>
    </BasicField>
  );
}

export function CollectionKey({
  occurrence,
  slowOccurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  slowOccurrence: SlowOccurrenceKeyQuery['occurrence'];
}) {
  if (!occurrence?.collectionKey) return null;
  return (
    <BasicField label="occurrenceDetails.collectionGrSciColl">
      <DynamicLink
        className="g-underline"
        to={`/collection/${occurrence?.collectionKey}`}
        pageId="collectionKey"
        variables={{ key: occurrence?.collectionKey }}
      >
        {slowOccurrence?.collection?.name ?? occurrence.collectionKey}
      </DynamicLink>
    </BasicField>
  );
}

export function DatasetKey({ occurrence }) {
  return (
    <BasicField label="occurrenceDetails.dataset">
      <DynamicLink
        className="g-underline"
        to={`/dataset/${occurrence.datasetKey}`}
        pageId="datasetKey"
        variables={{ key: occurrence.datasetKey }}
      >
        {occurrence.datasetTitle}
      </DynamicLink>
    </BasicField>
  );
}

export function AgentIds({ termMap, showAll, occurrence }) {
  if (equal(occurrence.recordedByIDs, occurrence.identifiedByIDs)) {
    return (
      <Agents label="occurrenceDetails.recordedAndIdentifiedBy" value={occurrence.recordedByIDs} />
    );
  } else {
    return (
      <>
        <RecordedById {...{ showAll, termMap, occurrence }} />
        <IdentifiedById {...{ showAll, termMap, occurrence }} />
      </>
    );
  }
}

export function RecordedById({ occurrence }) {
  return <Agents label="occurrenceFieldNames.recordedByID" value={occurrence.recordedByIDs} />;
}

export function IdentifiedById({ occurrence }) {
  return <Agents label="occurrenceFieldNames.identifiedByID" value={occurrence.identifiedByIDs} />;
}

function Agents({ label, value }: { label: string; value: { type: string; value: string }[] }) {
  if (!value?.[0]) return null;
  return (
    <BasicField label={label}>
      <ul className="g-list-none g-p-0 g-m-0 g-flex g-flex-col g-gap-3">
        {value.map((x) => (
          <li key={x.value}>
            <AgentSummary agent={x} />
          </li>
        ))}
      </ul>
    </BasicField>
  );
}

export function DynamicProperties({ termMap }: { termMap: any }) {
  const value = termMap?.dynamicProperties?.value;
  if (!value) return null;

  let content;
  try {
    const jsonValue = JSON.parse(value);
    content = (
      <pre className="g-bg-slate-100 g-overflow-auto g-p-2">
        {JSON.stringify(jsonValue, null, 2)}
      </pre>
    );
  } catch (err) {
    //ignore any errors
    content = value;
  }
  return (
    <>
      <T>
        <FormattedMessage
          id={`occurrenceFieldNames.dynamicProperties`}
          defaultMessage={'Dynamic properties'}
        />
      </T>
      <V style={{ overflow: 'hidden' }}>{content}</V>
    </>
  );
}

export function LocalContexts({ localContexts }: { localContexts?: any }) {
  const config = useConfig();
  const showLocalContext = config.experimentalFeatures.localContextEnabled;
  if (!localContexts || localContexts?.length === 0 || !showLocalContext) return null;

  return (
    <>
      <T>
        <FormattedMessage id={`dataset.localContexts`} defaultMessage={'Local contexts'} />
      </T>
      <V>
        {localContexts.map((localContext) => {
          const { project_page, title, communityName } = localContext;
          const notices = (localContext?.notice ?? [])?.filter((n) => n && n.name && n.img_url);
          const labels = (localContext?.labels ?? [])?.filter((l) => l && l.name && l.img_url);

          return (
            <div key={project_page}>
              <h5 className="g-flex g-items-center g-gap-1">
                <a
                  href={project_page}
                  target="_blank"
                  rel="noreferrer"
                  className="g-flex g-items-center g-underline"
                >
                  {title}
                </a>
              </h5>
              {notices.length > 0 && (
                <ul className="g-pt-2">
                  {notices.map((notice, i) => (
                    <li className="g-flex g-items-center g-mb-2" key={`${notice.name}-${i}`}>
                      <img
                        className="g-me-2 g-w-6"
                        src={notice.img_url}
                        alt={notice.name}
                        title={notice.name}
                      />
                      <p className="g-text-sm">{notice.name}</p>
                    </li>
                  ))}
                </ul>
              )}
              {labels.length > 0 && (
                <>
                  {communityName && (
                    <p className="g-mt-2 g-text-sm g-text-slate-600">
                      <FormattedMessage
                        id="dataset.localContextsLabelsAppliedBy"
                        defaultMessage="{count, plural, one{Label} other{Labels}} applied by {communityName}"
                        values={{
                          count: labels.length,
                          communityName: communityName,
                        }}
                      />
                    </p>
                  )}
                  <ul className="g-pt-2">
                    {labels.map((label, i) => (
                      <li className="g-flex g-items-center g-mb-2" key={`${label.name}-${i}`}>
                        <img
                          className="g-me-2 g-w-6"
                          src={label.img_url}
                          alt={label.name}
                          title={label.name}
                        />
                        <p className="g-text-sm">{label.name}</p>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        })}
      </V>
    </>
  );
}

const PERSON_QUERY = /* GraphQL */ `
  query PersonKey($type: String!, $value: String!) {
    person(type: $type, value: $value) {
      name
      birthDate
      deathDate
      image
    }
  }
`;

export function AgentSummary({ agent }: { agent: { type: string; value: string } }) {
  const { data, loading, error } = useQuery<PersonKeyQuery, PersonKeyQueryVariables>(PERSON_QUERY, {
    throwAllErrors: false,
    variables: { type: agent.type, value: agent.value },
  });

  if (!data?.person || loading || error) {
    // Display raw text links as anchors if they are valid URLs
    if (agent.value && (agent.value.startsWith('http://') || agent.value.startsWith('https://'))) {
      return (
        <a className="g-underline" href={agent.value}>
          {agent.value}
        </a>
      );
    }

    // ignore errors and just fallback to the raw value - no need to notify anyone
    return agent.value;
  }
  const { person } = data;

  return (
    <div className="g-rounded g-border g-border-solid g-bg-white g-overflow-hidden g-shadow-sm g-flex g-flex-wrap">
      <div className="g-flex-none">
        {person?.image?.value && (
          <Img
            className="g-block g-max-w-16"
            src={person?.image?.value}
            failedClassName="g-h-16 g-w-16 g-bg-slate-200"
          />
        )}
      </div>
      <div className="g-flex-auto g-p-2">
        <h4 className="g-m-0 g-mb-1">{person?.name?.value}</h4>
        {person?.birthDate?.value && (
          <div className="g-mb-1">
            <LongDate value={person?.birthDate?.value} />
            {person?.deathDate?.value && (
              <span>
                {' '}
                -{' '}
                <LongDate value={person?.deathDate?.value} />
              </span>
            )}
          </div>
        )}
        {agent.value && (
          <a className="g-underline" href={agent.value}>
            {agent.value}
          </a>
        )}
      </div>
    </div>
  );
}

export function OccurrenceSearchField(props: {
  term: OccurrenceTermFragment;
  showDetails?: boolean;
  filterKey: string;
  filterValue: string;
  onlyShowVerbatim?: boolean;
  occurrence: OccurrenceQuery['occurrence'];
}) {
  if (!props.term) return null;
  const { value } = props.term;
  return (
    <Field {...props}>
      <AutomaticPropertyValue value={value} />
      <DynamicLink
        className="g-ms-2 g-text-sm g-bg-slate-200 g-rounded g-px-1 g-inline-flex g-items-center g-gap-1 hover:g-bg-primary-200"
        pageId="occurrenceSearch"
        searchParams={{
          [props.filterKey]: [props.filterValue],
          datasetKey: [props.occurrence?.datasetKey],
        }}
      >
        <SiteOccurrenceCount
          message="counts.nOccurrences"
          predicate={{
            type: PredicateType.And,
            predicates: [
              {
                type: PredicateType.Equals,
                key: props.filterKey,
                value: props.filterValue,
              },
              {
                type: PredicateType.Equals,
                key: 'datasetKey',
                value: props.occurrence?.datasetKey,
              },
            ],
          }}
        />
      </DynamicLink>
    </Field>
  );
}
