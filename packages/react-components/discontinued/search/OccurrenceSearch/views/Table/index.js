import React, { useEffect, useContext, useState, useCallback } from "react";
import { useLocalStorage, useUpdateEffect } from 'react-use';
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { TablePresentation } from './TablePresentation';
import { useQueryParam, NumberParam } from 'use-query-params';
import keyBy from 'lodash/keyBy';

const OCCURRENCE_TABLE = `
query table($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      size
      from
      results {
        key
        taxonKey
        gbifClassification{
          verbatimScientificName
          usage {
            rank
            formattedName
            key
          }
        }
        year
        eventDate
				basisOfRecord
        datasetKey
        datasetTitle
        publishingOrgKey
        publisherTitle
        countryCode
        formattedCoordinates
        catalogNumber
        recordedBy
        identifiedBy
        recordNumber
        preparations
        institutionCode
        collectionCode
        locality
        higherGeography
        stateProvince
        establishmentMeans
        iucnRedListCategory
        datasetName

        stillImageCount
        movingImageCount
        soundCount
        typeStatus
        issues
        hasTaxonIssues

        institution {
          name
          key
          code
        }
        collection {
          name
          key
          code
        }
        
        volatile {
          features {
            isTreament
            isSequenced
            isClustered
            isSamplingEvent
          }
        }
      }
    }
  }
}
`;

function Table({style, className, dataTableProps, ...props}) {
  const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const [visibleColumnNames, setVisibleColumnNames, removeVisibleColumnNames] = useLocalStorage('visibleOccurrenceColumns');
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const size = 50;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig, tableConfig, defaultTableColumns, more } = useContext(OccurrenceContext);
  const { availableTableColumns } = more;
  const { data, error, loading, load } = useQuery(OCCURRENCE_TABLE, { lazyLoad: true, throwNetworkErrors: true, queryTag: 'table' });

  useEffect(() => {
    const predicate = {
      type: 'and',
      predicates: [
        rootPredicate,
        filter2predicate(currentFilterContext.filter, predicateConfig)
      ].filter(x => x)
    }
    load({ keepDataWhileLoading: true, variables: { predicate, size, from } });
  }, [currentFilterContext.filterHash, rootPredicate, from]);

  useEffect(() => {
    return function cleanup() {
      setFrom();
    };
  }, []);

  // https://stackoverflow.com/questions/55075604/react-hooks-useeffect-only-on-update
  useUpdateEffect(() => {
    if (from !== 0) setFrom(0);
  }, [currentFilterContext.filterHash]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  // generate the list of available column
  useEffect(() => {
    // lookup for all column configurations
    const colMap = keyBy(tableConfig.columns, 'name');
    // list of all column names
    const allColumnNames = Object.keys(colMap);
    
    // now create the list of available columns config objects
    const possibleColumns = availableTableColumns || allColumnNames;
    // if no available columns are specified, then sort possibleColumns to match the defaultTableColumns, putting unknown last
    if (!availableTableColumns && defaultTableColumns) {
      possibleColumns.sort((a, b) => {
        const aIndex = defaultTableColumns.indexOf(a);
        const bIndex = defaultTableColumns.indexOf(b);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
    }

    const distinctAvailableColumns = [...new Set(['scientificName'].concat(possibleColumns))];
    const availableCols = distinctAvailableColumns
      .map(name => colMap[name])
      .filter(x => x);
    setAvailableColumns(availableCols, 'name');
  }, [tableConfig, availableTableColumns]);

  // fetch visible columns from local storage or the defaults from config
  useEffect(() => {
    const colMap = keyBy(availableColumns, 'name');
    // now create the list of visible columns (name/key only)
    const columnNames = [...(visibleColumnNames ?? defaultTableColumns ?? availableTableColumns ?? tableConfig.defaultColumns)];
    // remove duplicates and add scientificName as the first entry
    const distinctVisibleColumns = [...new Set(['scientificName'].concat(columnNames))]
    // remove any columns that are not available
    const visibleCols = distinctVisibleColumns.map(name => colMap[name]).filter(x => x);
    // sort them to match the order of availableCols
    const sortedVisibleCols = visibleCols.sort((a, b) => availableColumns.indexOf(a) - availableColumns.indexOf(b));
    setVisibleColumns(sortedVisibleCols);
  }, [tableConfig.defaultColumns, availableColumns, defaultTableColumns, visibleColumnNames]);

  const toggleColumn = useCallback((columnName) => {
    if (!columnName) {
      removeVisibleColumnNames();
      return;
    }
    const columnNames = [...visibleColumns.map(x => x.name)];
    const index = columnNames.indexOf(columnName);
    if (index > -1) {
      columnNames.splice(index, 1);
    } else {
      columnNames.push(columnName);
    }
    setVisibleColumnNames(columnNames);
  });

  return <TablePresentation
    loading={loading}
    data={data}
    next={next}
    prev={prev}
    first={first}
    size={size}
    from={from}
    total={data?.occurrenceSearch?.documents?.total}
    visibleColumns={visibleColumns}
    availableColumns={availableColumns}
    toggleColumn={toggleColumn}
    {...{style, className, dataTableProps}}
  />
}

export default Table;

