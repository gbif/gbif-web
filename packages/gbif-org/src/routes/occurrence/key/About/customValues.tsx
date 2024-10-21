import { PlainTextField, HtmlField, BasicField, CustomValueField } from '../properties';
import { FormattedDate, FormattedMessage } from 'react-intl';
import Properties, { Term as T, Value as V } from '@/components/properties';
import { DynamicLink } from '@/reactRouterPlugins';
import equal from 'fast-deep-equal/react';

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
          <PlainTextField term={termMap.institutionCode} showDetails={showAll} />
          <HtmlField term={termMap.institutionID} showDetails={showAll} />
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

function InstitutionKey({ occurrence }) {
  if (!occurrence?.institution?.key) return null;
  return (
    <BasicField label="occurrenceDetails.institutionGrSciColl">
      <DynamicLink to={`/institution/${occurrence?.institution?.key}`}>
        {occurrence.institution.name}
      </DynamicLink>
    </BasicField>
  );
}

function CollectionKey({ occurrence }) {
  if (!occurrence?.collection?.key) return null;
  return (
    <BasicField label="occurrenceDetails.collectionGrSciColl">
      <DynamicLink to={`/collection/${occurrence?.collection?.key}`}>
        {occurrence.collection.name}
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

function RecordedById({ termMap, showAll, occurrence }) {
  return <Agents label="occurrenceFieldNames.recordedByID" value={occurrence.recordedByIDs} />;
}

function IdentifiedById({ termMap, showAll, occurrence }) {
  return <Agents label="occurrenceFieldNames.identifiedByID" value={occurrence.identifiedByIDs} />;
}

function Agents({ label, value }) {
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

export function AgentSummary({ agent, ...props }) {
  const { person } = agent;
  return (
    <div className="g-rounded g-border g-bg-white dark:g-bg-slate-500 g-shadow-sm g-inline-flex g-overflow-hidden">
      <div className="g-flex-none">
        {person?.image?.value && (
          <img
            className="g-block"
            src={person?.image?.value}
            height={80}
            style={{ maxWidth: 80 }}
          />
        )}
      </div>
      <div className="g-flex-auto g-px-4 g-py-2 g-text-sm">
        <h4 className="g-font-bold">{person?.name?.value}</h4>
        {person?.birthDate?.value && (
          <div>
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
        <a href={agent.value}>{agent.value}</a>
      </div>
    </div>
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
