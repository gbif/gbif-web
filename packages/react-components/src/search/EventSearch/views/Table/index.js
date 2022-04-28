import React, { useContext, useEffect, useState } from "react";
import StandardSearchTable from '../../../StandardSearchTable';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { AltmetricDonut } from '../../../../components';
import { MdLink } from 'react-icons/md';

const QUERY = `
query list($predicate: Predicate, $limit: Int, $size: Int){
  eventSearch(
    predicate:$predicate,
    size: $limit, 
    from: $size
    ) {
    documents {
      size
      from
      total
      results {
        eventId
        samplingProtocol
      }
    }
  }
}
`;


function getLink(item) {
  if (item?.identifiers?.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item?.websites?.[0];
}

const defaultTableConfig = {
  columns: [
    {
      trKey: 'tableHeaders.eventId',
      value: {
        key: 'eventId',
        formatter: (value, item) => {
          const maxLength = 200;
          const truncatedAbstract = item.abstract?.length > maxLength ? `${item.abstract.substr(0, maxLength)}...` : item.abstract;
          const link = getLink(item);

          return <div>
            {link ? <div><a href={link} style={{ color: 'inherit', textDecoration: 'none' }}>{value} <MdLink /></a></div> : <div>{value}</div>}

            <div style={{ color: '#aaa' }}>{truncatedAbstract}</div>
          </div>
        },
      },
      width: 'wide'
    },
    // {
    //   trKey: 'tableHeaders.altmetric',
    //   value: {
    //     key: 'identifiers',
    //     formatter: (value, item) => {
    //       return <AltmetricDonut doi={item?.identifiers?.doi} />
    //     },
    //     hideFalsy: true
    //   }
    // },
    {
      trKey: 'filters.eventType.name',
      value: {
        key: 'eventType',
        labelHandle: 'eventType',
        hideFalsy: true
      }
    },
    {
      trKey: 'filters.year.name',
      value: {
        filterKey: 'year',
        key: 'year',
        hideFalsy: true
      }
    },
    // {
    //   trKey: 'tableHeaders.occurrences',
    //   value: {
    //     key: 'occurrenceCount',
    //     formatter: (value, item) => <FormattedNumber value={value} />,
    //     hideFalsy: true,
    //     rightAlign: true
    //   }
    // },
    // {
    //   trKey: 'active',
    //   value: {
    //     key: 'active',
    //     formatter: (value, item) => value ? 'yes' : 'no'
    //   }
    // }
  ]
};

function Table() {
  return <StandardSearchTable graphQuery={QUERY} resultKey='eventSearch' defaultTableConfig={defaultTableConfig} limit={50} />
}

export default Table;