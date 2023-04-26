import { jsx, css } from '@emotion/react';
import React from 'react';
import { DataTable as Table, Th, Td, TBody } from '../../../components';
import { Term, Value } from '../../../components/Properties/Properties';
import { Card, CardHeader2 } from '../../shared';

// hardcoded list of declared citations
const declaredCitations = [
  {
    id: 1,
    title: 'A new species of the genus Pseudoscorpionidae (Arachnida: Pseudoscorpionida) from the Philippines',
    journal: 'Zootaxa',
    year: 2015,
    authors: 'Irshad Ahmad Bhat, Mudasir Fayaz',
  }
];
// hardcoded list of GBIF mediated citations
const gbifMediatedCitations = [
  {
    id: 1,
    title: 'A The Black Sea-Eastern Mediterranean flyway of the globally threatened European turtle dove (Streptopelia turtur) ',
    type: 'Journal Article',
    year: 2015,
    source: 'Plazi',
  },
  {
    id: 2,
    title: 'Biogeographical Aspects of Helminths Parasitizing Barents Sea Birds: Spatial Distribution and Host Preferences',
    type: 'Journal Article',
    year: 2013,
    source: 'Bionomia',
  }
];
export function Citations({
  specimen,
  setSection,
  name = 'citations',
  ...props
}) {
  if (!specimen || !specimen?.citations?.length) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);
  
  return <Card padded={false} css={css`margin-bottom: 24px;`} {...props}>
    <div css={css`padding: 12px 24px 0 24px;`}>
      <CardHeader2>Citations</CardHeader2>
      {/* <div css={css`margin-bottom: 12px; margin-top: -12px; border-radius: 6px; background: #eee; font-size: 12px; padding: 10px;`}>
        Other than published citation, this section could include citations linked via GBIF - e.g. Plazi and the citation tracking program. Below adds two mocked entried to show the idea.
      </div> */}
    </div>
    <div>
      {/* <h4 css={headerStyle}>Declared by publisher</h4> */}
      <Table css={tableStyle}>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>type</Th>
            <Th>Year</Th>
            {/* <Th>Linked by</Th> */}
          </tr>
        </thead>
        <TBody>
          {specimen.citations.map((x, i) => {
            return <tr key={`${x.referenceIri}_${i}`}>
              <Td><a css={css`text-decoration: none; color: var(--linkColor);`} href={x.referenceIri}>{x.bibliographicCitation}</a></Td>
              <Td>{x.referenceType}</Td>
              <Td>{x.referenceYear}</Td>
              {/* <Td></Td> */}
            </tr>
          })}
          {/* {gbifMediatedCitations.map(x => {
            return <tr key={x.id}>
              <Td>{x.title}</Td>
              <Td>{x.type}</Td>
              <Td>{x.year}</Td>
              <Td>{x.source}</Td>
            </tr>
          })} */}
        </TBody>
      </Table>
    </div>
  </Card>
};

const headerStyle = css`
  margin: 0 12px 12px 12px;
  font-weight: normal;
  color: #888;
`;

const tableStyle = css`
  .gb-dataTable-wrapper {
    max-height: 500px;
  }
  table {
    font-size: 1em;
  }
  th {
    font-size: 85%;
  }
  td, th {
    border-right: none!important;
  }
  thead>tr>th {
    background: #f3f6f8;
  }
  `;