import {NextResponse} from "next/server";
import prisma from "gmaker/lib/prisma";
import {Prisma} from "@prisma/client";

const challengeWithRounds = Prisma.validator<Prisma.ChallengeDefaultArgs>()({
    include: {
        rounds: true,
    },
})

export type ChallengeWithRounds = Prisma.ChallengeGetPayload<typeof challengeWithRounds>;

export const GET = async (request: Request) => {
    try {
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const challenge = await prisma.challenge.findFirst({
            where: {
                date: {
                    lt: startOfDay
                }
            },
            include: {
                rounds: true,
            },
            take: 10,
        })
        return NextResponse.json(challenge);
    } catch (e) {
        console.log(e);
        return NextResponse.json({Message: "Internal Server Error", status: 500});
    }
}