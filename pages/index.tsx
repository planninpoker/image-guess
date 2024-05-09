import {Box, Button, Stack, Typography} from "@mui/material";
import Head from "next/head";
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import {useRouter} from "next/router";

export default function Home() {
    const {user, isLoading} = useAuthContext()
    const router = useRouter()
    return (
        <Stack>
            <Stack>
                <Typography variant={"h1"}>Welcome to Image Guesser</Typography>
                <Typography variant={"body1"}>Guess the image as fast as you can. Every time you guess wrong, the image
                    will get less blurry. You lose points for each vote.</Typography>
            </Stack>
            <Button onClick={() => {
                router.push("/challenge")
            }}>
                Start
            </Button>
            <Box>
                <Typography>
                    Leaderboard
                </Typography>
            </Box>
        </Stack>
    );
}
