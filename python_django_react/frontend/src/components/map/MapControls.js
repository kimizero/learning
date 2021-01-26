import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";

const MapControls = ({
    onClickUpdate,
    mulFactor,
    setMulFactor,
    mapSeed,
    setMapSeed,
    zoom,
    setZoom,
}) => {
    const handleOnChangeMulFactor = (event) => setMulFactor(event.target.value);
    const handleOnChangeMapSeed = (event) => setMapSeed(event.target.value);
    const handleOnChangeZoom = (event) => setZoom(event.target.value);

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <TextField
                    required
                    label="Map Seed"
                    defaultValue={mapSeed}
                    onChange={handleOnChangeMapSeed}
                    variant="filled"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    label="Multiplication Factor"
                    type="number"
                    defaultValue={mulFactor}
                    onChange={handleOnChangeMulFactor}
                    variant="filled"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    label="Zoom"
                    type="number"
                    defaultValue={zoom}
                    onChange={handleOnChangeZoom}
                    variant="filled"
                />
            </Grid>
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onClickUpdate}
                >
                    Aggiorna
                </Button>
            </Grid>
        </Grid>
    );
};

export default MapControls;
