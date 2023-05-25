import React, {useState} from 'react';
import {DataTable, Properties, Row, TBody, Td, Th} from "../../../components";
import {Group} from "./Groups";

const { Term: T, Value: V } = Properties;

export function Measurements({ data }) {

    const [fixedColumn, setFixed] = useState(true);

    let hasMeasurements = false;
    if (data?.documents?.results?.length > 0
        && data?.documents?.results[0]?.measurementOrFacts?.length > 0) {
        hasMeasurements = true;
    }

    if (!hasMeasurements){
        return null;
    }

        //const results = data.documents.results[0].measurementOrFacts;
    const results = data.documents.results.reduce((measurements, result) => {
        measurements.push(result.measurementOrFacts);
        return measurements;
    },[]);

    const flattenResults = results.flat().reduce(function(memo, e1){
        let matches = memo.filter(function(e2){
            return e1.measurementType == e2.measurementType && e1.measurementValue == e2.measurementValue
        })
        if (matches.length == 0)
            memo.push(e1)
        return memo;
    }, [])

    let sortedFlattenResults = flattenResults.sort(function(a,b) {
        let textA = a.measurementType.toUpperCase();
        let textB = b.measurementType.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    })

    const hasField = (prop) => {
        return sortedFlattenResults.filter((mof) => Boolean(mof[`measurement${prop}`])).length > 0;
    };

    const extraFields = ['Method', 'Remarks', 'DeterminedDate'].filter((field) => hasField(field));
    const getRows = () => {
        const rows = sortedFlattenResults.map(row => {
            return <tr key={row}>
                <Td key={`measurementType`}>{row.measurementType}</Td>
                <Td key={`measurementValue`}>{row.measurementValue}{row.measurementUnit}</Td>
                {extraFields.map(field => (
                    <Td key={`measurement${field}`}>
                        {row[`measurement${field}`]}
                    </Td>
                ))}
            </tr>;
        });
        return rows;
    }

    const headers = [
        <Th key='measurementType'>
            Measurement
        </Th>,
        <Th key='measurementValue'>
            value
        </Th>,
        ...extraFields.map(field => (
            <Th key={`measurement${field}`}>
                {field}
            </Th>
        ))
    ];

    const first = () => { };
    const prev = () => { };
    const next = () => { };
    const size = 10;
    const from = 0;
    const total = results.length;
    return <>
        <Group label="eventDetails.groups.measurementsOrFacts">
            <DataTable fixedColumn={fixedColumn} {...{ first, prev, next, size, from, total }} style={{ height: 300 }}>
                <thead>
                <tr>{headers}</tr>
                </thead>
                <TBody columnCount={2 + extraFields.length}>
                    {getRows()}
                </TBody>
            </DataTable>
        </Group>
    </>
}