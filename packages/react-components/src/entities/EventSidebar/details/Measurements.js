import React, {useState} from 'react';
import {DataTable, Properties, Row, TBody, Td, Th} from "../../../components";
import {Group} from "./Groups";

const { Term: T, Value: V } = Properties;

export function Measurements({ data }) {

    const [fixedColumn, setFixed] = useState(true);

    let hasMeasurements = false;
    if (data.documents.results
        && data.documents.results.length > 0
        && data.documents.results[0].measurementOrFacts
        && data.documents.results[0].measurementOrFacts.length > 0) {
        hasMeasurements = true;
    }

    if (!hasMeasurements){
        return <></>
    }

    //const results = data.documents.results[0].measurementOrFacts;
    let results = data.documents.results.reduce(function(measurements, result){
        measurements.push(result.measurementOrFacts);
        return measurements;
    },[]);
    results = results.flat();

    const getRows = () => {
        const rows = results.map(row => {
            return <tr key={row}>
                <Td key={`measurementType`}>{row.measurementType}</Td>
                <Td key={`measurementValue`}>{row.measurementValue}{row.measurementUnit}</Td>
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
        </Th>
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
                <TBody columnCount={2}>
                    {getRows()}
                </TBody>
            </DataTable>
        </Group>
    </>
}