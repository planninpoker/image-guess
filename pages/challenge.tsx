import {Box, Button, Stack, TextField, Typography} from "@mui/material";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {
    ChallengeRoundSubmissionResponse,
    ChallengeSubmissionRequest,
    FullUserChallenge
} from "gmaker/app/challenge/api/route";
import {useEffect, useState} from "react";
import Image from "next/image";
import {StartChallengeRequest} from "gmaker/app/challenge/api/start/route";
import {CompletedCard} from "gmaker/src/pages/challenge/completed-card";
import Link from "next/link";
import {useAuthContext} from "gmaker/src/auth/auth-provider";
import {NameCard} from "gmaker/src/pages/challenge/name-card";
import {useSnackbar} from "notistack";
import {ImageLoaderProps} from "next/dist/shared/lib/image-config";

const useChallenge = () => {
    return useQuery({
        queryKey: ["challenge"],
        queryFn: async (): Promise<FullUserChallenge> => {
            const resp = await axios.get<FullUserChallenge>("/challenge/api");
            return resp.data;
        }
    });
}


const customLoader = ({
                          src,
                          width,
                          quality,
                      }:ImageLoaderProps) => {
    const encodedSrc = encodeURIComponent(src);
    return `https://image-guess.netlify.app/.netlify/images?url=${encodedSrc}&w=${width}&q=${quality}`;
}
const Challenge = () => {
    const {user} = useAuthContext()
    const [score, setScore] = useState(0)

    const [loading, setLoading] = useState(false)
    const [started, setStarted] = useState(false);
    const {data, isLoading} = useChallenge()

    const [value, setValue] = useState<string>("")
    const [round, setRound] = useState(0);
    const [attempt, setAttempt] = useState(0);
    const [startedAt, setStartedAt] = useState<Date | undefined>(undefined);

    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => {
        const roundsWithUserSubmission = (data?.rounds ?? []).filter(
                (round) => round.submissions.filter(
                    (s) => s.completed).length > 0
            )
        ;
        setRound(roundsWithUserSubmission.length);
    }, [data?.rounds]);

    useEffect(() => {
        if (data && data.scores.length > 0) {
            setScore(data.scores[0].score)
        }
    }, [data]);

    useEffect(() => {
        if (data) {
            setStarted(data.rounds[round]?.submissions.length > 0 ?? false)
        }
    }, [data, round]);

    const startChallenge = async () => {
        setLoading(true)
        try {
            const req: StartChallengeRequest = {
                challengeId: data?.id ?? ""
            }
            await axios.post("/challenge/api/start", req)
            setValue("")
            setStarted(true);
        } catch (e) {
            console.log(e)
        }
        setLoading(false)
    }

    const nextRound = () => {
        setValue("")
        setRound(round + 1);
        setAttempt(0);
    }

    const submitAttempt = async () => {
        setLoading(true)
        try {
            const req: ChallengeSubmissionRequest = {
                roundId: data?.rounds[round].id ?? "",
                submission: value,
                challengeId: data?.id ?? ""
            }
            const resp = await axios.post<ChallengeRoundSubmissionResponse>("/challenge/api", req)
            console.log(resp.data)
            if (resp.data.completed) {
                setScore(resp.data.score ?? 0)
            }
            if (resp.data.correct) {
                enqueueSnackbar("Correct!", {
                    variant: "success"
                })
                nextRound();
            } else {
                enqueueSnackbar("Incorrect", {
                    variant: "error"
                })
                setAttempt(attempt + 1)
                setValue("")
            }
        } catch (e) {

        }
        setLoading(false)
    }

    if (isLoading || !user || !data) {
        return <Stack>
            Loading...
        </Stack>
    }

    if (!user.name) {
        return <NameCard/>
    }

    if (!started && round === 0) {
        return <Button onClick={startChallenge}>
            Start Challenge
        </Button>
    }

    if (round === 10) {
        return <CompletedCard score={score}/>
    }

    const currentRound = data.rounds[round];

    return <Stack
        key={currentRound.id + attempt}
        spacing={4}
        py={{
            xs: 2,
            sm: 4,
        }}>
        <Stack>
            <Typography variant={"h1"}>
                {data.name}
            </Typography>
            <Typography variant={"body1"}>
                {data.description}
            </Typography>
        </Stack>
        <Stack spacing={1}>
            <form
                key={currentRound.id}
                style={{width: "100%"}}
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    submitAttempt();
                }}>
                <TextField
                    key={currentRound.id}
                    autoFocus
                    autoComplete={"off"}
                    fullWidth
                    disabled={loading}
                    placeholder={"What is in the image?"}
                    InputProps={{
                        endAdornment: <Button
                            type={"submit"}
                            disabled={loading}
                            sx={{
                                minWidth: 0,
                            }}><SendOutlinedIcon/></Button>
                    }}
                    value={value} onChange={(e) => {
                    setValue(e.target.value)
                }}/>
            </form>
            <Image
                // src={process.env.NODE_ENV === "production" ? `https://image-guess.netlify.app/challenge/api/image?imageId=${currentRound.imageId}` : `/challenge/api/image?imageId=${currentRound.imageId}`}
                // loader={process.env.NODE_ENV === "production" ? customLoader : undefined}
                src={`/challenge/api/image?imageId=${currentRound.imageId}`}
                alt={"image"}
                width={10 * (attempt) || 1}
                height={10 * attempt || 1}
                quality={attempt * 10}
                style={{
                    maxWidth: "1000px",
                    width: "100%",
                    maxHeight: "1000px",
                    height: "100%",
                    aspectRatio: "1/1",
                    objectFit: "contain",
                    borderRadius: "12px",
                }}
            />
            <Link href={"/"} style={{
                textDecoration: "none",
            }}>
                <Typography
                    sx={{
                        pt: 2,
                        color: "primary.light",
                        cursor: "pointer",
                    }}>
                    Give up and go back to main page
                </Typography>
            </Link>
        </Stack>
    </Stack>
}

export default Challenge;