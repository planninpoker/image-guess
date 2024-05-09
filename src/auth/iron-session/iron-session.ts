import {getIronSession, IronSession, IronSessionData} from "iron-session";
import type {NextApiRequest, NextApiResponse} from "next";

import {sessionOptions} from "./iron-options";
import {NextApiHandler} from "next/dist/shared/lib/utils";

export type AuthUser = {
    id: string;
    name: string;
}

declare module "iron-session" {
    interface IronSessionData {
        user?: AuthUser;
    }
}

declare module "next" {
    interface NextApiRequest {
        session: IronSession<IronSessionData>;
    }
}

export const MISSING_SESSION = "MISSING_SESSION";

const getSession = async (req: NextApiRequest, res: NextApiResponse) => {
    return getIronSession<IronSessionData>(req, res, sessionOptions);
};

type RequestHandler = (req: NextApiRequest, res: NextApiResponse, session: IronSessionData) => Promise<void>;

export const withIronSessionApiRoute = (
    handler: NextApiHandler
) => {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        req.session = await getSession(req, res);
        return handler(req, res);
    };
};

export function withGuard(handler: NextApiHandler) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (!req.session.user) {
            return res.status(403).json({message: MISSING_SESSION});
        }
        return handler(req, res);
    };
}

export function withGuardedSessionRoute(handler: NextApiHandler) {
    return withIronSessionApiRoute(withGuard(handler))
}