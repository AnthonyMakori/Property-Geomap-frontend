import React from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {
    ActionIcon,
    Container,
    Divider,
    Grid,
    Group,
    Paper, PaperProps,
    rem,
    SimpleGrid,
    Stack,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import {
    FilterDateMenu,
    LanguageTable,
    MapChart,
    MobileDesktopChart, PageHeader,
    SalesChart,
    StatsCard,
    TrafficTable,
    ProjectsTable ,
} from "@/components";
import StatsData from "../../mocks/StatsGrid.json";
import LanguagesData from "../../mocks/Languages.json";
import ProjectsData from "../../mocks/Projects.json"

const PRIMARY_COL_HEIGHT = rem(300);

function Analytics() {

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Welcome back Steve," withActions={true}/>
                        <SimpleGrid cols={2} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                            <SimpleGrid cols={2}>
                                {StatsData?.data.map(s => <StatsCard key={s.title} data={s} p="md" shadow='md' radius="md"/>)}
                            </SimpleGrid>
                            <MobileDesktopChart p="md" shadow='md' radius="md"/>
                        </SimpleGrid>
                        <Grid>
                            
                            <Grid.Col lg={4}>
                                <LanguageTable data={LanguagesData.slice(0, 6)} p="md" shadow='md' radius="md"/>
                            </Grid.Col>
                            <Grid.Col lg={8}>
                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart" mb="md">
                                        <Text size="lg" fw={600}>Recent Invoices</Text>
                                        
                                    </Group>
                                    <ProjectsTable data={ProjectsData.slice(0, 6)}/>
                                </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Analytics;
