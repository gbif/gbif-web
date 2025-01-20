import Properties, { Term as T, Value as V } from '@/components/properties';
import { Card } from '@/components/ui/largeCard';
import { OccurrenceQuery } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Group } from './groups';

export function Preparation({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'preparation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preparation.name"
      id="preparation"
      updateToc={updateToc}
    />
  );
}

export function ResourceRelationship({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'resourceRelationship';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.resourceRelationship.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function Amplification({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'amplification';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.amplification.name"
      id="amplification"
      updateToc={updateToc}
    />
  );
}

export function Permit({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'permit';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.permit.name"
      id="permit"
      updateToc={updateToc}
    />
  );
}

export function Loan({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'loan';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.loan.name"
      id="loan"
      updateToc={updateToc}
    />
  );
}

export function Preservation({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'preservation';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.preservation.name"
      id="preservation"
      updateToc={updateToc}
    />
  );
}

export function MaterialSampleExt({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'materialSample';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.materialSample.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function Audubon({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'audubon';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.audubon.name"
      id="audubon"
      updateToc={updateToc}
    />
  );
}

export function DNADerivedData({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'dnaDerivedData';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.dnaDerivedData.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function Cloning({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'cloning';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.cloning.name"
      id="cloning"
      updateToc={updateToc}
    />
  );
}

export function Reference({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'reference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.reference.name"
      id="reference"
      updateToc={updateToc}
    />
  );
}

export function EolReference({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'eolReference';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.eolReference.name"
      id={extensionName}
      updateToc={updateToc}
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
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementScore({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementScore';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementScore.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementTrait({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementTrait';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrait.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GermplasmMeasurementTrial({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'germplasmMeasurementTrial';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.germplasmMeasurementTrial.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function IdentificationHistory({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'identification';
  const id = 'identificationHistory';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identification.name"
      id={id}
      updateToc={updateToc}
    />
  );
}

export function Identifier({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'identifier';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.identifier.name"
      id="identifier"
      updateToc={updateToc}
    />
  );
}

export function MeasurementOrFact({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'measurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.measurementOrFact.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function ExtendedMeasurementOrFact({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'extendedMeasurementOrFact';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.extendedMeasurementOrFact.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function ChronometricAge({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const extensionName = 'chronometricAge';
  return (
    <GenericExtension
      {...{ occurrence, extensionName }}
      label="occurrenceDetails.extensions.chronometricAge.name"
      id={extensionName}
      updateToc={updateToc}
    />
  );
}

export function GelImage({
  occurrence,
  updateToc = () => {},
}: {
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
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
      id={extensionName}
      updateToc={updateToc}
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
  updateToc?: (id: string, visible: boolean) => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (id && updateToc) {
      updateToc && updateToc(id, visible);
    }
  }, [visible, updateToc, id]);

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
          <div style={{ fontSize: '12px' }}>
            <FormattedMessage id="counts.nRows" values={{ total: list.length }} />
          </div>
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
