import React, { useEffect, useContext, useState, useRef, useCallback } from "react";
import { useUpdateEffect } from 'react-use';
import { FilterContext } from '../../../..//widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { useQuery } from '../../../../dataManagement/api';
import { filter2predicate } from '../../../../dataManagement/filterAdapter';
import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useIntegerParam } from '../../../../dataManagement/state/useIntegerParam';
import { TablePresentation } from './TablePresentation';
import { useQueryParam, NumberParam } from 'use-query-params';
import keyBy from 'lodash/keyBy';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";

const OCCURRENCE_TABLE = `
query table($predicate: Predicate, $size: Int = 20, $from: Int = 0){
  occurrenceSearch(predicate: $predicate, size: $size, from: $from) {
    documents(size: $size, from: $from) {
      total
      size
      from
      results {
        key
        gbifClassification{
          usage {
            rank
            formattedName
          }
        }
        year
				basisOfRecord
        datasetTitle
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

        stillImageCount
        movingImageCount
        soundCount
        typeStatus
        issues
        
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

function Table() {
  const [from = 0, setFrom] = useQueryParam('from', NumberParam);
  const [columns, setColumns] = useState([]);
  const size = 50;
  const currentFilterContext = useContext(FilterContext);
  const { rootPredicate, predicateConfig, tableConfig, defaultTableColumns } = useContext(OccurrenceContext);
  const { data, error, loading, load } = useQuery(OCCURRENCE_TABLE, { lazyLoad: true });

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
    // if (from !== 0) setFrom(0);
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

  useEffect(() => {
    const cols = ['scientificName', ...(defaultTableColumns || tableConfig.defaultColumns)];
    
    const colMap = keyBy(tableConfig.columns, 'name');
    const activeCols = cols.map(name => colMap[name]).filter(x => x);
    setColumns(activeCols);
  }, [tableConfig, defaultTableColumns]);

  return <>
    <TablePresentation
      loading={loading}
      data={data}
      next={next}
      prev={prev}
      first={first}
      size={size}
      from={from}
      total={data?.occurrenceSearch?.documents?.total}
      columns={columns}
    />
  </>
}

export default Table;

