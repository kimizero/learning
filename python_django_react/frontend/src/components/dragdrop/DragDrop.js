import React from "react";
import Desk from "./Desk";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const DragDrop = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Desk></Desk>
        </DndProvider>
    );
};

export default DragDrop;
