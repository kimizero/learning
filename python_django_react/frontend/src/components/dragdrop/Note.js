import React, { useState } from "react";
import { ItemTypes, ItemPalette } from "./Constants";
import NoteLink from "./NoteLink";
import ArrowButton from "../general/ArrowButton";
import EditButton from "../general/EditButton";
import ConnectButton from "../general/ConnectButton";
import { makeStyles } from "@material-ui/core/styles";
import { useDrag } from "react-dnd";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Collapse,
    Typography,
} from "@material-ui/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrop } from "react-dnd";

import CenterFocusStrongIcon from '@material-ui/icons/CenterFocusStrong';

const useStyles = makeStyles((theme) => ({
    note: {
        display: "inline-block",
        position: "absolute",
    },
    noteHeaderRoot: {
        padding: 8,
    },
    noteHeaderAction: {
        alignSelf: "center",
    },
    noteHeaderContent: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
}));

const Note = ({
    id,
    top,
    left,
    title,
    description,
    category,
    text,
    zIndex,
    color,
}) => {
    //style
    const classes = useStyles();

    //state
    const [expanded, setExpanded] = useState(false);
    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.NOTE, id, top, left },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const handleOnClickEdit = () => {
        console.log("EDIT");
    };

    //TEST
    const [{ isDraggingLink }, dragLink] = useDrag({
        item: { type: ItemTypes.NOTELINK, id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });
    const [, drop] = useDrop({
        accept: ItemTypes.NOTELINK,
        drop(item, monitor) {
            /*const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            moveNote(item.id, left, top);*/
            console.log(id, item, monitor);
            return undefined;
        },
    });

    return (
        <DndProvider backend={HTML5Backend}>
            <div ref={drop}>
                <Card
                    className={classes.note}
                    ref={drag}
                    style={{
                        opacity: isDragging ? 0 : 1,
                        cursor: isDragging ? "grabbing" : "grab",
                        left,
                        top,
                        zIndex,
                        backgroundColor: color
                            ? color.backgroundColor
                            : ItemPalette.DEF.backgroundColor,
                        border: color ? color.border : ItemPalette.DEF.border,
                        width: expanded ? "600px" : "300px",
                    }}
                >
                    <CardHeader
                        title={
                            <Typography variant="button">{title}</Typography>
                        }
                        subheader={description}
                        classes={{
                            root: classes.noteHeaderRoot,
                            content: classes.noteHeaderContent,
                            subheader: classes.noteHeaderContent,
                            action: classes.noteHeaderAction,
                        }}
                        avatar={category}
                    />
                    <CardActions disableSpacing>
                        <ArrowButton
                            expanded={expanded}
                            setExpanded={setExpanded}
                        />
                        <EditButton
                            onClickEdit={handleOnClickEdit}
                            style={{ marginLeft: "auto" }}
                        />
                        <span ref={dragLink}>
                        <CenterFocusStrongIcon  fontSize="small" ></CenterFocusStrongIcon>
                        </span>
                    </CardActions>

                    <Collapse in={expanded} timeout="0" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>{text}</Typography>
                            <Typography paragraph>Method:</Typography>
                            <Typography paragraph>
                                Heat 1/2 cup of the broth in a pot until
                                simmering, add saffron and set aside for 10
                                minutes.
                            </Typography>
                            <Typography paragraph>
                                Heat oil in a (14- to 16-inch) paella pan or a
                                large, deep skillet over medium-high heat. Add
                                chicken, shrimp and chorizo, and cook, stirring
                                occasionally until lightly browned, 6 to 8
                                minutes. Transfer shrimp to a large plate and
                                set aside, leaving chicken and chorizo in the
                                pan. Add pimentón, bay leaves, garlic, tomatoes,
                                onion, salt and pepper, and cook, stirring often
                                until thickened and fragrant, about 10 minutes.
                                Add saffron broth and remaining 4 1/2 cups
                                chicken broth; bring to a boil.
                            </Typography>
                            <Typography paragraph>
                                Add rice and stir very gently to distribute. Top
                                with artichokes and peppers, and cook without
                                stirring, until most of the liquid is absorbed,
                                15 to 18 minutes. Reduce heat to medium-low, add
                                reserved shrimp and mussels, tucking them down
                                into the rice, and cook again without stirring,
                                until mussels have opened and rice is just
                                tender, 5 to 7 minutes more. (Discard any
                                mussels that don’t open.)
                            </Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </div>
        </DndProvider>
    );
};

export default Note;
