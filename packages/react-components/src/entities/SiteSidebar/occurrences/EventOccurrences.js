import React, { useEffect, useState} from 'react';
import {useQuery} from "../../../dataManagement/api";
import { DataTable, TBody} from "../../../components";
import {OccurrenceLink} from "../../../components/resourceLinks/resourceLinks";

const EVENT_MY_QUERY = `
query list ($locationID: String, $month: Int, $year: Int, $size:Int, $from:Int) {
  occurrences(locationID: $locationID, month: $month, year: $year, size: $size, from: $from) {
    total
    size
    from
    results {
      key
      scientificName
      family
      individualCount
      occurrenceStatus
      basisOfRecord
    }
  }
}`;

const EVENT_Y_QUERY = `
query list ($locationID: String, $year: Int, $size:Int, $from:Int) {
  occurrences(locationID: $locationID, year: $year, size: $size, from: $from) {
    total
    size
    from
    results {
      key
      scientificName
      family
      individualCount
      occurrenceStatus
      basisOfRecord
    }
  }
}`;

export function EventOccurrence({ locationID, month, year }) {
    const { data, loading, load } = useQuery(month > 0 ? EVENT_MY_QUERY : EVENT_Y_QUERY, { lazyLoad: true });
    const [offset, setOffset] = useState(0);
    let size = 15;
    let from = offset;

    useEffect(() => {
        if (typeof locationID !== 'undefined') {
            const variables = {
                locationID,
                year,
                size,
                from: offset,
                ...(month && { month })
            };

            load({ variables });
        }
    }, [locationID, month, year, offset]);

    const next = () => {
        setOffset(Math.max(0, offset + size));
    };

    const prev = () => {
        const offsetValue = Math.max(0, offset - size);
        setOffset(offsetValue !== 0 ? offsetValue : 0);
    };

    const first = () => {
        setOffset(0);
    };

    const total = data?.occurrences?.total;

    return <>
        <div style={{paddingLeft: '20px', paddingRight: '30px'}}>
        <h3>Occurrences ({ !total ? 'loading' : total?.toLocaleString()})</h3>
        <DataTable {...{  first, prev, next, size, from, total, loading }}
           style={{ flex: "1 1 auto",  display: 'flex', flexDirection: 'column' }}>
            <thead>
                <th>Family</th>
                <th>Scientific name</th>
                <th>Basis of record</th>
                <th>Occurrence status</th>
                <th></th>
            </thead>
            <TBody rowCount={size} columnCount={5} loading={loading}>
                {data?.occurrences?.results?.map(x => <tr key={x.key}>
                    <td>{x.family}</td>
                    <td>{x.scientificName}</td>
                    <td>{x.basisOfRecord}</td>
                    <td>{x.occurrenceStatus}</td>
                    <td><OccurrenceLink id={x.key}>View details</OccurrenceLink></td>
                </tr>)}
            </TBody>
        </DataTable>
        </div>
    </>
}