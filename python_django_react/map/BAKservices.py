import math
from random import random, randint
from opensimplex import OpenSimplex

class MapService():
    elevation = []
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

    def __init__(self, width=300, height=150):
        # normalize the frequencies for the cylinder: if height < width, then height "grows" slower than width, hence the normalization.
        # if they are the same nothing changes. If the width can be bigger, then rewrite the code
        self.rad_normalizer_height = (height / width) * math.pi
        self.height = height
        self.width = width

        self.__init_points()
        self.__gen_map()

    def __init_points(self):
        w = self.width / self.grid
        h = self.height / self.grid

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
    def distance(w1, w2, h1, h2):
        return math.sqrt(math.pow((w1 - w2), 2) + math.pow((h1 - h2), 2))

    def elevation_normalizer(self, elevation, w, h):
        new_elevation = elevation

        for biome in self.biomes:
            # compute the normal distance
            dist1 = self.distance(w, biome["w"], h, biome["h"]) / self.biome_min_dist

            # compute the distance with the same point but considering also the translations, for the cases that
            # wrap around the map
            if w < biome["w"]:
                dist2 = self.distance(
                    w + self.width, biome["w"], h, biome["h"]) / self.biome_min_dist
            else:
                dist2 = self.distance(
                    w, biome["w"] + self.width, h, biome["h"]) / self.biome_min_dist

            dist = min(dist1, dist2)

            if dist <= 1:
                new_elevation = (new_elevation + biome["e"] * (1 - dist) *
                                 self.biome_weight) / (1 + (1 - dist) * self.biome_weight)

        return new_elevation

    def moisture_normalizer(self, moisture, w, h):
        dist = abs(h - (self.height / 2)) / (self.height / 2)

        return (moisture + dist * self.moisture_weight) / (1 + dist * self.biome_weight)

    int_bound = 65535

    def __gen_map(self, map_seed=randint(-int_bound, int_bound), moisture_seed=randint(-int_bound, int_bound)):
        map_noise = OpenSimplex(map_seed)
        moisture_noise = OpenSimplex(moisture_seed)

        for h in range(0, self.height):
            self.elevation.append([])
            
            for w in range(0, self.width):
                nw = w / self.width
                nh = h / self.height

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

                e = self.elevation_normalizer(e, w, h)
                #m = self.moisture_normalizer(m, w, h)
                # Elevation
                self.elevation[h].append(pow(e, self.distribution))
                
                # Moisture
                #self.moisture[h][w] = pow(m, 2)
