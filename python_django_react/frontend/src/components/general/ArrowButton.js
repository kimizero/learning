import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: "rotate(180deg)",
    },
}));

const ArrowButton = ({ expanded, setExpanded }) => {
    const classes = useStyles();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <IconButton size="small"
            onClick={handleExpandClick}
            className={(classes.expand, expanded ? classes.expandOpen : "")}
            aria-expanded={expanded}
            aria-label="show details"
        >
            <ExpandMoreIcon fontSize="small" />
        </IconButton>
    );
};

export default ArrowButton;
