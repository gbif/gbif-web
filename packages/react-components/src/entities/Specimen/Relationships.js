import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import { Classification, Properties, Button, Switch, HyperText } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';
import { ImBook as ReferenceIcon } from 'react-icons/im'
import { MdEdit } from 'react-icons/md';
import { prettifyString } from '../../utils/labelMaker/config2labels';
import { FormattedDate } from '../shared/header';
import { FormattedMessage } from 'react-intl';

export function Relationships({
  specimen,
  ...props
}) {
  if (!specimen?.otherRelations?.relationsWhereMaterialIsSubject?.length &&
      !specimen?.otherRelations?.relationsWhereMaterialIsObject?.length) return null;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Relationships</CardHeader2>
    </div>
    <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      {/* <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Where material is subject</h3> */}
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>
        {specimen?.otherRelations?.relationsWhereMaterialIsSubject.map((entity) => {
          return <li css={css`display: flex; margin-bottom: 12px;`} key={entity.entityRelationshipId}>
            <Card padded={false} style={{ width: '100%' }}>
              <Relationship entity={entity} isSubject/>
            </Card>
          </li>
        })}

        {specimen?.otherRelations?.relationsWhereMaterialIsObject.map((entity) => {
          return <li css={css`display: flex; margin-bottom: 12px;`} key={entity.entityRelationshipId}>
            <Card padded={false} style={{ width: '100%' }}>
              <Relationship entity={entity} />
            </Card>
          </li>
        })}

      </ul>
    </div>
  </Card>
};

export function RelationshipsDump({
  specimen,
  ...props
}) {
  if (!specimen) return null;

  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Relationships</CardHeader2>
    </div>
    <div css={css`padding: 12px 24px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Parts</h3>
      <ul css={css`margin: 0; padding: 0; list-style: none;`}>

        <li css={css`display: flex; margin-bottom: 12px;`}>
          <Card padded={false} css={css`padding: 12px;`}>
            {/* <Identification identification={identification} /> */}
            <div css={PropTable}>
              <div css={KeyValue}>
                <div>Preparation</div>
                <div>Heart</div>
              </div>
              <div css={KeyValue}>
                <div>Disposition</div>
                <div>Disposed</div>
              </div>
              <div css={KeyValue}>
                <div>Preparation</div>
                <div>Heart</div>
              </div>
              <div css={KeyValue}>
                <div>Disposition</div>
                <div>Disposed</div>
              </div>
              <div css={KeyValue}>
                <div>Description</div>
                <div css={PropTable}>
                  <div css={KeyValue}>
                    <div>Preparation</div>
                    <div>Heart</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Disposition</div>
                    <div>Disposed</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Preparation</div>
                    <div>Heart</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Description</div>
                    <div>relationType, preparations, disposition, date (Before or afte)</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Type</div>
                    <div>ITS</div>
                  </div>
                  <div css={KeyValue}>
                    <div>Sequence</div>
                    <div>AGGAAGTAAAAGTCGTAACAAGGTTTCCGTAGGTGAACCTGCGGAAGGATCATTATTGAAATTAAACTTGATAAGTTGTTGCTGGTTCTCTAGGGAGCATGTGCACACTTGTCATCTTTGTATTTCCACCTGTGCACTTTTTGTAGGCCTGATTATCTCTCTGAATGCTTAGCCATTCAGGATTGAGGATTGACTTTCAGTCTCTTCCTTACATTTTCGGGTCTATGTTCATTCATATACCCTATGTATGTTTATAGAATGTTGCTAATGGGCCTTTGTGCCTACAAATCTATACAACTTTCAGCAACGGATCTCTTGGCTCTCGCATCGATGAAGAACGCAGCGAAATGCGATAAGTAATGTGAATTGCAGAATTCAGTGAATCATCGAATCTTTGAACGCACCTTGCGCTCCTTGGTATTCCGAGGAGCATGCCTGTTTGAGTGTCATTAATATATCAACCTCTTTGGTTGGATGTGGGTTTGCTGGCCTCTTAAGGTCAGCTCCCCTTAAATGCATTAGCGGACAACATTTTGCCAACCGTTCATTAGTGTGATAATTATCTACGCTATTGACGTGAAGCATGGTTCAGCTTCTAACAGTCCATTGACTTGGACAAATTTCTTATTAATGTGACCTCAAATCAG</div>
                  </div>
                </div>
              </div>
            </div>
            <h3 css={css`color: var(--color400); font-weight: normal; font-size: 16px;`}>Assertions</h3>
            <div css={PropTable}>
              <div css={KeyValue}>
                <div>Scientific name</div>
                <div>Cortinarius koldingensis Frøslev & T.S.Jeppesen</div>
              </div>
              <div css={KeyValue}>
                <div>Identified by</div>
                <div>Tobias Frøslev, Thomas Stjernegaard Jeppesen</div>
              </div>
              <div css={KeyValue}>
                <div>Nature of ID</div>
                <div>Visual and dna</div>
              </div>
              <div css={KeyValue}>
                <div>Classification</div>
                <div>FungiBasidi omycotaAgar icomycetes AgaricalesC ortinariaceaeC ortinariusCortinarius koldingensis</div>
              </div>
              <div css={KeyValue}>
                <div>Type</div>
                <div>ITS</div>
              </div>
              <div css={KeyValue}>
                <div>Sequence</div>
                <div>AGGAAGTAAAAGTCGTAACAAGGTTTCCGTAGGTGAACCTGCGGAAGGATCATTATTGAAATTAAACTTGATAAGTTGTTGCTGGTTCTCTAGGGAGCATGTGCACACTTGTCATCTTTGTATTTCCACCTGTGCACTTTTTGTAGGCCTGATTATCTCTCTGAATGCTTAGCCATTCAGGATTGAGGATTGACTTTCAGTCTCTTCCTTACATTTTCGGGTCTATGTTCATTCATATACCCTATGTATGTTTATAGAATGTTGCTAATGGGCCTTTGTGCCTACAAATCTATACAACTTTCAGCAACGGATCTCTTGGCTCTCGCATCGATGAAGAACGCAGCGAAATGCGATAAGTAATGTGAATTGCAGAATTCAGTGAATCATCGAATCTTTGAACGCACCTTGCGCTCCTTGGTATTCCGAGGAGCATGCCTGTTTGAGTGTCATTAATATATCAACCTCTTTGGTTGGATGTGGGTTTGCTGGCCTCTTAAGGTCAGCTCCCCTTAAATGCATTAGCGGACAACATTTTGCCAACCGTTCATTAGTGTGATAATTATCTACGCTATTGACGTGAAGCATGGTTCAGCTTCTAACAGTCCATTGACTTGGACAAATTTCTTATTAATGTGACCTCAAATCAG</div>
              </div>
            </div>
          </Card>
        </li>

      </ul>
    </div>

  </Card>
};

function Relationship({ entity, isSubject, ...props }) {
  // const { specimen, data, error, loading } = useSpecimenData({ id });
  console.log(entity);
  let content = null;
  if (entity.objectEntityIri) {
    content = <div css={PropTable}>
      <div css={KeyValue}>
        <div>External IRI</div>
        <div><HyperText inline text={entity.objectEntityIri} /></div>
      </div>
    </div>
  }

  const material = entity?.entityBySubjectEntityId?.materialEntityByMaterialEntityId || entity?.entityByObjectEntityId?.materialEntityByMaterialEntityId;
  if (material) {
    const id = entity?.entityByObjectEntityId?.entityId || entity?.entityBySubjectEntityId?.entityId;
    
    content = <div css={PropTable}>
      {entity.objectEntityIri && <div css={KeyValue}>
        <div>External IRI</div>
        <div><HyperText inline text={entity.objectEntityIri} /></div>
      </div>}
      <div css={KeyValue}>
        <div>ID</div>
        <div><a css={css`color: var(--linkColor);`} href={`/?cat=${id}`}>{id}</a></div>
      </div>
      <div css={KeyValue}>
        <div>Type</div>
        <div>{material.materialEntityType}</div>
      </div>
      <div css={KeyValue}>
        <div>preparations</div>
        <div><HyperText inline text={material.preparations} /></div>
      </div>
      <div css={KeyValue}>
        <div>disposition</div>
        <div><HyperText inline text={material.disposition} /></div>
      </div>
      <div css={KeyValue}>
        <div>catalogNumber</div>
        <div>{material.catalogNumber}</div>
      </div>
      <div css={KeyValue}>
        <div>associatedSequences</div>
        <div><HyperText inline text={material.associatedSequences} /></div>
      </div>
    </div>
  }

  return <>
    {isSubject && <div css={css`padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #eee;`}>Page: <span>{entity.entityRelationshipType}</span>: card</div>}
    {!isSubject && <div css={css`padding: 8px 12px; background: #fafafa; border-bottom: 1px solid #eee;`}>Card: <span>{entity.entityRelationshipType}</span>: page</div>}
    <div css={css`padding: 0px;`}>{content}</div>
    {/* <pre>{JSON.stringify(entity, null, 2)}</pre> */}
  </>
}

const PropTable = css`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  > div {
    flex: 1 1 auto;
  }
`;

const KeyValue = css`
  display: inline-block;
  border: 1px solid #f0f0f0;
  border-radius: 3px;
  display: inline-flex;
  margin: -1px;
  > div {
    flex: 0 0 auto;
    padding: 8px 16px;
    min-width: 33%;
  }
  >div:first-of-type {
    background: #fafafa;
    border-right: 1px solid #f0f0f0;
    min-width: 150px;
  }
  >div:last-of-type {
    background: white;
    flex: 1 1 auto;
    line-break: anywhere;
  }
`;