import Properties, { Term as T, Value as V } from '@/components/properties';
import { OccurrenceAssociatedIdFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import equal from 'fast-deep-equal/react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { BasicField, CustomValueField, HtmlField, PlainTextField } from '../properties';

export function Institution({ termMap, showAll, occurrence }) {
  const code = termMap.institutionCode?.value;
  const id = termMap.institutionID?.value;
  const inst = occurrence.institution;
  if (!code && !id && !inst) return null;

  return (
    <>
      <T>
        <FormattedMessage id={`occurrenceDetails.institution`} defaultMessage={'Institution'} />
      </T>
      <V>
        <Properties horizontal={false}>
          <InstitutionKey {...{ occurrence }} />
          {!occurrence.institution && (
            <>
              <PlainTextField term={termMap.institutionCode} showDetails={showAll} />
              <HtmlField term={termMap.institutionID} showDetails={showAll} />
            </>
          )}
          <PlainTextField term={termMap.ownerInstitutionCode} showDetails={showAll} />
        </Properties>
      </V>
    </>
  );
}

export function Collection({ termMap, showAll, occurrence }) {
  const code = termMap.collectionCode?.value;
  const id = termMap.collectionID?.value;
  const inst = occurrence.collection;
  if (!code && !id && !inst) return null;
  return (
    <>
      <T>
        <FormattedMessage id={`occurrenceDetails.collection`} defaultMessage={'Collection'} />
      </T>
      <V>
        <Properties horizontal={false}>
          <CollectionKey {...{ occurrence }} />
          <PlainTextField term={termMap.collectionCode} showDetails={showAll} />
          <HtmlField term={termMap.collectionID} showDetails={showAll} />
        </Properties>
      </V>
    </>
  );
}

export function InstitutionKey({ occurrence }) {
  if (!occurrence?.institution?.key) return null;
  return (
    <BasicField label="occurrenceDetails.institutionGrSciColl">
      <DynamicLink
        className="g-underline"
        to={`/institution/${occurrence?.institution?.key}`}
        pageId="institutionKey"
        variables={{ key: occurrence?.institution?.key }}
      >
        {occurrence.institution.name}
      </DynamicLink>
    </BasicField>
  );
}

export function CollectionKey({ occurrence }) {
  if (!occurrence?.collection?.key) return null;
  return (
    <BasicField label="occurrenceDetails.collectionGrSciColl">
      <DynamicLink
        className="g-underline"
        to={`/collection/${occurrence?.collection?.key}`}
        pageId="collectionKey"
        variables={{ key: occurrence?.collection?.key }}
      >
        {occurrence.collection.name}
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

export function ScientificName({ termMap, showAll, occurrence }) {
  return (
    <CustomValueField term={termMap.scientificName} showDetails={showAll}>
      <span
        dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }}
      />
    </CustomValueField>
  );
}

export function AcceptedScientificName({ termMap, showAll, occurrence }) {
  if (!occurrence?.gbifClassification?.synonym) return null;
  return (
    <CustomValueField term={termMap.acceptedScientificName} showDetails={showAll}>
      <span
        dangerouslySetInnerHTML={{
          __html: occurrence.gbifClassification.acceptedUsage.formattedName,
        }}
      />
    </CustomValueField>
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

function Agents({ label, value }: { label: string; value: OccurrenceAssociatedIdFragment[] }) {
  if (!value?.[0]) return null;
  return (
    <BasicField label={label}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {value.map((x) => {
          if (!x.person) {
            return <li key={x.value}>{x.value}</li>;
          }
          return (
            <li key={x.value} style={{ marginBottom: 4 }}>
              <AgentSummary agent={x} />
            </li>
          );
        })}
      </ul>
    </BasicField>
  );
}

export function DynamicProperties({ termMap }) {
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

export function AgentSummary({ agent }: { agent: OccurrenceAssociatedIdFragment }) {
  const { person } = agent;
  return (
    <div className="g-rounded g-border g-bg-white g-overflow-hidden g-shadow-sm g-flex g-flex-wrap">
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
