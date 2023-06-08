import React, {useCallback, useEffect, useState} from 'react';
import {useQuery} from "../../../dataManagement/api";
import { DataTable, TBody} from "../../../components";
import {OccurrenceEventSearchLink, OccurrenceLink} from "../../../components/resourceLinks/resourceLinks";
import { MdOutbound} from "react-icons/md";

const EVENT_OCCURRENCE_QUERY = `
query list ($eventID: String, $datasetKey:String, $size:Int, $from:Int) {
  occurrences(eventID: $eventID, datasetKey: $datasetKey, size: $size, from: $from) {
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

export function EventOccurrence({ eventID, datasetKey }) {
    const { data, loading, load } = useQuery(EVENT_OCCURRENCE_QUERY, { lazyLoad: true });
    const [offset, setOffset] = useState(0);
    let size = 15;
    let from = offset;

    useEffect(() => {
        if (typeof eventID !== 'undefined') {
            load({ variables: { eventID: eventID, datasetKey: datasetKey, size: size, from: offset } });
        }
    }, [eventID, datasetKey, offset]);

    const next = () => {
        setOffset(Math.max(0, offset + size));
    };

    const prev = () => {
        const offsetValue = Math.max(0, offset - size);
        setOffset(offsetValue !== 0 ? offsetValue : undefined);
    };

    const first = () => {
        setOffset(0);
    };

    const total = data?.occurrences?.total;

    return <>
        <div style={{paddingLeft: '20px', paddingRight: '30px'}}>
            {total > 0 &&
                <span>
                    <OccurrenceEventSearchLink id={eventID} otherIds={{datasetKey: datasetKey}}>
                        Explore all records <MdOutbound style={{verticalAlign: 'bottom' , marginBottom: '2px', marginLeft: '2px'}} />
                    </OccurrenceEventSearchLink>
                </span>
            }
        <h3>Occurrences ({ (total || 0)?.toLocaleString()})
        </h3>
            { total > 0 &&
                <DataTable {...{first, prev, next, size, from, total, loading}}
                           style={{flex: "1 1 auto", display: 'flex', flexDirection: 'column'}}>
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
            }
        </div>
    </>
}