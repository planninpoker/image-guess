import {Card, Stack, Typography} from "@mui/material";
import Link from "next/link";

export const CompletedCard = ({score}: {
    score: number
}) => {
    return (
        <Stack py={{
            xs: 2,
            sm: 12,
        }}>
            <Card sx={{
                p: 2,
            }}>
                <Stack>
                    <Typography textAlign={"center"} variant={"h2"} pb={2} color={"secondary.light"}>
                        Great Job!
                    </Typography>
                    <Typography textAlign={"center"} pb={1}>
                        You have completed today&apos;s challenge.
                    </Typography>
                    <Typography textAlign={"center"}>
                        Your score is: <Typography component={"span"} fontWeight={700}>
                        {score} 🤯
                    </Typography>
                    </Typography>
                </Stack>
            </Card>
            <Link href={"/"}>
                <Typography
                    sx={{
                        pt:2,
                        color: "primary.light",
                        cursor: "pointer",
                        textDecoration: "underline",
                        textAlign: "center",
                    }}>
                    Go back to main page
                </Typography>
            </Link>
        </Stack>
    )
}