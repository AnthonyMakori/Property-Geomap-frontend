import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from "next/head";
import ProfileStatsCard from '../../components/ProfileStatsCard/ProfileStatsCard';
import {
    Avatar,
    Badge,
    Button,
    Container,
    Flex,
    Grid,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
    Loader,
    Input,
    Menu,
    Image
} from "@mantine/core";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getTenant } from "@/store/users/users-slice";
import store from '@/store/store';
import { formatNumber } from "@/lib/shared/data-formatters";
import PaginationLinks from '@/components/Pagination/pagination-links';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { IconCoins, IconListCheck, IconBusinessplan } from "@tabler/icons-react";
import { IconChevronDown, IconPower, IconUser } from "@tabler/icons-react";

const PATH_AUTH = {
    signin: '/../../auth/signin', 
    login: '/login' 
};

const ICON_SIZE = 18;

function StaffDashboard() {
    const router = useRouter();
    const tenantId = router.query?.tenantId ?? 1;

    const tenantStatus = useSelector((state) => state.users.getTenantStatus);
    const tenantData = useSelector((state) => state.users.getTenant);
    const tenant = tenantData?.tenant;

    const isLoading = tenantStatus === 'loading';
    const isError = tenantStatus === 'error';

    useEffect(() => {
        const params = { tenantId };
        store.dispatch(getTenant(params));
    }, [tenantId]);

    function onPaginationLinkClicked(page) {
        if (!page) return;
        const params = { page };
        store.dispatch(getTenant(params));
    }

    const StatusBadge = ({ status }) => {
        const statusColors = {
            'Partially Paid': 'blue',
            'Cancelled': 'red',
            'Completed': 'green',
            'Pending': 'orange',
        };
        return (
            <Badge color={statusColors[status] || 'gray'} variant="filled" radius="sm">
                {status}
            </Badge>
        );
    };

    const getStatus = (totalPaid, totalOwed) => {
        if (totalPaid > 0 && totalOwed > 0) return 'Partially Paid';
        if (totalPaid === 0) return 'Pending';
        if (totalOwed === 0) return 'Completed';
        return 'Unknown';
    };

    const invoices = tenantData?.invoices;
    const units = tenantData?.units;

    const handleProfileClick = () => {
        router.push('/dashboard/Profile'); 
    };

    const handleLogoutClick = () => {
        router.push(PATH_AUTH.signin);
    };

    return (
        <>
            <Container fluid>
                <Stack spacing="lg" sx={{ minHeight: '100%' }}>
                    <Paper p="xsm" shadow="md" radius="md" >
                    <Stack>
                        <Flex
                            align="center"
                            justify="space-between"
                            direction={{ base: 'row', sm: 'row' }}
                            gap={{ base: 'sm', sm: 4 }}
                            sx={{ backgroundColor: '', padding: '16px', borderRadius: '8px' }}
                        >
                            <Stack>
                                <Title order={3} color="blue">Staff Dashboard</Title>
                            </Stack>
                            
                            <Menu>
                                <Menu.Target>
                                    <Image
                                        src="/TechForge 1.PNG"
                                        alt="Options"
                                        height={44}
                                        width={44}
                                        radius={120}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item onClick={handleProfileClick}>
                                        <IconUser size={ICON_SIZE} style={{ marginRight: 8 }} />
                                        Profile
                                    </Menu.Item>
                                    <Menu.Item onClick={handleLogoutClick}>
                                        <IconPower size={ICON_SIZE} style={{ marginRight: 8 }} />
                                        Log Out
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Flex>
                    </Stack>
                    </Paper>

                    {isLoading ? (
                        <Loader size="lg" />
                    ) : isError ? (
                        <Text color="red">Failed to load tenant data. Please try again later.</Text>
                    ) : (
                        <Grid>
                            {/* Sidebar for Staff Details */}
                            <Grid.Col lg={3} sx={{ backgroundColor: 'white', minHeight: '100vh', position: 'sticky', top: 0 }}>
                                <Stack>
                                    <Paper p="md" shadow="md" radius="md">
                                        <Text size="lg" fw={600} mb="md">Staff Details</Text>
                                        <Stack>
                                            <Avatar src="/1.png" size={120} radius={120} mx="auto" mb="md" />
                                            <Text ta="center" fz="md" weight={500} mt="md">
                                                {tenant?.name ?? '-'}
                                            </Text>
                                            <Text ta="center" c="dimmed" fz="xs">
                                                {tenant?.phone ?? '-'}
                                            </Text>
                                            <Text ta="center" c="dimmed" fz="xs">
                                                {tenant?.email ?? '-'}
                                            </Text>

                                            <Paper p="md" shadow="md" radius="md">
                                                <Text size="lg" fw={600} mb="md">Occupied Units</Text>
                                                <Table>
                                                    <thead>
                                                        <tr>
                                                            <th>Staff Number</th>
                                                            <th>Staff Title</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {units?.map((item) => (
                                                            <tr key={item?.id}>
                                                                <td>{item?.unit_number ?? '-'}</td>
                                                                <td>Ksh. {item?.rent_amount ? formatNumber(item?.rent_amount) : '-'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </Paper>
                                        </Stack>
                                    </Paper>
                                </Stack>
                            </Grid.Col>

                            {/* Main Content Area */}
                            <Grid.Col lg={9}>
                                <Stack>
                                    <SimpleGrid
                                        cols={2}
                                        spacing="lg"
                                        breakpoints={[
                                            { maxWidth: 'md', cols: 2, spacing: 'md' },
                                            { maxWidth: 'sm', cols: 1, spacing: 'sm' },
                                        ]}
                                    >
                                        <ProfileStatsCard
                                            amount={tenantData?.invoices_count ?? 0}
                                            title="Total Invoices"
                                            icon={IconListCheck}
                                            progressValue={12}
                                            backgroundColor="orange.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${formatNumber(tenantData?.total_invoiced ?? 0)}`}
                                            title="Total Invoiced"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${formatNumber(tenantData?.total_collected ?? 0)}`}
                                            title="Total Collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${formatNumber(tenantData?.total_due ?? 0)}`}
                                            title="Total Due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                    </SimpleGrid>

                                    <Paper p="md" shadow="md" radius="md">
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
                                                    <tr key={item?.id}>
                                                        <td>#{item?.code}</td>
                                                        <td>{item?.unit?.name ?? '-'}</td>
                                                        <td>Ksh. {item?.total ?? "0"}</td>
                                                        <td>Ksh. {item?.total_paid ?? "0"}</td>
                                                        <td>Ksh. {item?.total_owed ?? "0"}</td>
                                                        <td>
                                                            <StatusBadge status={getStatus(item.total_paid, item.total_owed)} />
                                                        </td>
                                                        <td>
                                                            <StkPushModal item={item} />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>

                                        <PaginationLinks
                                            links={invoices?.links}
                                            onPageChange={onPaginationLinkClicked}
                                        />
                                    </Paper>
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    )}
                </Stack>
            </Container>
        </>
    );
}

export default StaffDashboard;
