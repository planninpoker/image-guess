import {ChallengeWithScores} from "gmaker/app/challenge/api/leaderboard/route";
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import {useAuthContext} from "gmaker/src/auth/auth-provider";

type LeaderBoardProps = {
    data: ChallengeWithScores;
}
export const LeaderBoard = ({data}: LeaderBoardProps) => {
    const {user} = useAuthContext()
    return (
        <Box id={"leaderboard"}>
            <Typography variant={"h4"} pb={2} textAlign={"center"}>
                Today&apos;s Leaderboard
            </Typography>
            <Table stickyHeader size={"small"}>
                <TableHead>
                    <TableRow>
                        <TableCell>Rank</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.scores.map((score, idx) => (
                        <TableRow key={score.id} selected={user?.id === score.userId} hover={false}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{score.user.name}</TableCell>
                            <TableCell>{score.score}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    )
}