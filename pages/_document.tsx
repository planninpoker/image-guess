import {Head, Html, Main, NextScript} from "next/document";
import {documentGetInitialProps, DocumentHeadTags} from "@mui/material-nextjs/v13-pagesRouter";

export default function MyDocument(props: any) {
    return (
        <Html lang="en">
            <Head>
                <DocumentHeadTags {...props} />
            </Head>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}

MyDocument.getInitialProps = async (ctx: any) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};