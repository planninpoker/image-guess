import type {NextApiRequest, NextApiResponse} from "next";
import { withIronSessionApiRoute} from "gmaker/src/auth/iron-session/iron-session";
import {getUUID} from "gmaker/src/helpers/strings";
import prisma from "gmaker/lib/prisma";
import {User} from "@prisma/client";


const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<User>,
) => {
    res.setHeader("Cache-Control", "no-store")

    if (req.session.user) {
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.user.id
            }
        })
        if (user) {
            res.status(200).json(user)
            return
        }
    } else {
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


