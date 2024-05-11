import {Button, Stack, Typography} from "@mui/material";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
                    <Typography variant={"h1"} textAlign={"center"} sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                    }}>
                        Guess the Images
                    </Typography>

                </Stack>
                <ImageSlide/>
                <Stack
                    direction={{
                        xs: "column",
                        sm: "row",
                    }}
                    spacing={2}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Button
                        sx={{
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
                            px: 8,
                            py: 1,
                        }}
                        size={"large"}
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
                        <Button size={"large"} variant={"contained"} color={"secondary"}
                        component={"a"}
                                href={"/gallery"}
                                sx={{
                            py: 1,
                            width: {
                                xs: "100%",
                                sm: "auto",
                            },
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
                </Stack>
            </Stack>
            {data && <LeaderBoard data={data}/>}

        </Stack>
    );
}
