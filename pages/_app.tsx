import {AppCacheProvider} from '@mui/material-nextjs/v13-pagesRouter';
import {ThemeProvider} from '@mui/material/styles';
import type {AppProps} from "next/app";
import theme from "gmaker/src/theme/theme";
import {AuthProvider} from "gmaker/src/auth/auth-provider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Layout} from "gmaker/src/layout/page";
import Head from "next/head";
import {CssBaseline} from '@mui/material';
import {SnackbarProvider} from "notistack";

import MetaImage from "../public/thinking.jpg";

const queryClient = new QueryClient()

export default function App(props: AppProps) {
    return (
        <AppCacheProvider {...props}>
            <Head>
                <title>Guess the Images</title>
                <meta name="description" content="Image Guesser is a daily game where you guess what the image is as they load in!"/>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta property="og:image" content={MetaImage.src}/>
                <meta key={"image"} name={"image"} content={MetaImage.src} />
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <SnackbarProvider autoHideDuration={1000} anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}>
                    <QueryClientProvider client={queryClient}>
                        <AuthProvider>
                            <Layout>
                                <props.Component {...props.pageProps} />
                            </Layout>
                        </AuthProvider>
                    </QueryClientProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </AppCacheProvider>
    )
}
