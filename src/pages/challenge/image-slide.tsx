import {Box, Stack, Typography} from "@mui/material";
import Image from "next/image";
import {useEffect, useState} from "react";

export const ImageSlide = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => {
                if (prev >= 5) {
                    return 0;
                }
                return prev + 1;
            });
        }, 700);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box sx={{
            position: "relative",
        }}>
            <Stack sx={{
                p: 2,
                background: "rgba(0, 0, 0, 0.8)",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                borderBottomLeftRadius: "12px",
                borderBottomRightRadius: "12px",
            }}>
                <Typography variant={"h6"} component={"p"} pb={1} fontWeight={600} sx={{
                    display: {
                        xs: "none",
                        sm: "block",
                    },
                }}>The game is simple.</Typography>
                <ol style={{
                    paddingInlineStart: "20px",
                    marginBlockStart: "0",
                    marginBlockEnd: "0",
                }}>
                    <li>Guess what the subject is in the image.</li>
                    <li>If you guess wrong, the image gets clearer.</li>
                    <li>Lose points for guessing wrong. Earn points for speed.</li>
                </ol>
            </Stack>
            <Box sx={{
                maxWidth: "1000px",
                width: "100%",
                maxHeight: "1000px",
                height: "100%",
                aspectRatio: "1/1",
                borderRadius: "12px",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                overflow: "hidden",
            }}>
                <Image
                    src={`/challenge/api/image/${process.env.NODE_ENV === "production" ? "2e3e189f-50d1-4232-a178-10cf81c2b88d.webp" : "4a60fb22-8ff8-401b-8a98-0ce8281b0ce1.webp"}`}
                    alt={"image"}
                    width={10 * (step) || 1}
                    height={10 * step || 1}
                    quality={step * 5}
                    style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "1/1",
                        objectFit: "contain",
                    }}
                />
            </Box>
        </Box>
    )
}