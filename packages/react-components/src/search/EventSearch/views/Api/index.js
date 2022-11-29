import React from "react";
import {DetailsDrawer} from "../../../../components";
import {css} from "@emotion/react";
import {GraphQLSidebar} from "../../../../entities/GraphQLSidebar/GraphQLSidebar";
import {useDialogState} from "reakit/Dialog";
import {GrGraphQl} from "react-icons/all";


function GraphQLApiInfo() {
    const dialog = useDialogState({ animated: true, modal: false, visible: false });
    return <>
        <GrGraphQl  onClick={() =>dialog.setVisible(true)} css={css`margin-top:15px; margin-right: 30px; font-size: 16px;`} ></GrGraphQl>
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