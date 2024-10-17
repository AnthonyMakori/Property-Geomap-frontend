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
    Title, UnstyledButton, useMantineTheme, Menu
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
    IconBusinessplan, IconCoins, IconDotsVertical, IconTrash, IconPencil, IconChevronDown, IconEye, IconPrinter
} from "@tabler/icons-react";
import ProjectsData from "@/mocks/Projects.json";
import {AppLayout} from "@/layout";
import Link from 'next/link';
//
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { formatDate} from '@/lib/shared/data-formatters'
import { getSingleLandlord } from '@/store/users/users-slice';
import store from '@/store/store'
import { formatNumber } from "@/lib/shared/data-formatters"
import PaginationLinks from '@/components/Pagination/pagination-links';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { useState } from 'react';


const ICON_SIZE = 18;

function DetailsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pdfLoading, setPdfLoading] = useState({});

    const ownerId = router.query?.ownerId ?? null;

    console.log("Tenant ID", ownerId);

    const landlordStatus = useSelector((state) => state.users.getSingleLandlordStatus);
    const landlordData = useSelector((state) => state.users.getSingleLandlord);
  
    const isLoading = landlordStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["landlordId"] = ownerId;

      store.dispatch(getSingleLandlord(params));
    }, [session, status, ownerId]);
  
    function onPaginationLinkClicked(page) {
      if (!session || !page) {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
        params['page'] = page;
        params["landlordId"] = ownerId;
  
      store.dispatch(getSingleLandlord(params));
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

    const printInvoice = async (itemId) => {
        // Set loading state to true for the clicked item
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: true,
        }));
    
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/accounts/download-invoice/${itemId}`;
    
        const accessToken = session.user.accessToken;
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: "GET",
          // Tell the server we're sending JSON.
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        };
    
        //Fix Naming Start Here
        const response = await fetch(endpoint, options);
    
        if (!response.ok) {
          throw { message: "failure" };
        }
    
        const filenameHeader = response.headers.get('Content-Disposition');
        const filename = filenameHeader ? filenameHeader.split('filename=')[1] : 'Invoice.pdf';
    
        const result = await response.blob();
    
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(result);
        a.innerHTML = filename; // Set the actual filename here
        a.target = "_blank";
        a.click();
        //End Here
    
        console.log(response);
    
        if (response.status === 200) {
          showNotification({
            title: "Success",
            message: "Download Successful",
            color: "green",
          });
          setPdfLoading((prevPdfLoading) => ({
            ...prevPdfLoading,
            [itemId]: false,
          }));
        } else {
          showNotification({
            title: "Error",
            message: "Sorry! " + result.message,
            color: "red",
          });
          setPdfLoading((prevPdfLoading) => ({
            ...prevPdfLoading,
            [itemId]: false,
          }));
        }
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: false,
        }));
      };

    const landlord = landlordData?.landlord;

    const invoices = landlordData?.invoices;

    const buildings = landlordData?.buildings;

    const payments = landlordData?.payments;



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
                                    <Title order={3}>{ landlord?.name ?? 'N/A' } Landlord Details</Title>
                                </Stack>
                                <Link href="/askaris/owners">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper p="md" shadow="md">
                                        <Avatar src="/1.png" size={100} radius={120} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            { landlord?.name ?? 'N/A' }
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        { landlord?.email ?? 'N/A' }
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                        { landlord?.phone ?? 'N/A' }
                                        </Text>

                                        <Button variant="outline" fullWidth mt="md">
                                            Edit Landlord
                                        </Button>
                                    </Paper>

                                    <Paper p="md" shadow="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Extras</Text>
                                                <Text>Code: {landlord?.code ?? 'N/A'}</Text>
                                                <Text>KRA Pin: {landlord?.kra ?? 'N/A'}</Text>
                                                <Text>National ID: {landlord?.nid ?? 'N/A'}</Text>
                                                <Text>Gender: {landlord?.gender ?? 'N/A'}</Text>
                                                <Text>Role: Landlord</Text>
                                                <Text>Type: {landlord?.type ?? 'Business Account'}</Text>
                                                <Text>Created At: {formatDate(landlord?.created_at)}</Text>
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
                                            amount={ landlordData?.total_buildings ?? "0"}
                                            title="total buildings"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="indigo.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ landlordData?.total_units ?? "0"}
                                            title="Total Units"
                                            icon={IconListCheck}
                                            progressValue={72}
                                            color="teal.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ landlordData?.vacant_units ?? "0"}
                                            title="Vacant Units"
                                            icon={IconListCheck}
                                            progressValue={72}
                                            color="teal.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${landlordData?.total_invoiced ?? "0"}`}
                                            title="total invoiced"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${landlordData?.total_collected ?? "0"}`}
                                            title="total collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow="md"
                                        />
                                        <ProfileStatsCard
                                            amount={`Ksh. ${landlordData?.total_due ?? "0"}`}
                                            title="total due"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow="md"
                                        />
                                    </SimpleGrid>
                                    <Paper p="md" shadow="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>{`${landlord?.name}'s `} Buildings</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Category</th>
                                {/* <th>Owner</th> */}
                                <th>Units</th>
                                {/* <th>Zone</th> */}
                                <th>Location</th>
                                {/* <th>Street</th> */}
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {buildings?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.name }</td>
                            <td>{ item?.type ?? '-' }</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> */}
                            <td>{item?.units ?? "-"}</td>
                            {/* <td>{item?.zone?.name ?? "-"}</td> */}
                            <td>{item?.location ?? "-"}</td>
                            {/* <td>{item?.street?.name ?? "-"}</td> */}
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                                <Menu
                                    shadow="md"
                                    width={200}
                                    position="bottom-end"
                                    variant="outline"
                                >
                                    <Menu.Target>
                                    <Button
                                        rightIcon={<IconChevronDown size={14} />}
                                        size="xs"
                                    >
                                        Actions
                                    </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                    <Menu.Label>#{item?.id}</Menu.Label>
                                    <Link
                                        href={`/askaris/revenue/rentals/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link>
                                    <Link
                                        href={`/askaris/revenue/rentals/edit/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link>
                                    <Menu.Item
                                        icon={<IconTrash size={15} />}
                                        // onClick={() => {
                                        // setDeleteModalOpen(true);
                                        // setCurrentStaff(item);
                                        // }}
                                        color="red"
                                    >
                                        Delete
                                    </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={buildings}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>

                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Tenant</th>                                
                                {/* <th>Rent</th>
                                <th>Deposit</th>
                                <th>Service Fee</th>
                                <th>Processing Fee</th>
                                <th>Penalty</th> */}
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Owed</th>
                                <th>Status</th>
                                {/* <th>Date</th> */}
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoices?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.code }</td>
                            <td>{item?.tenant?.name ?? "-"}</td>                            
                            {/* <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>Ksh. {item?.deposit ?? "0"}</td>
                            <td>Ksh. {item?.service_fee ?? "0"}</td>
                            <td>Ksh. {item?.processing_fee ?? "0"}</td>
                            <td>Ksh. {item?.penalty ?? "0"}</td> */}
                            <td>Ksh. {item?.total ?? "0"}</td>
                            <td>Ksh. {item?.total_paid ?? "0"}</td>
                            <td>Ksh. {item?.total_owed ?? "0"}</td>
                            
                            <td>
                            {item?.total_paid === item?.total
                                ? <StatusBadge status={`Completed`} />
                                : item?.total_paid > 0
                                ? <StatusBadge status={`Partially Paid`} />
                                : <StatusBadge status={`Pending`} />}
                            </td>
                                                                                
                            {/* <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td> */}
                            <td>
                            {/* <RecordPaymentModal item={item} />
                                <StkPushModal item={item} /> */}
                                <Menu
                                    shadow="md"
                                    ml="xs"
                                    width={200}
                                    position="bottom-end"
                                    variant="outline"
                                >
                                    <Menu.Target>
                                    <Button
                                        rightIcon={<IconChevronDown size={14} />}
                                        size="xs"
                                    >
                                        Actions
                                    </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                    <Menu.Label>#{item?.id}</Menu.Label>
                                    {/* <Link href={`/askaris/revenue/rentals/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link> */}

                                    {/* <Link
                                        href={`/leases/edit/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link> */}
                                        <Menu.Item
                                        color="yellow"
                                        loading={pdfLoading[item.id]} 
                                        onClick={() => printInvoice(item?.id)}
                                        icon={<IconPrinter size={15} />}
                                        >
                                        Download
                                        </Menu.Item>
                                        
                                    {/* <Menu.Item
                                        icon={<IconTrash size={15} />}
                                        // onClick={() => {
                                        // setDeleteModalOpen(true);
                                        // setCurrentStaff(item);
                                        // }}
                                        color="red"
                                    >
                                        Delete
                                    </Menu.Item> */}
                                    </Menu.Dropdown>
                                </Menu>
                                
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

                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Payments</Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice No.</th>
                                <th>Tenant</th>
                                <th>Amount</th>                               
                                <th>Method</th>
                                <th>Reference Code</th>
                                <th>Date</th>
                                {/* <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {payments?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.invoice?.code ?? '-' }</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>Ksh. {item?.amount ?? "-"}</td>
                            <td>{item?.method ?? "-"}</td> 
                            <td>{item?.reference_code ?? "-"}</td>                     
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>
                            {/* <Button color="blue" loading={pdfLoading[item.id]} onClick={() => download(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button> */}
                            </td>   
                            </tr>
                             ))}
                            </tbody>                           
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={payments}
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
