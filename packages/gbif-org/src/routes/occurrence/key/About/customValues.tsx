import { Term as T, Value as V } from '@/components/properties';
import {
  OccurrenceQuery,
  PersonKeyQuery,
  PersonKeyQueryVariables,
  SlowOccurrenceKeyQuery,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import equal from 'fast-deep-equal/react';
import { MdLink } from 'react-icons/md';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { BasicField } from '../properties';
import { useConfig } from '@/config/config';
import { BulletList } from '@/components/bulletList';

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
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {value.map((x) => (
          <li key={x.value}>
            <AgentSummary agent={x} />
          </li>
        ))}
      </ul>
    </BasicField>
  );
}

export function DynamicProperties({
  termMap,
  slowOccurrence,
}: {
  termMap: any;
  slowOccurrence?: any;
}) {
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
      {slowOccurrence?.localContext?.[0]?.name && slowOccurrence?.localContext?.[0]?.img_url && (
        <>
          <T>
            <img
              style={{ width: 32, height: 32, marginRight: 8 }}
              src={slowOccurrence.localContext[0].img_url}
              alt={slowOccurrence.localContext[0].name}
              title={slowOccurrence.localContext[0].name}
            />
          </T>
          <V>
            <h5 className="g-font-bold">
              {slowOccurrence.localContext[0].name}{' '}
              <a href={slowOccurrence.localContext[0].notice_page} target="_blank" rel="noreferrer">
                <MdLink />
              </a>
            </h5>
            {slowOccurrence.localContext[0]?.default_text}
          </V>
        </>
      )}
    </>
  );
}

export function LocalContext({ localContext }: { localContext?: any }) {
  const config = useConfig();
  const showLocalContext = config.experimentalFeatures.localContextEnabled;
  if (!localContext?.notice || !showLocalContext) return null;

  const { project_page, title, description } = localContext;
  const items = (localContext?.notice ?? [])?.filter(
    (c) => c && c.name && c.img_url && c.default_text
  );
  if (items.length === 0) return null;

  return (
    <>
      <T>
        <FormattedMessage id={`dataset.localContext`} defaultMessage={'Local context'} />
      </T>

      <V>
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
        <div className="g-text-sm g-text-slate-600 g-mt-1 g-mb-2">{description}</div>
        <ul>
          {items.map((localContext) => (
            <li className="g-inline-block">
              <img
                className="g-me-2 g-w-6 g-h-6"
                src={localContext.img_url}
                alt={localContext.name}
                title={localContext.name}
              />
            </li>
          ))}
        </ul>
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
  // ignore errors and just fallback to the raw value - no need to notify anyone
  if (!data?.person || loading || error) return agent.value;
  const { person } = data;

  return (
    <div className="g-rounded g-border g-border-solid g-bg-white g-overflow-hidden g-shadow-sm g-flex g-flex-wrap">
      <div className="g-flex-none">
        {person?.image?.value && <img className="g-block g-max-w-16" src={person?.image?.value} />}
      </div>
      <div className="g-flex-auto g-p-2">
        <h4 className="g-m-0 g-mb-1">{person?.name?.value}</h4>
        {person?.birthDate?.value && (
          <div className="g-mb-1">
            <FormattedDate
              value={person?.birthDate?.value}
              year="numeric"
              month="long"
              day="2-digit"
            />
            {person?.deathDate?.value && (
              <span>
                {' '}
                -{' '}
                <FormattedDate
                  value={person?.deathDate?.value}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />
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
