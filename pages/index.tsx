import {Box, Button, Stack, Typography} from "@mui/material";
import PlayCircleFilledWhiteOutlinedIcon from '@mui/icons-material/PlayCircleFilledWhiteOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {ChallengeWithScores} from "gmaker/app/challenge/api/leaderboard/route";
import {LeaderBoard} from "gmaker/src/components/leader-board";
import {ImageSlide} from "gmaker/src/pages/challenge/image-slide";
import Link from "next/link";

const useChallenge = () => {
    return useQuery({
        queryKey: ["challenge", "scores"],
        refetchOnMount: true,
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
                <Stack
                direction={"row"}
                spacing={2}
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Button
                        sx={{
                            px: 8,
                            py: 1,

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
                    <Link href={"/gallery"}>
                        <Button size={"large"} variant={"contained"} color={"secondary"} sx={{
                            py: 1,
                        }}>
                            <Typography variant={"h3"} component={"p"} sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                            }}>
                                <CollectionsOutlinedIcon fontSize={"inherit"}/>
                                Gallery
                            </Typography>

                        </Button>
                    </Link>
                </Stack>
            </Stack>
            {data && <LeaderBoard data={data}/>}

        </Stack>
    );
}
