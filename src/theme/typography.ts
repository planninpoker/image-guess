import {Roboto} from "next/font/google";

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
});
export const typography = {
    fontFamily: roboto.style.fontFamily,
    body1: {
        lineHeight: 1.6,
    },
    body2: {
        lineHeight: 1.6,
    },
    bodyLarge: {
        fontWeight: 400,
        fontSize: "1.125rem",
        lineHeight: 1.75,
    },
    h1: {
        fontWeight: 700,
        fontSize: "4rem",
        lineHeight: 1.2,
    },
    h2: {
        fontWeight: 600,
        fontSize: "2rem",
        lineHeight: 1.375,
    },
    h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        lineHeight: 1.4,
    },
    h4: {
        fontWeight: 600,
        fontSize: "1.4rem",
        lineHeight: 1.5,
    },
    h5: {
        fontWeight: 600,
        fontSize: "1.3rem",
        lineHeight: 1.6,
    },
    h6: {
        fontWeight: 600,
        fontSize: "1.125rem",
        lineHeight: 1.7,
    },
}