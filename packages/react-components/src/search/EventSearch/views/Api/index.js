import React, {useContext, useState} from "react";
import {FilterContext} from "../../../../widgets/Filter/state";
import EventContext from "../../../SearchContext";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import env from "../../../../../.env.json";
import {Row,Col,Button, Input, Popover} from "../../../../components";

function GraphQLApiLink({queryId,limit, offset}) {
    const [visible, setVisible] = useState(false);

    return <>
        <Popover
            trigger={ <Button onClick={() =>setVisible(true) }>API</Button>}
            visible={visible}>
            <CopyGraphQLLink hide={() => setVisible(false)} queryId = {queryId} limit={limit} offset={offset}/>
        </Popover>
    </>
}

function CopyGraphQLLink ({hide, queryId,limit,offset}){
    const currentFilterContext = useContext(FilterContext);
    const { rootPredicate, predicateConfig } = useContext(EventContext);

    let filter = {
        type: 'and',
        predicates: [
            rootPredicate,
            filter2predicate(currentFilterContext.filter, predicateConfig)
        ].filter(x => x)
    };

    let predicate = {
        "predicate":filter,
        "limit": limit,
        "offset": offset
     }

    const queryUrl = env.EVENT_GRAPH_API + "?queryId="+queryId + "&strict=true&variables=" + JSON.stringify(predicate);

    function copyUrl() {
        const input = document.querySelector('input#eventGraghqlUrl');
        if (navigator.clipboard) {
            // navigator clipboard api method'
            navigator.clipboard.writeText(input.value)
                .then(() => {
                    document.querySelector('button#copyGraphqlUrl').innerHTML ="Copied"
                })
                .catch((error) => { alert( error) })
        }
    }
    return <>
        <div style={{ padding: "10px 10px 10px 10px" }}>
            <h3>Event GraphQL service API </h3>
            <Row>
                <Col><Input type="text"
                             value={queryUrl}
                             id="eventGraghqlUrl"
                             readOnly />
                </Col>
                <Col><Button id="copyGraphqlUrl" onClick={copyUrl} >Copy</Button></Col>
            </Row>
            <hr/>
            <Button onClick={() => hide()}>Close</Button>
        </div>
    </>
}

export default GraphQLApiLink