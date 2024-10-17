import React, { useState, useEffect } from 'react';
import {
  ActionIcon,
  Affix,
  AppShell,
  Box,
  ColorScheme,
  ColorSchemeProvider,
  Container,
  Footer,
  Header,
  MantineProvider,
  rem,
} from '@mantine/core';
import Navigation from "@/layout/App/Navigation/Navigation";
import HeaderNav from "@/layout/App/HeaderNav/HeaderNav";
import { useDisclosure, useHotkeys, useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { ThemeDrawer } from "@/components";
import FooterNav from "@/layout/App/FooterNav/FooterNav";
import { IconPaint } from "@tabler/icons-react";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useMantineTheme } from '@mantine/core';
import { showNotification } from '@mantine/notifications';

function AppLayout({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const mobile_match = useMediaQuery('(max-width: 425px)');
  const isStaff = session?.user?.role === "staff";
  const isUser = session?.user?.role === "tenant";
  const isMerchant = session?.user?.role === "merchant";

  const [opened, setOpened] = useState(false);
  const [themeOpened, { open: themeOpen, close: themeClose }] = useDisclosure(false);
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [primaryColor, setPrimaryColor] = useLocalStorage({
    key: 'mantine-preferred-color-dash-sparx',
    defaultValue: 'blue',
    getInitialValueInEffect: true,
  });
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: 'mantine-color-scheme-dash-sparx',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  const handleThemeChange = (c) => {
    setPrimaryColor(c);
  }

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status !== "authenticated") {
      console.log("You're not signed in");

      showNotification({
        title: "Error",
        message: "You're not allowed to access this page. Permission denied!",
        color: "red",
      });
      
      router.push("/auth/signin");

    }

  }, [status, router]);

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider inherit theme={{ primaryColor, primaryShade: 7, colorScheme }}>
        <AppShell
          layout="alt"
          navbarOffsetBreakpoint="md"
          asideOffsetBreakpoint="md"
          styles={{
            main: {
              background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
              paddingTop: tablet_match ? Number(theme.spacing.xl) * 4 : Number(theme.spacing.xl) * 2
            },
          }}
          navbar={
            <Navigation
              hiddenBreakpoint="md"
              hidden={!opened}
              width={{ sm: 220, lg: 220 }}
              onClose={() => setOpened(false)}
              sx={{
                zIndex: 101
              }}
            />
          }
          header={
            <Header
              height={{ base: 60, md: 60 }}
              sx={{
                border: 'none',
                boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
                left: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                right: tablet_match ? 0 : 'var(--mantine-navbar-width, 0)',
                width: tablet_match ? '100%' : 'calc(100vw - var(--mantine-navbar-width))'
              }}
            >
              <Container fluid py="sm" px="lg">
                <HeaderNav opened={opened} handleOpen={() => setOpened((o) => !o)} />
              </Container>
            </Header>
          }
        >
          <Box mt={0} mr={-20} ml={-20}>
            {children}
          </Box>
          <Affix position={{ bottom: rem(15), right: rem(10) }} sx={{ zIndex: 100 }}>
            <ActionIcon
              size={26}
              onClick={themeOpen}
              variant="filled"
              color="primary"
              radius="50%"
              sx={{ boxShadow: theme.shadows.xl }}
            >
              <IconPaint size={14} />
            </ActionIcon>
          </Affix>
          <ThemeDrawer
            opened={themeOpened}
            onClose={themeClose}
            primaryColor={primaryColor}
            setPrimaryColor={handleThemeChange}
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default AppLayout;
