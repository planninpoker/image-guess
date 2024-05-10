import {alpha, Theme} from "@mui/material/styles";
import {Components} from "@mui/material/styles/components";

export const appBorderRadius = 10;

export const componentOverrides: Components<Theme> = {
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                margin: 0,
                minHeight: "100vh",
                // @ts-ignore
                minHeight: "100dvh",
            },
        },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: ({theme}) => ({
                backgroundColor: theme.palette.background.paper,
                borderRadius: appBorderRadius,
            }),
        },
    },
    MuiButtonGroup: {
        styleOverrides: {
            root: {
                borderRadius: appBorderRadius,
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: ({theme, ownerState}) => ({
                borderRadius: appBorderRadius,
                textTransform: "none",
                ...(ownerState.variant === "outlined" && {
                    backgroundColor: theme.palette.background.paper,
                    "&:hover": {
                        backgroundColor: theme.palette.background.paper,
                    },
                }),
            }),
        },
    },
    MuiToggleButton: {
        styleOverrides: {
            root: ({theme}) => ({
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                "&:hover": {
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.primary.main}`,
                },
                borderRadius: appBorderRadius,
                ...(theme.palette.mode === "dark"
                    ? {
                        "&.Mui-selected": {
                            color: theme.palette.common.white,
                        },
                    }
                    : {}),
            }),
        },
    },
    MuiTooltip: {
        styleOverrides: {
            tooltip: {
                fontSize: "1rem",
                fontWeight: 400,
                backgroundColor: "#424242",
                color: "#e0e0e0",
                padding: "12px",
                borderRadius: "12px",
                maxWidth: "25rem",
            },
            arrow: {
                color: "#424242",
            },
        },
    },
    MuiCard: {
        styleOverrides: {
            root: {
                borderRadius: "20px",
                boxShadow: "0px 3px 3px 0px rgba(90, 114, 123, 0.11)",
            },
        },
    },
    MuiTable: {
        styleOverrides: {
            root: {
                borderRadius: appBorderRadius,
                overflow: "hidden",
            },
        },
    },
    MuiTableContainer: {
        styleOverrides: {
            root: ({_, theme}) => ({
                borderRadius: appBorderRadius,
                border: `1px solid ${theme.palette.divider}`,
            }),
        },
    },
    MuiTableRow: {
        styleOverrides: {
            root: ({_, theme}) => ({
                "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.grey["50"],
                },
                "&:nth-of-type(even)": {
                    backgroundColor: theme.palette.grey["200"],
                },
                // selected
                "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                    },
                },
                "&:last-child": {
                    "& td": {
                        borderBottom: 0,
                    },
                },
            }),
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                fontWeight: 500,
            },
            head: ({_, theme}) => ({
                backgroundColor: "#120e18",
                color: theme.palette.getContrastText(theme.palette.primary.main),
            }),
        },
    },
};
