import type {NextApiRequest, NextApiResponse} from "next";
import {withGuardedSessionRoute} from "gmaker/src/auth/iron-session/iron-session";
import prisma from "gmaker/lib/prisma";
import {User} from "@prisma/client";

export type UpdateUserRequest = {
    name: string
}

interface Req extends NextApiRequest {
    body: UpdateUserRequest
}

const handler = async (
    req: Req,
    res: NextApiResponse<User>,
) => {
    try {
        req.session.user = await prisma.user.update({
            where: {
                id: req.session.user?.id ?? ""
            },
            data: {
                name: req.body.name
            }
        })
        await req.session.save()
    } catch (e) {
        res.status(500).end()
    }
    res.status(200).end()
}

export default withGuardedSessionRoute(handler)


