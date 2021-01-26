import React from "react";
import { render } from "react-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, AppBar, Toolbar, Typography } from "@material-ui/core";
import Map from "./map/Map";
import DragDrop from "./dragdrop/DragDrop";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
    const theme = createMuiTheme({
        palette: {
            type: "dark",
        },
    });

/*
<AppBar position="fixed" className="appbar">
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Home
                    </Typography>
                </Toolbar>
            </AppBar>
*/

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            
            <Router>
                <Sidebar />
                <Switch>
                    <Route path="/map">
                        <Map />
                    </Route>
                    <Route path="/dragdrop">
                        <DragDrop></DragDrop>
                    </Route>
                </Switch>
            </Router>
        </ThemeProvider>
    );
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);
