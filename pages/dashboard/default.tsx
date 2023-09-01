import React from 'react';
import Head from "next/head";
import {
    ActionIcon,
    Button,
    Container,
    Divider,
    Grid,
    Group,
    Paper,
    PaperProps,
    Stack,
    Text,
    Title
} from "@mantine/core";
import {IconChevronRight, IconRefresh} from "@tabler/icons-react";
import {
    FilterDateMenu,
    MobileDesktopChart,
    PageHeader,
    ProjectsTable,
    RevenueChart,
    SalesChart,
    StatsGrid,
    LanguageTable,
} from "@/components";
import StatsData from "../../mocks/StatsGrid.json"
import ProjectsData from "../../mocks/Projects.json"
import {AppLayout} from "@/layout";
import Link from "next/link";
import {PATH_TASKS} from "@/routes";
import LanguagesData from "../../mocks/Languages.json";

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

function Default() {
    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Welcome back Steve," withActions={true}/>
                        <StatsGrid data={StatsData.data} paperProps={PAPER_PROPS}/>
                        <Grid>
                            {/* <Grid.Col lg={8}>
                                <RevenueChart {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={4}>
                                <SalesChart {...PAPER_PROPS}/>
                            </Grid.Col> */}
                            <Grid.Col lg={4}>
                                    <LanguageTable data={LanguagesData.slice(0, 6)} {...PAPER_PROPS}/>
                            </Grid.Col>
                            <Grid.Col lg={8}>
                                <Paper {...PAPER_PROPS}>
                                    <Group position="apart" mb="md">
                                        <Text size="lg" fw={600}>Invoices</Text>
                                        <Button
                                            variant="subtle"
                                            component={Link}
                                            href=""
                                            rightIcon={<IconChevronRight size={18}/>}
                                        >
                                            View all
                                        </Button>
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

export default Default;
