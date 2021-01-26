import React, { useState } from "react";
import Note from "./Note";
import { ItemTypes, ItemCategory, ItemPalette } from "./Constants";
import { useDrop } from "react-dnd";
import update from "immutability-helper";

const Desk = () => {
    const [notes, setNotes] = useState({
        a: {
            top: 20,
            left: 80,
            title: "A - Drag me around",
            description: "this is the first description, let's see how it's going to be",
            text: "asd",
            category: ItemCategory.COLD,
            zIndex: 1,
            color: ItemPalette.RED
        },
        b: {
            top: 300,
            left: 300,
            title: "B - Drag me too",
            description: "this is the second description, let's see how it's going to be",
            text: "asd",
            category: ItemCategory.TREE,
            zIndex: 2,
            color: ItemPalette.BLUE
        },
        c: {
            top: 800,
            left: 800,
            title: "C - Drag me too",
            description: "this is the third description, I know",
            text: "asd",
            category: ItemCategory.ADJUST,
            zIndex: 3,
        },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.NOTE,
        drop(item, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            moveNote(item.id, left, top);
            return undefined;
        },
    });

    const moveNote = (id, left, top) => {
        var z = notes[id]["zIndex"];
        var count = 0;
        var tempNotes = notes;

        Object.keys(notes).map((key) => {
            var { zIndex } = notes[key];
            count++;

            if (key != id && zIndex >= z) {
                zIndex--;

                tempNotes = update(tempNotes, {
                    [key]: {
                        $merge: { zIndex },
                    },
                });
            }
        });

        setNotes(
            update(tempNotes, {
                [id]: {
                    $merge: { left, top, zIndex: count },
                },
            })
        );
    };

    return (
        <div ref={drop} className="desk">
            {Object.keys(notes).map((key) => {
                const values = notes[key];
                return (
                    <Note
                        key={key}
                        id={key}
                        {...values}
                    ></Note>
                );
            })}
        </div>
    );
};

export default Desk;
