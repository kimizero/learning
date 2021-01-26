import React, { useRef, useState } from "react";
import { Grid, Paper } from "@material-ui/core";
import MapControls from "./MapControls";

const Map = () => {
    const WIDTH = 100;
    const HEIGHT = 100;

    const [ZOOM, setZoom] = useState(1);
    const [MUL_FACTOR, setMulFactor] = useState(2);
    const [MAP_SEED, setMapSeed] = useState(777);

    const canvasRef = useRef(null);

    const drawCanvas = () => {
        let canvas = canvasRef.current;
        let ctx = canvas.getContext("2d");

        let img_size_w = WIDTH * MUL_FACTOR;
        let img_size_h = HEIGHT * MUL_FACTOR;

        let imgData = new Uint8Array(img_size_w * img_size_h * 4);

        ctx.clearRect(0, 0, img_size_w, img_size_h);

        let chunk_w_start = 0;
        let chunk_w_end = ~~(WIDTH / ZOOM);
        let chunk_h_start = 0;
        let chunk_h_end = ~~(HEIGHT / ZOOM);
        let moisture_seed = 333;

        var url = `/map?chunk_w_start=${chunk_w_start}&chunk_w_end=${chunk_w_end}&chunk_h_start=${chunk_h_start}&chunk_h_end=${chunk_h_end}&map_width=${WIDTH}&map_height=${HEIGHT}&map_seed=${MAP_SEED}&moisture_seed=${moisture_seed}&zoom=${ZOOM}`;

        fetch(url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return null;
                }
            })
            .then((data) => {
                for (let x = 0; x < ((chunk_h_end - chunk_h_start) * ZOOM * MUL_FACTOR); x++) {
                    for (let y = 0; y < ((chunk_w_end - chunk_w_start) * ZOOM * MUL_FACTOR); y++) {
                        let colorFill = data[~~(x / MUL_FACTOR)][~~(y / MUL_FACTOR)];

                        imgData[4 * (x * img_size_w + y)] = colorFill.r;
                        imgData[4 * (x * img_size_w + y) + 1] = colorFill.g;
                        imgData[4 * (x * img_size_w + y) + 2] = colorFill.b;
                        imgData[4 * (x * img_size_w + y) + 3] = 250;
                    }
                }

                var img2 = new ImageData(
                    new Uint8ClampedArray(imgData.buffer),
                    img_size_w,
                    img_size_h
                );

                createImageBitmap(img2).then((renderer) => {
                    ctx.drawImage(
                        renderer,
                        chunk_w_start * MUL_FACTOR* ZOOM,
                        chunk_h_start * MUL_FACTOR* ZOOM,
                        chunk_w_end * MUL_FACTOR* ZOOM,
                        chunk_h_end * MUL_FACTOR* ZOOM
                    );
                    /*
                    if (showPoints) {
                        ctx.fillStyle = "rgba(0, 0, 0, 255)";
                        biomes.forEach((p) =>
                            ctx.fillRect(p.w - 5, p.h - 5, 10, 10)
                        );
                    }*/
                });
            });
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={6} className="map">
                <canvas
                    width={WIDTH * MUL_FACTOR}
                    height={HEIGHT * MUL_FACTOR}
                    style={{ borderStyle: "solid" }}
                    ref={canvasRef}
                ></canvas>
            </Grid>
            <Grid item xs={6} className="controls">
                <MapControls
                    onClickUpdate={drawCanvas}
                    mulFactor={MUL_FACTOR}
                    setMulFactor={setMulFactor}
                    mapSeed={MAP_SEED}
                    setMapSeed={setMapSeed}
                    zoom={ZOOM}
                    setZoom={setZoom}
                />
            </Grid>
        </Grid>
    );
};

export default Map;
