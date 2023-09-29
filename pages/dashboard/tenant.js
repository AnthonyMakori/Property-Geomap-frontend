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
    IconBusinessplan, IconCoins, IconDotsVertical, IconPrinter
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {ErrorLayout} from "@/layout";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getTenant } from "@/store/users/users-slice";
import store from '@/store/store'
import { formatNumber } from "@/lib/shared/data-formatters"
import PaginationLinks from '@/components/Pagination/pagination-links';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';

const ICON_SIZE = 18;

function TenantDashboard() {
    const router = useRouter();
    const tenantId = router.query?.tenantId ?? 1;

    const tenantStatus = useSelector((state) => state.users.getTenantStatus);
    const tenantData = useSelector((state) => state.users.getTenant);

    const tenant = tenantData?.tenant;
  
    const isLoading = tenantStatus === 'loading';
  
    useEffect(() => {
      const params = {};

        params['tenantId'] = tenantId;

      store.dispatch(getTenant(params));

    }, [tenantId]);
  
    function onPaginationLinkClicked(page) {
        if (!page) {
          return;
        }
    
        const params = {};
        params["page"] = page;
    
        store.dispatch(getTenant(params));
      }

      const StatusBadge = ({status}) => {
        let color = '';
    
        switch (status) {
            case 'Partially Paid':
                color = "blue"
                break;
            case 'Cancelled':
                color = "red"
                break;
            case 'Completed':
                color = "green"
                break;
            case 'Pending':
                color = "orange"
                break;
            default:
                color = "gray"
        }
    
        return (
            <Badge color={color} variant="filled" radius="sm">{status}</Badge>
        )
    }

    const invoices = tenantData?.invoices;

    const units = tenantData?.units;
    
    return (
        <>
            <ErrorLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Tenant Dashboard</Title>
                                </Stack>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Avatar src="/1.png" size={120} radius={120} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            { tenant?.name ?? '-'}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            { tenant?.phone ?? '-'}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            { tenant?.email ?? '-'}
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Profile
                                        </Button>
                                    </Paper>

                                    <Paper p="md" shadow='md' radius="md">
                                        <Text size="lg" fw={600} mb="md">Occupied Units</Text>
                                        <Table>
                            <thead>
                                <tr>
                                <th>Unit</th>                               
                                <th>Rent</th>
                                </tr>
                            </thead>
                            <tbody>
                            {units?.map((item) => (
                            <tr key={item?.id} > 
                            <td>{ item?.name ?? '-' }</td>  
                            <td>Ksh. { item?.amount ?? '-' }</td>                        

                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
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
                                            amount={tenantData?.invoices_count ?? 0}
                                            title="total invoices"
                                            icon={IconListCheck}
                                            progressValue={12}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(tenantData?.total_invoiced ?? 0) }
                                            title="Total Invoiced"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(tenantData?.total_collected ?? 0) }
                                            title="total collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(tenantData?.total_due ?? 0) }
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                    </SimpleGrid>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Unit</th>                               
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Owed</th>
                                <th>Status</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoices?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.code }</td>   
                            <td>{ item?.unit?.name ?? '-' }</td>                        
                            <td>Ksh. {item?.total ?? "0"}</td>
                            <td>Ksh. {item?.total_paid ?? "0"}</td>
                            <td>Ksh. {item?.total_owed ?? "0"}</td>
                            
                            <td>                               
                                {item?.total_paid > 0
                                ? <StatusBadge status={`Partially Paid`}/>
                                : item?.total_paid === 0
                                ? <StatusBadge status={`Pending`}/>
                                : item?.total_owed === 0
                                ? <StatusBadge status={`Complete`}/>
                                : null}
                            </td>
                            <td>
                                {/* <RecordPaymentModal item={item} /> */}
                                <StkPushModal item={item} />
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            <PaginationLinks
                                paginatedData={invoices}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </ErrorLayout>
        </>
    );
}

export default TenantDashboard;
