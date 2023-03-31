import React, { useState, useContext, useEffect } from 'react';
import { MdFilterList } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useUpdateEffect } from 'react-use';
import { useDialogState } from 'reakit/Dialog';
import get from 'lodash/get';
import SearchContext from '../../../../../search/SearchContext';
import {
  Button,
  Row,
  Col,
  DataTable,
  Th,
  Td,
  TBody,
  DetailsDrawer,
} from '../../../../../components';
import { ResultsHeader } from '../../../../../search/ResultsHeader';
import { FilterContext } from '../../../../../widgets/Filter/state';
import { InlineFilterChip } from '../../../../../widgets/Filter/utils/FilterChip';
import { AccessionSidebar } from '../../../../AccessionSidebar/AccessionSidebar';

const fallbackTableConfig = {
  columns: [
    {
      trKey: 'Not specified',
      value: {
        key: 'key',
        labelHandle: 'key',
      },
    },
  ],
};

function isEmpty(e) {
  return (
    e === null ||
    typeof e === 'undefined' ||
    (Array.isArray(e) && e.length === 0)
  );
}

export const CollectionsTable = ({
  first,
  prev,
  next,
  size,
  from,
  results,
  total,
  loading,
  defaultTableConfig = fallbackTableConfig,
}) => {
  const [activeItem, setActiveItem] = useState(null);
  const currentFilterContext = useContext(FilterContext);
  const dialog = useDialogState({ animated: true, modal: false });
  const {
    filters,
    tableConfig = defaultTableConfig,
    labelMap,
  } = useContext(SearchContext);

  useEffect(() => {
    if (activeItem) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeItem]);

  useUpdateEffect(() => {
    if (!dialog.visible) setActiveItem(null);
  }, [dialog.visible]);

  const headers = tableConfig.columns.map((col, index) => {
    const FilterPopover = col.filterKey
      ? filters[col.filterKey]?.Popover
      : null;
    return (
      <Th key={col.trKey} width={col.width}>
        <Row wrap='nowrap'>
          <Col grow={false} style={{ whiteSpace: 'nowrap' }}>
            <FormattedMessage id={col.trKey} />
          </Col>
          {FilterPopover && (
            <Col>
              <FilterPopover modal placement='auto'>
                <Button appearance='text' style={{ display: 'flex' }}>
                  <MdFilterList />
                </Button>
              </FilterPopover>
            </Col>
          )}
        </Row>
      </Th>
    );
  });

  return (
    <>
      {dialog.visible && (
        <DetailsDrawer
          // href={`${'tempurl'}${activeItem.catalogNumber}`}
          href='https://google.com' // REPLACE
          dialog={dialog}
        >
          <AccessionSidebar
            eventID={activeItem.eventID}
            trialEventID={activeItem.eventID}
            catalogNumber={activeItem?.extensions?.seedbank?.accessionNumber}
            defaultTab='trial'
            style={{ maxWidth: '100%', width: 700, height: '100%' }}
            onCloseRequest={() => dialog.setVisible(false)}
          />
        </DetailsDrawer>
      )}
      <div
        style={{
          flex: '1 1 100%',
          display: 'flex',
          height: '100%',
          maxHeight: '100vh',
          flexDirection: 'column',
        }}
      >
        <ResultsHeader loading={loading} total={total} />
        <DataTable
          fixedColumn={true}
          {...{ first, prev, next, size, from, total, loading }}
          style={{
            flex: '1 1 auto',
            height: 400,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <thead>
            <tr key={`EventsTableHeaders`}>{headers}</tr>
          </thead>
          <TBody rowCount={size} columnCount={13} loading={loading}>
            {getRows({
              tableConfig,
              labelMap,
              results,
              currentFilterContext,
              filters,
              setActiveItem,
            })}
          </TBody>
        </DataTable>
      </div>
    </>
  );
};

const getRows = ({
  tableConfig,
  labelMap,
  results = [],
  currentFilterContext,
  filters,
  setActiveItem,
}) => {
  const rows = results.map((row, index) => {
    const cells = tableConfig.columns.map((field, i) => {
      const hasFilter = filters[field?.filterKey];
      const val = get(row, field.value.key);
      let formattedVal = val;

      if (!val && field.value.hideFalsy === true) {
        formattedVal = '';
      } else if (field.value.formatter) {
        formattedVal = field.value.formatter(val, row, {
          filterContext: currentFilterContext,
        });
      } else if (field.value.labelHandle) {
        const Label = labelMap[field.value.labelHandle];
        formattedVal = Label ? <Label id={val} /> : val;
      }
      if (!isEmpty(val) && hasFilter && field?.cellFilter) {
        let filterValue = [get(row, field.cellFilter, val)];
        if (typeof field.cellFilter === 'function') {
          filterValue = field.cellFilter({ row, val });
        }
        formattedVal = (
          <InlineFilterChip filterName={field?.filterKey} values={filterValue}>
            {formattedVal}
          </InlineFilterChip>
        );
      }
      return (
        <Td
          noWrap={field.noWrap}
          key={field.trKey}
          style={field.value.rightAlign ? { textAlign: 'right' } : {}}
        >
          {formattedVal}
        </Td>
      );
    });
    return (
      <tr
        key={row.eventID}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveItem(row)}
      >
        {cells}
      </tr>
    );
  });
  return rows;
};
