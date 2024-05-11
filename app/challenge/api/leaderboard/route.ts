import {NextRequest, NextResponse} from "next/server";
import prisma from "gmaker/lib/prisma";
import {Prisma} from "@prisma/client";

const challengeWithScores = Prisma.validator<Prisma.ChallengeDefaultArgs>()({
    include: {
        scores: {
            include: {
                user: true
            }
        },
    }
})

export type ChallengeWithScores = Prisma.ChallengeGetPayload<typeof challengeWithScores>;

export const POST = async (request: Request) => {
    try {
        const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
        const challenge = await prisma.challenge.findFirst({
            where: {
                date: startOfDay
            },
            include: {
                scores: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        score: "desc"
                    }
                },
            }
        })
        const response = NextResponse.json(challenge);
        response.headers.set("Cache-Control", "no-store");
        return response;
    } catch (e) {
        console.log(e);
        return NextResponse.json({Message: "Internal Server Error", status: 500});
    }
}