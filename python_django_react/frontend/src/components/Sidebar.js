import React from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@material-ui/core";
import MapIcon from "@material-ui/icons/Map";
import PanToolIcon from "@material-ui/icons/PanTool";

const Sidebar = () => {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
            className="drawer"
            classes={{
                paper: "drawer-paper",
            }}
        >
            <Toolbar />
            <div className="drawer-container">
                <List>
                    <ListItem button component="a" key="map" href="/map">
                        <ListItemIcon>
                            <MapIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mappa" />
                    </ListItem>
                    <ListItem
                        button
                        component="a"
                        key="dragdrop"
                        href="/dragdrop"
                    >
                        <ListItemIcon>
                            <PanToolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Drag'n'Drop" />
                    </ListItem>
                </List>
            </div>
        </Drawer>
    );
};

export default Sidebar;
