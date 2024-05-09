import type {NextApiRequest, NextApiResponse} from "next";
import {AuthUser, withIronSessionApiRoute} from "gmaker/src/auth/iron-session/iron-session";
import {getUUID} from "gmaker/src/helpers/strings";

const generateUser = (): AuthUser => {
    return {id: getUUID(), name: "Anonymous"}
}

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<AuthUser>,
) => {
    if (!req.session.user) {
        req.session.user = generateUser()
        await req.session.save()
    }
    res.status(200).json(req.session.user)
}

export default withIronSessionApiRoute(handler)


