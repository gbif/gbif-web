import React, {useContext, useState} from "react";
import {FilterContext} from "../../../../widgets/Filter/state";
import EventContext from "../../../SearchContext";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import env from "../../../../../.env.json";
import {Row,Col,Button, Input, Popover} from "../../../../components";
import {css} from "@emotion/react";

function GraphQLApiLink({queryId,limit, offset}) {
    const [visible, setVisible] = useState(false);

    return <>
        <Popover
            trigger={ <Button onClick={() =>setVisible(true) } look="primaryOutline" css={css`margin-left: 30px; font-size: 11px;`}>API</Button>}
            visible={visible}>
            <CopyGraphQLLink hide={() => setVisible(false)} queryId = {queryId} limit={limit} offset={offset}/>
        </Popover>
    </>
}

function CopyGraphQLLink ({hide, queryId,limit,offset}){
    const [copyButtonText, setCopyButtonText] = useState("Copy")
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
        if (navigator.clipboard) {
            navigator.clipboard.writeText(queryUrl)
                .then(() => {
                    setCopyButtonText("Copied")
                })
                .catch((error) => { alert( error) })
        }
    }

    return <>
        <div style={{ padding: "10px 10px 10px 10px" }}>
            <Row><h3>GraphQL service API</h3></Row>
            <Row>
                <Col><Input type="text"
                             value={queryUrl}
                             readOnly />
                </Col><Col>&nbsp;</Col>
                <Col><Button onClick={copyUrl} >{copyButtonText}</Button></Col>
            </Row>
            <hr/>
            <Row><Col align="center"><Button onClick={() => hide()}>Close</Button></Col></Row>
        </div>
    </>
}
export default GraphQLApiLink