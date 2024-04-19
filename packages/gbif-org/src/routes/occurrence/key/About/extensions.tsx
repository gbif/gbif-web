import Properties, { Term as T, Value as V } from '@/components/Properties';
import { OccurrenceQuery } from "@/gql/graphql";
import { FormattedMessage } from "react-intl";
import { Group } from './groups';
import { Card } from '@/components/ui/largeCard';

/*
new extension names

audubon: [JSON]
amplification: [JSON]
germplasmAccession: [JSON]
germplasmMeasurementScore: [JSON]
germplasmMeasurementTrait: [JSON]
germplasmMeasurementTrial: [JSON]
identification: [JSON]
identifier: [JSON]
image: [JSON]
measurementOrFact: [JSON]
multimedia: [JSON]
reference: [JSON]
resourceRelationship: [JSON]
cloning: [JSON]
gelImage: [JSON]
loan: [JSON]
materialSample: [JSON]
permit: [JSON]
preparation: [JSON]
preservation: [JSON]
extendedMeasurementOrFact: [JSON]
chronometricAge: [JSON]
dnaDerivedData: [JSON]
*/
export function Preparation({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'preparation';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.preparation.name" id="preparation" />
}

export function ResourceRelationship({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'resourceRelationship';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.resourceRelationship.name" id="resource-relationship" />
}

export function Amplification({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'amplification';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.amplification.name" id="amplification" />
}

export function Permit({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'permit';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.permit.name" id="permit" />
}

export function Loan({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'loan';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.loan.name" id="loan" />
}

export function Preservation({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'preservation';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.preservation" id="preservation" />
}

export function MaterialSampleExt({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'materialSample';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.materialSample.name" id="material-sample" />
}

export function Audubon({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'audubon';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.audubon.name" id="audubon" />
}

export function DNADerivedData({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'dnaDerivedData';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.DNADerivedData.name" id="dna-derived-data" />
}

export function Cloning({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'cloning';
  return <GenericExtension {...{ occurrence, extensionName }} label="occurrenceDetails.extensions.cloning.name" id="cloning" />
}

export function GelImage({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  const extensionName = 'gelImage';
  return <GenericExtension
    {...{
      occurrence, extensionName, overwrites: {
        'identifier': ({ item }) => <div>
          <img src={item['identifier']} />
          <div>{item['identifier']}</div>
        </div>
      }
    }}
    label="occurrenceDetails.extensions.gelImage.name"
    id="gel-image" />
}


function GenericExtension({ occurrence, label, id, extensionName, overwrites, ...props }: {
  occurrence: OccurrenceQuery['occurrence'];
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  label: string;
  id: string;
}) {
  const list = occurrence?.extensions?.[extensionName];
  if (!list || list.length === 0) return null;

  return <Group label={label} id={id} className="pt-0 md:pt-0" {...props}>
    {list.length === 1 && <GenericExtensionContent item={list[0]} extensionName={extensionName} overwrites={overwrites} />}
    {list.length > 1 && <div>
      <div style={{ fontSize: '12px' }}>{list.length} rows</div>
      {list.map((item, i) => <ListCard key={i}>
        <GenericExtensionContent item={item} extensionName={extensionName} overwrites={overwrites} style={{fontSize: '90%'}} />
      </ListCard>)}
    </div>}
  </Group>
}

function GenericExtensionContent({ item, extensionName, overwrites = {}, style }: {
  item: any;
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  style?: React.CSSProperties;
}) {
  const fields = Object.keys(item);
  return <Properties breakpoint={800} style={style}>
    {fields.map(field => {
      if (overwrites[field]) {
        return <ExtField key={field} {...{ item, extensionName, field }}>
          {overwrites[field]({ item })}
        </ExtField>
      } else {
        return <ExtField key={field} {...{ item, extensionName, field }} />
      }
    })}
  </Properties>
}

function ExtField({ item, extensionName, field, children, ...props }: {
  item: any;
  extensionName: string;
  field: string;
  children?: React.ReactNode;
}) {
  if (!item[field]) return null;
  return <>
    <T><FormattedMessage id={`occurrenceDetails.extensions.${extensionName}.properties.${field}`} defaultMessage={getDefaultMessage(field)} /></T>
    <V>{children ? children : item[field]}</V>
  </>
}

function ListCard(props) {
  return <Card className="mb-2 p-4 bg-slate-50" {...props} />
}

function getDefaultMessage(field: string) {
  return field.split('/').pop();
}