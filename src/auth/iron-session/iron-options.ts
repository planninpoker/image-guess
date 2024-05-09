import * as IronSession from "iron-session";

const oneYear = 365 * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === "production";

export const sessionOptions: IronSession.SessionOptions = {
    password: process.env.IRON_SESSION ?? "",
    cookieName: "image-guess.token",
    ttl: oneYear,
    cookieOptions: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProduction,
        expires: new Date(Date.now() + oneYear),
        maxAge: oneYear,
    },
};
