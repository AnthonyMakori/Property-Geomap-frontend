import type {AppProps} from 'next/app'
import Head from "next/head";
import {ColorScheme, ColorSchemeProvider, MantineProvider} from '@mantine/core';
import {useState} from "react";
import {getCookie} from 'cookies-next';
import {GetServerSidePropsContext} from "next";
import {useColorScheme} from "@mantine/hooks";
import {ModalsProvider} from "@mantine/modals";
import {RouterTransition} from '@/components';
import "../styles/globals.css";
import {Notifications} from "@mantine/notifications";
import { Provider } from 'react-redux';
import store from '../store/store';

export default function App(props: AppProps & { colorScheme: ColorScheme }) {
    const {Component, pageProps} = props;
    const preferredColorScheme = useColorScheme();
    const [colorScheme, setColorScheme] = useState<ColorScheme>(preferredColorScheme);

    const toggleColorScheme = (value?: ColorScheme): void =>
        setColorScheme(value ?? (colorScheme === 'dark' ? 'light' : 'dark'));

        return (
            <Provider store={store}>
                <>
        <Head>
            <title>Geomap - Properties Management System</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            <meta name="description"
                  content="Geomap - Properties Management System"/>
        </Head>

        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme,
                    fontFamily: 'Manrope, sans-serif',
                    headings: {
                        fontFamily: 'Manrope, sans-serif'
                    }
                }}
            >
                <ModalsProvider>
                    <RouterTransition/>
                    <Notifications/>
                    <Component {...pageProps} />
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    </>
    </Provider>
    );
}

App.getInitialProps = ({ctx}: { ctx: GetServerSidePropsContext }) => ({
    // get color scheme from cookie
    colorScheme: getCookie('mantine-color-scheme', ctx) || 'light',
});
