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
    Title, UnstyledButton, useMantineTheme, Select
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
    IconMapSearch,
    IconListCheck,
    IconBrandGoogleMaps,
    IconArrowBack,
    IconBusinessplan, IconCoins, IconDotsVertical, IconPin, IconEye
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {AppLayout} from "@/layout";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getOneBuilding, getUnitTypes } from "@/store/properties/buildings/buildings-slice";
import store from '@/store/store'
import { formatNumber } from "@/lib/shared/data-formatters"
import PaginationLinks from '../../../../../components/Pagination/pagination-links';
import { IconPlus } from '@tabler/icons-react';
 
const ICON_SIZE = 18;


function DetailsPage() {
    const router = useRouter();
    const buildingId = router.query?.buildingId ?? null;

    const [unitType, setUnitType] = useState("");
    console.log("Selected Unit Type", unitType);

    const buildingStatus = useSelector((state) => state.buildings.getOneBuildingStatus);
    const buildingData = useSelector((state) => state.buildings.getOneBuilding);

    const building = buildingData?.building;
  
    const isLoading = buildingStatus === 'loading';
  
    useEffect(() => {
      const params = {};

        params['buildingId'] = buildingId;
        
        if(unitType){
        params['unitType'] = unitType;
        }

      store.dispatch(getOneBuilding(params));

    }, [buildingId, unitType]);
  
    console.log('Building data monyancha', building);

    const units = buildingData?.units;

    function onPaginationLinkClicked(page) {
        if (!page) {
          return;
        }
    
        const params = {};
        params["page"] = page;
    
        store.dispatch(getOneBuilding(params));
      }

      const types = useSelector((state) => state.buildings.getUnitTypes);

      useEffect(() => {
        const params = {};

        store.dispatch(getUnitTypes(params));
  
      }, [buildingId]);

      console.log('Unit Types xyz', types);

      const unitTypesList =
      types?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })) ?? [];

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
                                    <Title order={3}>Building Details</Title>
                                </Stack>
                                <Link href="/askaris/revenue/rentals">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Avatar src="https://edityellow377.weebly.com/uploads/1/2/5/4/125405473/958370132.png" size={120} radius={5} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            { building?.name }
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        { building?.location }
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        Owner: { building?.owner?.name ?? "Admin" }
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Property
                                        </Button>
                                    </Paper>

                                    <Paper p="md" shadow='md' radius="md">
                                        <Text size="lg" fw={600} mb="md">Building Type</Text>
                                        <Group spacing="xs">
                                             <Badge variant="filled" color="primary.8"> { building?.type ??  building?.category } </Badge>
                                        </Group>
                                    </Paper>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Zone</Text>
                                            <Group>
                                                <IconMapSearch size={ICON_SIZE}/>
                                                <Text>{ building?.zone?.name }</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Location</Text>
                                            <Group>
                                                <IconBrandGoogleMaps size={ICON_SIZE}/>
                                                <Text>{ building?.location }</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>                                   
                                    <Paper p="md" shadow='md' radius="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Street</Text>
                                            <Group>
                                                <IconPin size={ICON_SIZE}/>
                                                <Text>{ building?.street?.name }</Text>
                                            </Group>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                            <Grid.Col lg={9}>
                                <Stack>
                                    <SimpleGrid
                                        cols={3}
                                        spacing="lg"
                                        breakpoints={[
                                            {maxWidth: 'md', cols: 4, spacing: 'md'},
                                            {maxWidth: 'sm', cols: 1, spacing: 'sm'},
                                        ]}
                                    >
                                        <ProfileStatsCard
                                            amount={ buildingData?.total_units ?? 0 }
                                            title="total units"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="indigo.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ buildingData?.total_tenants ?? 0 }
                                            title="Total Tenants"
                                            icon={IconListCheck}
                                            progressValue={72}
                                            color="teal.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ buildingData?.total_invoices ?? 0 }
                                            title="Total Invoices Count"
                                            icon={IconBusinessplan}
                                            progressValue={72}
                                            color="blue.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(buildingData?.total_invoiced ?? 0) }
                                            title="Total Invoiced"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(buildingData?.total_collected ?? 0) }
                                            title="total collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(buildingData?.total_due ?? 0) }
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                    </SimpleGrid>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Units</Text>
                                <Group justify="flex-end">
                                <Input placeholder="Search" />
                                <Select
                                        placeholder="Filter Unit Type"
                                        searchable
                                        clearable
                                        value={unitType}
                                        onChange={setUnitType}
                                        data={ unitTypesList }
                                    />
                                <Link href={`/askaris/revenue/addother/create?buildingId=${buildingData?.building?.id}`}>
                                <Button leftIcon={<IconPlus size={18}/>}>Add Unit</Button>
                                </Link>
                                </Group>
                                
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                                              
                                <th>Name</th>
                                <th>Code</th> 
                                <th>Rent</th>
                                <th>Tenant</th>
                                <th>Type</th>
                                <th>Status</th>                               
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {units?.data?.map((item) => (
                            <tr key={item?.id}>                           
                            <td>{item?.name}</td>
                            <td>{item?.code ?? "-"}</td>
                            <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>{item?.type?.name ?? "-"}</td>
                            <td>
                            {item?.unit_status >= 1 
                            ? <Badge color="blue" variant="filled" radius="sm">Occupied</Badge> 
                            : <Badge color="orange" variant="filled" radius="sm">Vacant</Badge>
                            }
                            </td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                                <Link href={`/askaris/revenue/addother/${item?.id}?buildingId=${buildingId}`}>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View</Button>
                                </Link>
                                {/* <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                             */}
                            </td>
                            </tr>
                            ))}
                           
                            </tbody>
                            </Table>
                            <PaginationLinks
                                paginatedData={units}
                                onLinkClicked={onPaginationLinkClicked}
                            />
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
