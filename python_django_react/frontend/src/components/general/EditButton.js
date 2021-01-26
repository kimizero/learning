import React from "react";
import { IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';

const EditButton = ({onClickEdit, style}) => {
    return (
        <IconButton size="small" style={style}
            onClick={onClickEdit}
            aria-label="edit"
        >
            <EditIcon fontSize="small" />
        </IconButton>
    );
};

export default EditButton;
