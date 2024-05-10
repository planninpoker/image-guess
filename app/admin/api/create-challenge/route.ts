import {NextResponse} from "next/server";
import prisma from "gmaker/lib/prisma";

export type CreateChallengeRequest = {
    name: string;
    description: string;
    date: Date;
    images: {
        id: string;
        name: string;
    }[]
}

export const POST = async (request: Request) => {
    try {
        const body: CreateChallengeRequest = await request.json();
        const date = new Date(body.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));

        const challenge = await prisma.challenge.create({
            data: {
                name: body.name,
                description: body.description,
                date: startOfDay,
            }
        })
        await prisma.$transaction([
            ...body.images.map((imageId) => prisma.challengeRound.create({
                data: {
                    challengeId: challenge.id,
                    imageId: `${imageId.id}.webp`,
                    name: imageId.name.toLowerCase(),
                }
            }))
        ])
        return NextResponse.json({Message: "Success", status: 201});
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({Message: "Failed", status: 500});
    }
};