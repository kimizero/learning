import React from "react";
import { IconButton } from "@material-ui/core";
import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';

const ConnectButton = ({onClickEdit, ref, style}) => {
    return (
        <IconButton size="small" style={style}
            ref={ref}
            onClick={onClickEdit}
            aria-label="edit"
        >
            <CenterFocusStrongIcon fontSize="small" />
        </IconButton>
    );
};

export default ConnectButton;
