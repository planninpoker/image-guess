import {Box} from "@mui/material";
import {ReactNode} from "react";

import backgroundSVG from "./background.svg";

export const Layout = ({children}: {
    children: ReactNode
}) => {
    return (
        <Box sx={{
            height: "100dvh",
            width: "100vw",
            backgroundImage: `url(${backgroundSVG.src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
        }}>
            <Box sx={{
                width: "100%",
                height: "100%",
                overflow: "auto",
                backgroundColor: "rgba(50, 0, 0, 0.3)",
            }}>
                <Box sx={{
                    px: 2,
                    width: "100%",
                    maxWidth: "700px",
                    margin: "auto",
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    )
}