import {Box, Button, Stack, Typography} from "@mui/material";
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {ChallengeWithScores} from "gmaker/app/challenge/api/leaderboard/route";
import {LeaderBoard} from "gmaker/src/components/leader-board";
import {ImageSlide} from "gmaker/src/pages/challenge/image-slide";

const useChallenge = () => {
    return useQuery({
        queryKey: ["challenge", "scores"],
        queryFn: async (): Promise<ChallengeWithScores> => {
            const resp = await axios.get<ChallengeWithScores>("/challenge/api/leaderboard");
            return resp.data;
        }
    });
}

export default function Home() {
    const {user, isLoading} = useAuthContext();
    const {data} = useChallenge();
    const router = useRouter()
    return (
        <Stack spacing={8} py={{
            xs: 4,
            sm: 6,
        }}>
            <Stack spacing={4}>
                <Stack>
                    <Typography variant={"h1"} textAlign={"center"}>Guess the Images</Typography>
                </Stack>
                <ImageSlide/>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Button
                        sx={{
                            px: 8,
                            py: 2,

                        }}
                        size={"large"}
                        fullWidth={false}
                        variant={"contained"}
                        onClick={() => {
                            router.push("/challenge")
                        }}>
                        <Typography variant={"h3"} component={"p"} sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}>
                            <PlayCircleFilledWhiteOutlinedIcon fontSize={"inherit"}/>
                            Play the Game
                        </Typography>
                    </Button>
                </Box>
            </Stack>
            {data && <LeaderBoard data={data}/>}

        </Stack>
    );
}
