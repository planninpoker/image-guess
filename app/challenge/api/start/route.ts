import {NextResponse} from "next/server";
import prisma from "gmaker/lib/prisma";
import {cookies} from "next/headers";
import {sessionOptions} from "gmaker/src/auth/iron-session/iron-options";
import {getAppSession} from "gmaker/src/auth/iron-session/iron-session";

export type StartChallengeRequest = {
    challengeId: string,
}

export const POST = async (request: Request) => {
    const session = await getAppSession(cookies(), sessionOptions);
    if (!session?.user) {
        return NextResponse.json({Message: "Unauthorized", status: 401});
    }
    try {
        const body = await request.json() as StartChallengeRequest;

        const rounds = await prisma.challengeRound.findMany({
            where: {
                challengeId: body.challengeId,
            },
        })

        await prisma.challengeRoundSubmission.create({
            data: {
                user: {
                    connect: {
                        id: session.user.id,
                    }
                },
                challengeRound: {
                    connect: {
                        id: rounds[0].id,
                    }
                },
                completed: false,
                attempts: 0,
                startedAt: new Date(),
            }
        })
        return NextResponse.json({Message: "Success", status: 200});
    } catch (e) {
        console.log("Error occurred ", e);
        return NextResponse.json({Message: "Failed", status: 500});
    }
}