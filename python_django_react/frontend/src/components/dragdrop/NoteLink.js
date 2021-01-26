import React, { useState } from "react";
import { ItemTypes, ItemPalette } from "./Constants";
import ArrowButton from "../general/ArrowButton";
import { makeStyles } from "@material-ui/core/styles";
import { useDrag } from "react-dnd";
import {
    Card,
    CardHeader,
    CardContent,
    Collapse,
    Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    note: {
        display: "inline-block",
        position: "absolute",
        width: 400,
    },
    noteHeaderAction: {
        alignSelf: "center",
    },
    noteHeaderContent: {
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
}));

const NoteLink = ({
}) => {
    const classes = useStyles();

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.NOTELINK, },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    return (
        <div>
            ***
        </div>
    );
};

export default NoteLink;
