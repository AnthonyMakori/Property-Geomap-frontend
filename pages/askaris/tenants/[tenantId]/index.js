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
    IconHome,
    IconMapPinFilled,
    IconListCheck,
    IconArrowBack,
    IconBusinessplan, IconCoins, IconDotsVertical
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {AppLayout} from "@/layout";
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatDate} from '@/lib/shared/data-formatters'
import { getSingleTenant } from '@/store/users/users-slice';
import store from '@/store/store'
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { formatNumber } from "@/lib/shared/data-formatters"
import PaginationLinks from '@/components/Pagination/pagination-links';

const ICON_SIZE = 18;

function TenantDetails() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const tenantId = router.query?.tenantId ?? null;

    console.log("Tenant ID", tenantId);

    const tenantStatus = useSelector((state) => state.users.getSingleTenantStatus);
    const tenantData = useSelector((state) => state.users.getSingleTenant);
  
    const isLoading = tenantStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["tenantId"] = tenantId;

      store.dispatch(getSingleTenant(params));
    }, [session, status, tenantId]);
  
    function onPaginationLinkClicked(page) {
      if (!session || !page) {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
        params['page'] = page;
        params["tenantId"] = tenantId;
  
      store.dispatch(getSingleTenant(params));
    }

    const tenant = tenantData?.tenant;

    const invoices = tenantData?.invoices;

    const StatusBadge = ({status}) => {
        let color = '';
    
        switch (status) {
            case 'Partially Paid':
                color = "blue"
                break;
            case 'Rejected':
                color = "red"
                break;
            case 'Approved':
                color = "green"
                break;
            case 'Pending':
                color = "orange"
                break;
                case 'Completed':
                color = "green"
                break;
            default:
                color = "gray"
        }
    
        return (
            <Badge color={color} variant="filled" radius="sm">{status}</Badge>
        )
    }

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
                                    <Title order={3}>{tenant?.name} Tenant Details </Title>
                                </Stack>
                                <Link href="/askaris/tenants">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper p="md" shadow="md">
                                        <Avatar src="/1.png" size={100} radius={120} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            {tenant?.name ?? "-"}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        {tenant?.email ?? "-"}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        {tenant?.phone ?? "-"}
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Tenant
                                        </Button>
                                    </Paper>

                                    <Paper p="md" shadow="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Extras</Text>
                                            
                                                <Text>Code: {tenant?.code ?? '-'}</Text>
                                                <Text>National ID: {tenant?.nid ?? '-'}</Text>
                                                <Text>Gender: {tenant?.gender ?? '-'}</Text>
                                                <Text>Role: Tenant</Text>
                                                <Text>Type: {tenant?.type ?? 'Individual Account'}</Text>
                                                <Text>Created At: {formatDate(tenant?.created_at)}</Text>
                                            
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
                                            amount={tenantData?.total_invoices ?? 0}
                                            title="total invoices"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="indigo.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${tenantData?.total_invoiced ?? 0}`}
                                            title="Total Invoiced"
                                            icon={IconListCheck}
                                            progressValue={72}
                                            color="teal.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${tenantData?.total_collected ?? 0}`}
                                            title="total paid"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${tenantData?.total_due ?? 0}`}
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow="md"
                                        />
                                    </SimpleGrid>
                                    <Paper p="md" shadow="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Recent Invoices</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>                              
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Owed</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoices?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>                          
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
                            <td>{formatDate(item?.created_at)}</td>
                            <td>
                                {/* <RecordPaymentModal item={item} /> */}
                                <StkPushModal item={item} />
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
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
            </AppLayout>
        </>
    );
}

export default TenantDetails;
