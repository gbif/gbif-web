import React, { useState } from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { DataTable, Th, Td, TBody } from './DataTable';
import { Row, Col } from '../index';
import { Button, Popover } from '../index';
import { MdFilterList } from "react-icons/md";
import readme from './README.md';
import { StyledProse } from '../typography/StyledProse';

// import { TaxonFilterPopover } from '../../search/OccurrenceSearch/filters/TaxonFilter4/TaxonFilter';

const TaxonFilter = ({ innerRef, popover, ...props }) => <div>
  <h1>Taxon filter</h1>
  <Button onClick={() => popover.hide()}>Close</Button>
  <Button ref={innerRef}>init focus</Button>
  <Button>test 3</Button>
  <Button>test 4</Button>
</div>

export default {
  title: 'Components/DataTable',
  component: DataTable,
};

export const Demo = () => {
  const [fixedColumn, setFixed] = useState(true);

  const getRows = () => {
    const rows = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(row => {
      const cells = ['gbifScientificName', 'year', 'basisOfRecord', 'datasetTitle', 'publisherTitle', 'countryCode', 'gbifTaxonRank'].map(
        (field, i) => {
          if (i === 0) {
            return <Td key={field}>
              <Button appearance="text" onClick={() => console.log(row)}>{field}_{row}</Button>
            </Td>
          } else {
            return <Td key={field}>{field}_{row}</Td>;
          }
        }
      );
      return <tr key={row}>{cells}</tr>;
    });
    return rows;
  }

  const headers = [
    <Th key='scientificName' width='wide' locked={fixedColumn} toggle={() => setFixed(!fixedColumn)}>
      <Row>
        <Col grow={false}>scientificName</Col>
        <Col>
          {/* <TaxonFilterPopover modal>
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </TaxonFilterPopover> */}
          {/* <Popover
            aria-label="Location filter"
            onClickOutside={popover => popover.hide()}
            trigger={<Button>choose location</Button>}
          >
            {({ popover, focusRef }) =>
              <TaxonFilter innerRef={focusRef} popover={popover} />
            }
          </Popover> */}
        </Col>
      </Row>

    </Th>,
    <Th key='year'>
      year
    </Th>,
    <Th key='basisOfRecord' width='wide'>
      basisOfRecord
    </Th>,
    <Th key='datasetTitle' width='wide'>
      datasetTitle
    </Th>,
    <Th key='publisherTitle' width='wide'>
      publisherTitle
    </Th>,
    <Th key='countryCode'>
      countryCode
    </Th>,
    <Th key='gbifTaxonRank'>
      rank
    </Th>
  ];

  const first = () => { };
  const prev = () => { };
  const next = () => { };
  const size = 10;
  const from = 20;
  const total = 1000000;
  return <DataTable fixedColumn={fixedColumn} {...{ first, prev, next, size, from, total }} style={{ height: 300 }}>
    <thead>
      <tr>{headers}</tr>
    </thead>
    <TBody loading columnCount={7}>
      {getRows()}
    </TBody>
  </DataTable>
}

Demo.story = {
  name: 'Data table',
};


// // OPTIONS
// const options = {
//   primary: 'primary',
//   primaryOutline: 'primaryOutline',
//   outline: 'outline',
//   danger: 'danger',
// };
// type={select('Type', options, options.primary)}

// // BOOLEAN
// boolean("loading", false)

// // TEXT
// {text('Text', 'Table text')}