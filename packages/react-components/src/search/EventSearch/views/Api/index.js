import React, {useContext, useState} from "react";
import {FilterContext} from "../../../../widgets/Filter/state";
import EventContext from "../../../SearchContext";
import {filter2predicate} from "../../../../dataManagement/filterAdapter";
import env from "../../../../../.env.json";
import {Row, Col, Button, Input, Popover, DetailsDrawer} from "../../../../components";
import {css} from "@emotion/react";
import {GraphQLSidebar} from "../../../../entities/GraphQLSidebar/GraphQLSidebar";
import {useDialogState} from "reakit/Dialog";

function GraphQLApiInfo({query, queryId,limit, offset}) {
    const dialog = useDialogState({ animated: true, modal: false, visible: false });
    return <>
        <Button onClick={() =>dialog.setVisible(true) } look="primaryOutline" css={css`margin-left: 30px; font-size: 11px;`}>API</Button>
        <DetailsDrawer dialog={dialog}>
            <GraphQLSidebar
                defaultTab='details'
                style={{ maxWidth: '100%', width: 700, height: '100%' }}
                onCloseRequest={() =>  dialog.setVisible(false)}
            />
        </DetailsDrawer>
    </>
}

export default GraphQLApiInfo