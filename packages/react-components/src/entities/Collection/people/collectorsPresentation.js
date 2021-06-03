import React, { useContext, useState } from 'react';
import { Button, DataTable, Th, Td, TBody, Input, Tooltip } from '../../../components';
import * as css from './styles';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { MdHelp } from 'react-icons/md';
import ThemeContext from '../../../style/themes/ThemeContext';
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { join } from '../../../utils/util';
import RouteContext from '../../../dataManagement/RouteContext';

export const CollectorsPresentation = ({ size, search, loadMore, loading, data, error }) => {
  const routeContext = useContext(RouteContext);
  let history = useHistory();
  const url = routeContext.collectionSpecimens.url({key: '42844cb6-421e-4bcf-bdeb-c56039bee08c'});
  console.log(url);
  const [q, setQ] = useState('');
  const theme = useContext(ThemeContext);

  if (loading && !data) return <div>loading</div>;

  const items = data.occurrenceSearch.facet.recordedBy.map(x => {
    return {
      key: x.key,
      name: x.key,
      collected: x.count,
      identified: x.occurrencesIdentifiedBy.documents.total,
    }
  });

  let hasNoResults = q.length > 0 && items.length === 0 && !loading;

  const columns = ['name', 'collected', 'identified'];
  const headerss = [
    <Th key="name">
      <Tooltip title={<div>Strings as they appear in dwcA 'recordedBy'.</div>}>
        <div>Collected by <MdHelp /></div>
      </Tooltip>
    </Th>,
    <Th key="collected" style={{textAlign: 'right'}}>Records collected</Th>,
    <Th key="identifed" style={{textAlign: 'right'}}>Records identified</Th>
  ];

  return <>
    <div style={{
      flex: "1 1 100%",
    }}>

      <div>
      <div css={css.info({theme})}>
        <MdHelp />
      </div>
      </div>
      <div css={css.info({theme})}>
        These are the strings as they appear on the digitized records in the field "recordedBy". That means that one row can represent multiple people and that the same person can appear under multiple spellings. The names are ordered by number of records collected.
      </div>
      <div css={css.search}>
        <Input value={q} onChange={e => setQ(e.target.value)} />
        <Button onClick={e => search(q)}>Search</Button>
      </div>
      {hasNoResults && <div>No results for '{q}'</div>}
      {!hasNoResults && <>
        <DataTable {...{ loading }}>
          <thead>
            <tr>{headerss}</tr>
          </thead>
          <TBody rowCount={10} columnCount={7} loading={loading}>
            {getRows({ items, columns, url, history })}
          </TBody>
        </DataTable>
        {(loading || size === items.length) && <Button loading={loading} style={{ marginTop: 12 }} onClick={loadMore}>Load more</Button>}
      </>
      }
    </div>
  </>
}

const getRows = ({ items, history }) => {
  const rows = items.map((row, index) => {
    const searchLink = encodeURIComponent(btoa(JSON.stringify({must:{recordedBy:[row.name]}})));
    const cells = [
      <Td key='name'>{row.name}</Td>,
      <Td key='collected' style={{textAlign: 'right'}}>
        <a onClick={() => history.push(`../../specimens?filter=${searchLink}`)}>
          <FormattedNumber value={row.collected} />
        </a>
      </Td>,
      <Td key='identified' style={{textAlign: 'right'}}><FormattedNumber value={row.identified} /></Td>
    ]
    return <tr key={row.key}>{cells}</tr>;
  });
  return rows;
}