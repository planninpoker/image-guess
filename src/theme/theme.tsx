import {createTheme} from '@mui/material/styles';
import {componentOverrides} from "gmaker/src/theme/component-overrides";
import {typography} from "gmaker/src/theme/typography";
import { red} from "@mui/material/colors";
import {responsiveFontSizes} from "@mui/material";

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) =>
    augmentColor({ color: { main: mainColor } });

const theme = createTheme({
    typography: typography,
    components: componentOverrides,
    palette: {
        mode: "dark",
        primary: createColor("#7035ce"),
        secondary: createColor("#FC356E"),
        success: createColor("#279e2b"),
        background: {
            default: "#111111",
            paper: "#2a2a2a",
        },
        error: createColor(red.A700),
        text: {
            primary: "#e8edef",
            secondary: "#cccfd0",
            disabled: palette.grey["500"],
        },
        grey: {
            50: "#212121",
            100: "#212121",
            200: "#424242",
            300: "#616161",
            400: "#757575",
            500: "#9e9e9e",
            600: "#bdbdbd",
            700: "#e0e0e0",
            800: "#eeeeee",
            900: "#f5f5f5",
        },
    }
});

export default responsiveFontSizes(theme);

