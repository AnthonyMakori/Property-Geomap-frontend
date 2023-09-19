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
                                    <Title order={3}>Unit Details</Title>
                                </Stack>
                                <Link href="/askaris/revenue/addother">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper {...PAPER_PROPS}>
                                        <Avatar src="https://edityellow377.weebly.com/uploads/1/2/5/4/125405473/958370132.png" size={120} radius={5} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            Unit Name 1
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            Building: Ridge Apartments
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            Rent Ksh. 25,000
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Unit
                                        </Button>
                                    </Paper>

                                    <Paper {...PAPER_PROPS}>
                                        <Text size="lg" fw={600} mb="md">Unit Type</Text>
                                        <Group spacing="xs">
                                             <Badge variant="filled" color="primary.8"> One Bedroom </Badge>
                                        </Group>
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
                                        cols={2}
                                        spacing="lg"
                                        breakpoints={[
                                            {maxWidth: 'md', cols: 2, spacing: 'md'},
                                            {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                                        ]}
                                    >
                                        <ProfileStatsCard
                                            amount="Ksh. 97,219"
                                            title="total collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            {...PAPER_PROPS}
                                        />
                                        <ProfileStatsCard
                                            amount="Ksh. 902,222"
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            {...PAPER_PROPS}
                                        />
                                    </SimpleGrid>
                                    <Paper {...PAPER_PROPS}>
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice ID</th>
                                <th>Unit Code</th>
                                <th>Unit Name</th>
                                <th>Tenant Name</th>
                                <th>Rent Amount</th>
                                <th>Created On</th>
                                
                                </tr>
                            </thead>
                            <tbody>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 1</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                         
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 2</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 3</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 4</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 5</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 6</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 7</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 7</td>
                            <td>Steve Owuor</td>
                            <td>Ksh. 25,000</td>
                            <td>01/09/2023</td>
                            </tr>
                            <tr >
                            <td>#INV001829</td>
                            <td>B001829</td>
                            <td>Unit 8</td>
                            <td>Steve Owuor</td>
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
