import React from 'react';
import Head from "next/head";
import {
    ActionIcon,
    Anchor, AnchorProps,
    Badge,
    Breadcrumbs,
    Container,
    Divider,
    Flex,
    Grid,
    Group,
    Paper, PaperProps,
    Progress, rem,
    SimpleGrid,
    Avatar, Button,
    Stack,
    Text, ThemeIcon,
    TextInput,
    Input,
    Table,
    Title, UnstyledButton, useMantineTheme
} from "@mantine/core";

import {PATH_DASHBOARD} from "@/routes";
import {PageHeader, ProfileStatsCard, ProjectsTable, RevenueChart, UserProfileCard} from "@/components";
import UserData from "@/mocks/UserProfile.json";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconHome,
    IconMapPinFilled,
    IconListCheck,
    IconArrowBack,
    IconBusinessplan, IconCoins, IconDotsVertical
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {AppLayout} from "@/layout";
import Link from 'next/link';

const ICON_SIZE = 18;

const skills = ['React', 'Mantine', 'Figma', 'Bootstrap', 'Typescript', 'Sass/SCSS']

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

function DetailsPage() {
    const theme = useMantineTheme();
    const linkProps = {
        target: "_blank",
        sx: {
            borderRadius: theme.radius.md,
            padding: `${rem(4)} ${rem(8)}`,

            '&:hover': {
                transition: 'all ease 150ms',
                backgroundColor: theme.colors.gray[3],
                color: theme.black,
                textDecoration: 'none'
            }
        }
    };

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Tenant Details</Title>
                                </Stack>
                                <Link href="/askaris/tenants">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper {...PAPER_PROPS}>
                                        <Avatar src="/1.png" size={100} radius={120} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            Steve Owuor
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            steveowuor2006@gmail.com
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            0799117020
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Tenant
                                        </Button>
                                    </Paper>

                                    <Paper {...PAPER_PROPS}>
                                        <Stack>
                                            <Text size="lg" fw={600}>Location</Text>
                                            <Group>
                                                <IconHome size={ICON_SIZE}/>
                                                <Text>Kilimani, Nairobi Kenya</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col lg={9}>
                                <Stack>
                                    <SimpleGrid
                                        cols={4}
                                        spacing="lg"
                                        breakpoints={[
                                            {maxWidth: 'md', cols: 4, spacing: 'md'},
                                            {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                                        ]}
                                    >
                                        <ProfileStatsCard
                                            amount="10"
                                            title="total invoices"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="indigo.7"
                                            {...PAPER_PROPS}
                                        />
                                        <ProfileStatsCard
                                            amount="5"
                                            title="due invoices"
                                            icon={IconListCheck}
                                            progressValue={72}
                                            color="teal.7"
                                            {...PAPER_PROPS}
                                        />
                                        <ProfileStatsCard
                                            amount="Ksh. 97,219"
                                            title="total paid"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            {...PAPER_PROPS}
                                        />
                                        <ProfileStatsCard
                                            amount="Ksh. 25,000"
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            {...PAPER_PROPS}
                                        />
                                    </SimpleGrid>
                                    <Paper {...PAPER_PROPS}>
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Recent Invoices</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice No.</th>
                                <th>Building Name</th>
                                <th>Unit Code</th>
                                <th>Unit Name</th>
                                <th>Invoice Amount</th>
                                <th>Created On</th>
                                
                                </tr>
                            </thead>
                            <tbody>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 1</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                         
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 2</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 3</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 4</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 5</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 6</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 7</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 7</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>Ridge Apartments</td>
                            <td>B001829</td>
                            <td>Unit 8</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            </tbody>
                            </Table>
                        </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default DetailsPage;
