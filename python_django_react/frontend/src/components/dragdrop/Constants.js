import React from "react";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import AdjustIcon from "@material-ui/icons/Adjust";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import {red, blue, grey, green, yellow} from '@material-ui/core/colors';

export const ItemTypes = {
    NOTE: "note",
    NOTELINK: "noteLink"
};

export const ItemCategory = {
    COLD: <AcUnitIcon />,
    TREE: <AccountTreeIcon />,
    ADJUST: <AdjustIcon />,
};

const back = 800;
const bor = 300

export const ItemPalette = {
    DEF: { backgroundColor: grey[back], border: `1px ${grey[bor]} solid` },
    RED: { backgroundColor: red[back], border: `1px ${red[bor]} solid` },
    BLUE: { backgroundColor: blue[back], border: `1px ${blue[bor]} solid` },
    GREEN: { backgroundColor: green[back], border: `1px ${green[bor]} solid` },
    YELLOW: { backgroundColor: yellow[back], border: `1px ${yellow[bor]} solid` },
};
