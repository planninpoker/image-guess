import {AppCacheProvider} from '@mui/material-nextjs/v13-pagesRouter';
import {ThemeProvider} from '@mui/material/styles';
import type {AppProps} from "next/app";
import {theme} from "gmaker/src/theme/theme";
import {AuthProvider} from "gmaker/src/auth/auth-provider";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Layout} from "gmaker/src/layout/page";

const queryClient = new QueryClient()

export default function App(props: AppProps) {
    return (
        <AppCacheProvider {...props}>
            <ThemeProvider theme={theme}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Layout>
                            <props.Component {...props.pageProps} />
                        </Layout>
                    </AuthProvider>
                </QueryClientProvider>
            </ThemeProvider>
        </AppCacheProvider>
    )
}
