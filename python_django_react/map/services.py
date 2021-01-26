import math
from random import random, randint, seed
from opensimplex import OpenSimplex


class MapService():
    # elevation = []
    moisture = []
    biomes = []

    biome_min_dist = 100
    biome_weight = 0.6
    moisture_weight = 1
    grid = 10
    octave = 6
    distribution = 3.0
    frequency = 4
    showPoints = False
    useColor = True

    _int_bound = 65535

    def __init__(self, chunk_w_start: int, chunk_w_end: int, chunk_h_start: int, chunk_h_end: int, map_width: int, map_height: int, map_seed: int, moisture_seed: int, zoom: int):
        self.map_width = int(map_width)
        self.map_height = int(map_height)
        self.chunk_w_start = int(chunk_w_start)
        self.chunk_w_end = int(chunk_w_end)
        self.chunk_h_start = int(chunk_h_start)
        self.chunk_h_end = int(chunk_h_end)

        self.data = []

        self.zoom = int(zoom) if zoom is not None else 1
        self.map_seed = int(
            map_seed) if map_seed is not None else randint(-self._int_bound, self._int_bound)
        self.moisture_seed = int(
            moisture_seed) if moisture_seed is not None else randint(-self._int_bound, self._int_bound)

        # normalize the frequencies for the cylinder: if height < width, then height "grows" slower than width, hence the normalization.
        # if they are the same nothing changes. If the width can be bigger, then rewrite the code
        self.rad_normalizer_height = (
            self.map_height / self.map_width) * math.pi

        # self._init_points()
        self._gen_map(self.map_seed, self.moisture_seed)

    def _init_points(self, seed_val):
        seed(seed_val)
        w = self.map_width / self.grid
        h = self.map_height / self.grid

        for x in range(self.grid):
            for y in range(self.grid):
                idx = y + (x * self.grid)

                p = {
                    "id": idx,
                    "w": (random() * w) + (w * y),
                    "h": (random() * h) + (h * x),
                    "e": random()
                }

            self.biomes.append(p)

    @staticmethod
    def _distance(w1, w2, h1, h2):
        return math.sqrt(math.pow((w1 - w2), 2) + math.pow((h1 - h2), 2))

    def _elevation_normalizer(self, elevation, w, h):
        new_elevation = elevation

        for biome in self.biomes:
            # compute the normal distance
            dist1 = self._distance(
                w, biome["w"], h, biome["h"]) / self.biome_min_dist

            # compute the distance with the same point but considering also the translations, for the cases that
            # wrap around the map
            if w < biome["w"]:
                dist2 = self._distance(
                    w + self.map_width, biome["w"], h, biome["h"]) / self.biome_min_dist
            else:
                dist2 = self._distance(
                    w, biome["w"] + self.map_width, h, biome["h"]) / self.biome_min_dist

            dist = min(dist1, dist2)

            if dist <= 1:
                new_elevation = (new_elevation + biome["e"] * (1 - dist) *
                                 self.biome_weight) / (1 + (1 - dist) * self.biome_weight)

        return new_elevation

    def _moisture_normalizer(self, moisture, w, h):
        dist = abs(h - (self.map_height / 2)) / (self.map_height / 2)

        return (moisture + dist * self.moisture_weight) / (1 + dist * self.biome_weight)

    def _gen_map(self, map_seed, moisture_seed):
        # init of the noise functions
        map_noise = OpenSimplex(map_seed)
        moisture_noise = OpenSimplex(moisture_seed)

        # the max bound is to get the size of the chunk and multiply by the zoom because:
        # if the zoom is 1 (normal view) I need points that goes from 0 to the size of the chunk and add the delta (which is the chunk start)
        # if the zoom is > 1, I need more points in the same chunk size, for instance if the zoom is 2 the I need double the points
        for h in range(0, (self.chunk_h_end - self.chunk_h_start) * self.zoom):
            self.data.append([])
            
            for w in range(0, (self.chunk_w_end - self.chunk_w_start) * self.zoom):
                nw = ((w / self.zoom) + self.chunk_w_start) / self.map_width
                nh = ((h / self.zoom) + self.chunk_h_start) / self.map_height
                e = 0
                n = 0
                m = 0

                # -NORMALE------------------------------------------
                """
                for (let i = 1; i <= this.octave; i++) {
                let pow = Math.pow(2, i - 1);
                e += (1 / pow) * noise.simplex2(pow * this.frequency * nw,
                        (this.frequency * (this.HEIGHT / this.WIDTH)) * pow * nh);
                n += 1 / i;
                }

                e /= n;

                for (let i = 1; i <= this.octave; i++) {
                let pow = Math.pow(2, i - 1);
                m += (1 / pow) * moistureNoise.simplex2(pow * nw, pow * nh);
                n += 1 / i;
                }

                m /= n;
                """
                # -NORMALE------------------------------------------

                # -RADIUS------------------------------------------
                x = nw * 2 * math.pi
                x_sin = (math.sin(x) + 1) / 2
                x_cos = (math.cos(x) + 1) / 2

                for i in range(1, self.octave + 1):
                    val_pow = math.pow(2, i - 1)
                    e += (1 / val_pow) * map_noise.noise3d(self.frequency * val_pow * x_sin, self.frequency *
                                                           val_pow * x_cos, self.frequency * self.rad_normalizer_height * val_pow * nh)
                    m += (1 / val_pow) * moisture_noise.noise3d(val_pow * x_sin,
                                                                val_pow * x_cos, self.rad_normalizer_height * val_pow * nh)
                    n += 1 / i

                e /= n
                m /= n
                # -RADIUS------------------------------------------

                # Normalization: function return a value between -1 and 1
                e = (e + 1) / 2
                m = (m + 1) / 2

                # e = self.elevation_normalizer(e, w, h)
                # m = self.moisture_normalizer(m, w, h)
                # Elevation
                e = pow(e, self.distribution)
                
                self.data[h].append(self._find_color(e, m))

                # Moisture
                # self.moisture[h][w] = pow(m, 2)

    # COLORS
    _ocean = {"r": 67, "g": 67, "b": 122}
    _beach = {"r": 147, "g": 134, "b": 119}
    _scorched = {"r": 99, "g": 96, "b": 106}
    _bare = {"r": 136, "g": 136, "b": 136}
    _tundra = {"r": 185, "g": 185, "b": 169}
    _snow = {"r": 222, "g": 222, "b": 229}
    _temperate_desert = {"r": 201, "g": 210, "b": 155}
    _shrubland = {"r": 136, "g": 153, "b": 119}
    _taiga = {"r": 152, "g": 169, "b": 119}
    _grassland = {"r": 136, "g": 171, "b": 85}
    _temperate_deciduous_forest = {"r": 103, "g": 147, "b": 89}
    _temperate_rain_forest = {"r": 67, "g": 136, "b": 85}
    _subtropical_desert = {"r": 210, "g": 185, "b": 139}
    _tropical_seasonal_forest = {"r": 86, "g": 153, "b": 68}
    _tropical_rain_forest = {"r": 51, "g": 119, "b": 85}

    def _find_color(self, e, m):
        if e < 0.1:
            return self._ocean
        if e < 0.11:
            return self._beach

        if e > 0.8:
            if m < 0.1:
                return self._scorched
            if m < 0.2:
                return self._bare
            if m < 0.5:
                return self._tundra
            return self._snow

        if e > 0.6:
            if m < 0.33:
                return self._temperate_desert
            if m < 0.66:
                return self._shrubland
            return self._taiga

        if e > 0.3:
            if m < 0.16:
                return self._temperate_desert
            if m < 0.5:
                return self._grassland
            if m < 0.83:
                return self._temperate_deciduous_forest
            return self._temperate_rain_forest

        if m < 0.16:
            return self._subtropical_desert
        if m < 0.33:
            return self._grassland
        if m < 0.66:
            return self._tropical_seasonal_forest
        return self._tropical_rain_forest
