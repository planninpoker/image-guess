import type {NextApiRequest, NextApiResponse} from "next";
import { withIronSessionApiRoute} from "gmaker/src/auth/iron-session/iron-session";
import {getUUID} from "gmaker/src/helpers/strings";
import prisma from "gmaker/lib/prisma";
import {User} from "@prisma/client";


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<User>,
) => {
    // no cache
    res.setHeader("Cache-Control", "no-store")
    if (!req.session.user) {
        req.session.user = await prisma.user.create({
            data: {
                id: getUUID(),
                name: ""
            }
        })
        await req.session.save()
    }
    res.status(200).json(req.session.user)
}

export default withIronSessionApiRoute(handler)


