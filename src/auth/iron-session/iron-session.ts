import {getIronSession, IronSession, IronSessionData, SessionOptions} from "iron-session";
import type {NextApiRequest, NextApiResponse} from "next";

import {sessionOptions} from "./iron-options";
import {NextApiHandler} from "next/dist/shared/lib/utils";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";
import {User} from "@prisma/client";

declare module "iron-session" {
    interface IronSessionData {
        user?: User;
    }
}

declare module "next" {
    interface NextApiRequest {
        session: IronSession<IronSessionData>;
    }
}

export const MISSING_SESSION = "MISSING_SESSION";

export const getAppSession = async (cookies: ReadonlyRequestCookies, sessionOptions: SessionOptions) => {
    return getIronSession<IronSessionData>(cookies, sessionOptions);
};

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