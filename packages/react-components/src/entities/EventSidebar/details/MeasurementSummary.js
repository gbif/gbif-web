import React, {useState} from 'react';
import {DataTable, Properties, Row, TBody, Td, Th} from "../../../components";
import {Group} from "./Groups";

const { Term: T, Value: V } = Properties;

export function MeasurementSummary({ data }) {

    let results = [];
    data.forEach(function(mof) {
        let key = mof.key;
        let summary = []
        if (mof.events?.facet?.measurementOrFactTypes?.length > 0 ) {

           let sorted_mof = mof.events.facet.measurementOrFactTypes.sort(function(a,b) {
               let textA = a.key.toUpperCase();
               let textB = b.key.toUpperCase();
               return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
            sorted_mof.forEach(function (uom) {
                summary.push(uom.key + " ("+ uom.count.toLocaleString('en-US') +")")
            })
        }
        results.push({"key":key, "summary":summary})
    })

    const getRows = () => {
        const rows = results.map(row => {
            return <tr key={row}>
                <Td >{row.key}</Td>
                <Td >{ row.summary.join(" , ")}</Td>
            </tr>;
        });
        return rows;
    }

    return <>
        <Group label="Measurements summary">
            <DataTable>
                <TBody >
                    { getRows() }
                </TBody>
            </DataTable>
        </Group>
    </>
}