import {NextResponse} from "next/server";
import prisma from "gmaker/lib/prisma";
import {Prisma} from "@prisma/client";
import {cookies} from "next/headers";
import {sessionOptions} from "gmaker/src/auth/iron-session/iron-options";
import {getAppSession} from "gmaker/src/auth/iron-session/iron-session";

const fullChallenge = Prisma.validator<Prisma.ChallengeDefaultArgs>()({
    include: {
        rounds: {
            select: {
                id: true,
                imageId: true,
                submissions: true,
            },
        },
        scores: true,
    }
})

export type FullUserChallenge = Prisma.ChallengeGetPayload<typeof fullChallenge>;

export const GET = async (request: Request) => {
    const session = await getAppSession(cookies(), sessionOptions);
    if (!session?.user) {
        return NextResponse.json({Message: "Unauthorized", status: 401});
    }
    try {
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));

        const challenge = await prisma.challenge.findFirst({
            where: {
                date: startOfDay
            },
            include: {
                rounds: {
                    select: {
                        id: true,
                        imageId: true,
                        submissions: {
                            where: {
                                userId: session.user.id,
                            }
                        }
                    },
                },
                scores: {
                    where: {
                        userId: session.user.id,
                    }
                }
            }
        })

        return NextResponse.json(challenge)
    } catch (error) {
        console.log("Error occurred ", error);
        return NextResponse.json({Message: "Failed", status: 500});
    }
};

const calculateScore = (
    roundsCompleted: number,
    guessesUsed: number[],
    startTime: Date,
    endTime: Date
): number => {
    const baseScore = 1000;
    const roundScore = 100;
    const guessScore = 100;
    const timeBonusMultiplier = 3;

    let score = baseScore;

    // Add score based on the number of rounds completed
    score += roundScore * roundsCompleted;

    // Deduct score based on the number of guesses used in each round
    for (let i = 0; i < roundsCompleted; i++) {
        score -= guessScore * (guessesUsed[i] - 1);
    }

    // Calculate time bonus based on the total time taken
    const totalTime = (endTime.getTime() - startTime.getTime()) / 1000; // Convert milliseconds to seconds
    const timeBonus = Math.max(0, baseScore - totalTime * timeBonusMultiplier);
    score += timeBonus;

    // Ensure the score is non-negative
    score = Math.max(0, score);

    return Math.round(score);
};

export type ChallengeSubmissionRequest = {
    challengeId: string,
    roundId: string,
    submission: string,
}

export type ChallengeRoundSubmissionResponse = {
    correct: boolean,
    score?: number,
    completed?: boolean,
}

export const POST = async (request: Request) => {
    const session = await getAppSession(cookies(), sessionOptions);
    if (!session?.user) {
        return NextResponse.json({Message: "Unauthorized", status: 401});
    }
    try {
        const body = await request.json() as ChallengeSubmissionRequest;

        // check if correct
        const round = await prisma.challengeRound.findFirst({
            where: {
                id: body.roundId,
                name: body.submission.toLowerCase(),
            },
        })
        const submission = await prisma.challengeRoundSubmission.update({
            where: {
                userId_challengeRoundId: {
                    userId: session.user.id,
                    challengeRoundId: body.roundId,
                }
            },
            data: {
                attempts: {
                    increment: 1,
                },
                ...(!!round && {
                    completed: true,
                    finishedAt: new Date(),
                })
            },
        })
        // If guessed correctly, we need to create a new submission for the next round
        if (round) {
            const rounds = await prisma.challengeRound.findMany({
                where: {
                    challengeId: body.challengeId,
                },
            })
            const currentRoundIndex = rounds.findIndex(r => r.id === body.roundId);
            const nextRound = rounds[currentRoundIndex + 1];
            if (nextRound) {
                await prisma.challengeRoundSubmission.create({
                    data: {
                        userId: session.user.id,
                        challengeRoundId: nextRound.id,
                        completed: false,
                        attempts: 0,
                        startedAt: new Date(),
                    }
                })
            }
            // user is done with all rounds
            if (currentRoundIndex === 9) {
                const submissions = await prisma.challengeRoundSubmission.findMany({
                    where: {
                        userId: session.user.id,
                        challengeRoundId: {
                            in: rounds.map(r => r.id),
                        },
                        completed: true,
                    }
                })
                const roundsCompleted = submissions.filter(s => s.attempts < 10).length;
                const guessesUsed = submissions.map(s => s.attempts);
                const score = calculateScore(roundsCompleted, guessesUsed, submissions[0].startedAt, new Date());
                await prisma.challengeScore.create({
                    data: {
                        user: {
                            connect: {
                                id: session.user.id,
                            }
                        },
                        challenge: {
                            connect: {
                                id: body.challengeId,
                            }
                        },
                        score,
                    }
                })
                return NextResponse.json({correct: true, score, completed: true} as ChallengeRoundSubmissionResponse);
            }
        }
        return NextResponse.json({correct: !!round} as ChallengeRoundSubmissionResponse);
    } catch (e) {
        console.log("Error occurred ", e);
        return NextResponse.json({Message: "Failed", status: 500});
    }
}