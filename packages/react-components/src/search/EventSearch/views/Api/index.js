import React from "react";
import {Button, DetailsDrawer, Tooltip} from "../../../../components";
import {css} from "@emotion/react";
import {GraphQLSidebar} from "../../../../entities/GraphQLSidebar/GraphQLSidebar";
import {useDialogState} from "reakit/Dialog";
import {GrGraphQl} from "react-icons/all";

function GraphQLApiInfo() {
    const dialog = useDialogState({ animated: true, modal: false, visible: false });
    return <>
        <Tooltip title="Display GraphQL query details" placement="auto">
        <Button  onClick={() =>dialog.setVisible(true)} appearance={"link"} css={css`margin-right: 30px;`}><GrGraphQl  css={css`font-size: 18px;`} ></GrGraphQl></Button>
        </Tooltip>
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