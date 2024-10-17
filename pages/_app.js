import { SessionProvider, useSession } from "next-auth/react";
import { Provider } from "react-redux";
import store from "@/store/store";
import { MantineProvider, ColorSchemeProvider, createEmotionCache } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { ColorScheme } from "@mantine/core";
import { getCookie } from 'cookies-next';
import { GetServerSidePropsContext } from "next";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { RouterTransition } from '@/components';
import "../styles/globals.css";
import { Notifications } from "@mantine/notifications";

function App({ Component, pageProps: { session, ...pageProps } }) {

  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(preferredColorScheme);

  // You can add a function to toggle the color scheme as needed
  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };


  return (
    <SessionProvider session={pageProps.session}>
      <Provider store={store}>
        <Head>
          <title>TechStack Properties Ltd - Properties Management System</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/TechForge 1.PNG"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/TechForge 1.PNG"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/TechForge 1.PNG"/>
            <link rel="manifest" href="/site.webmanifest"/>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            <meta name="description" content="TechStack Properties Ltd - Properties Management System"/>
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
              <RouterTransition />
              <Notifications />
              <Component {...pageProps} />
            </ModalsProvider>
          </MantineProvider>
        </ColorSchemeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default App;
