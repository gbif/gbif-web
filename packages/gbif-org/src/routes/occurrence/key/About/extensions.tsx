import Properties, { Term as T, Value as V } from '@/components/properties';
import { Card } from '@/components/ui/largeCard';
import { OccurrenceQuery } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Group } from './groups';

export function Preparation({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'preparation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preparation.name"
      id="preparation"
    />
  );
}

export function ResourceRelationship({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'resourceRelationship';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.resourceRelationship.name"
      id="resource-relationship"
    />
  );
}

export function Amplification({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'amplification';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.amplification.name"
      id="amplification"
    />
  );
}

export function Permit({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'permit';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.permit.name"
      id="permit"
    />
  );
}

export function Loan({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'loan';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.loan.name"
      id="loan"
    />
  );
}

export function Preservation({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'preservation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preservation.name"
      id="preservation"
    />
  );
}

export function MaterialSampleExt({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'materialSample';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.materialSample.name"
      id="material-sample"
    />
  );
}

export function Audubon({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'audubon';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.audubon.name"
      id="audubon"
    />
  );
}

export function DNADerivedData({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'dnaDerivedData';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.dnaDerivedData.name"
      id="dna-derived-data"
    />
  );
}

export function Cloning({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'cloning';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.cloning.name"
      id="cloning"
    />
  );
}

export function Reference({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'reference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.reference.name"
      id="reference"
    />
  );
}

export function EolReference({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'eolReference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.eolReference.name"
      id="eol-reference"
    />
  );
}

export function GermplasmAccession({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmAccession';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmAccession.name"
      id="germplasm-accession"
      updateToc={(visible) => updateToc('germplasm-accession', visible)}
    />
  );
}

export function GermplasmMeasurementScore({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'germplasmMeasurementScore';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementScore.name"
      id="germplasm-measurement-score"
    />
  );
}

export function GermplasmMeasurementTrait({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'germplasmMeasurementTrait';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrait.name"
      id="germplasm-measurement-trait"
    />
  );
}

export function GermplasmMeasurementTrial({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'germplasmMeasurementTrial';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrial.name"
      id="germplasm-measurement-trial"
    />
  );
}

export function IdentificationHistory({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'identification';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identification.name"
      id="identification"
    />
  );
}

export function Identifier({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'identifier';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identifier.name"
      id="identifier"
    />
  );
}

export function MeasurementOrFact({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'measurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.measurementOrFact.name"
      id="measurement-or-fact"
    />
  );
}

export function ExtendedMeasurementOrFact({
  occurrence,
}: {
  occurrence: OccurrenceQuery['occurrence'];
}) {
  const extensionName = 'extendedMeasurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.extendedMeasurementOrFact.name"
      id="extended-measurement-or-fact"
    />
  );
}

export function ChronometricAge({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'chronometricAge';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.chronometricAge.name"
      id="chronometric-age"
    />
  );
}

export function GelImage({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'gelImage';
  return (
    <GenericExtension
      {...{
        occurrence,
        extensionName,
        overwrites: {
          identifier: ({ item }) => (
            <div>
              <img src={item['identifier']} />
              <div>{item['identifier']}</div>
            </div>
          ),
        },
      }}
      label="occurrenceDetails.extensions.gelImage.name"
      id="gel-image"
    />
  );
}

function GenericExtension({
  occurrence,
  label,
  id,
  extensionName,
  overwrites,
  updateToc,
  ...props
}: {
  occurrence: OccurrenceQuery['occurrence'];
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  label: string;
  id: string;
  updateToc?: (visible: boolean) => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    updateToc && updateToc(visible);
  }, [visible]);

  const list = occurrence?.extensions?.[extensionName];
  if (!list || list.length === 0) {
    if (visible) setVisible(false);
    return null;
  } else {
    if (!visible) setVisible(true);
  }

  return (
    <Group label={label} id={id} className="g-pt-0 md:g-pt-0" {...props}>
      {list.length === 1 && (
        <GenericExtensionContent
          item={list[0]}
          extensionName={extensionName}
          overwrites={overwrites}
        />
      )}
      {list.length > 1 && (
        <div>
          <div style={{ fontSize: '12px' }}>{list.length} rows</div>
          {list.map((item, i) => (
            <ListCard key={i}>
              <GenericExtensionContent
                item={item}
                extensionName={extensionName}
                overwrites={overwrites}
                style={{ fontSize: '90%' }}
              />
            </ListCard>
          ))}
        </div>
      )}
    </Group>
  );
}

function GenericExtensionContent({
  item,
  extensionName,
  overwrites = {},
  style,
}: {
  item: any;
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  style?: React.CSSProperties;
}) {
  const fields = Object.keys(item);
  return (
    <Properties breakpoint={800} style={style}>
      {fields.map((field) => {
        if (overwrites[field]) {
          return (
            <ExtField key={field} {...{ item, extensionName, field }}>
              {overwrites[field]({ item })}
            </ExtField>
          );
        } else {
          return <ExtField key={field} {...{ item, extensionName, field }} />;
        }
      })}
    </Properties>
  );
}

function ExtField({
  item,
  extensionName,
  field,
  children,
  ...props
}: {
  item: any;
  extensionName: string;
  field: string;
  children?: React.ReactNode;
}) {
  if (!item[field]) return null;
  return (
    <>
      <T>
        <FormattedMessage
          id={`occurrenceDetails.extensions.${extensionName}.properties.${field}`}
          defaultMessage={getDefaultMessage(field)}
        />
      </T>
      <V>{children ? children : item[field]}</V>
    </>
  );
}

function ListCard(props) {
  return <Card className="g-mb-2 g-p-4 " {...props} />;
}

function getDefaultMessage(field: string) {
  return field.split('/').pop();
}
