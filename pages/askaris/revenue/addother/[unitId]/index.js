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
import {AppLayout} from "@/layout";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getOneUnit } from "@/store/properties/buildings/buildings-slice";
import store from '@/store/store'
import { formatNumber } from "@/lib/shared/data-formatters"
import PaginationLinks from '@/components/Pagination/pagination-links';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import {formatDate} from '@/lib/shared/data-formatters'
import { useSession } from "next-auth/react";
import AddBillModal from '../../../../../components/Invoices/add-bill-modal';
import SendInvoiceModal from '../../../../../components/Invoices/send-invoice-modal';

const ICON_SIZE = 18;

function DetailsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const unitId = router.query?.unitId ?? null;
    const buildingId = router.query?.buildingId ?? null;
    const [pdfLoading, setPdfLoading] = useState({});

    const unitStatus = useSelector((state) => state.buildings.getOneUnitStatus);
    const unitData = useSelector((state) => state.buildings.getOneUnit);

    const unit = unitData?.unit;
  
    const isLoading = unitStatus === 'loading';
  
    useEffect(() => {
        if (!session || status !== "authenticated") {
            return;
          }
      const params = {};
      params["accessToken"] = session.user.accessToken;

        params['unitId'] = unitId;

      store.dispatch(getOneUnit(params));

    }, [unitId, session, status]);
  
    console.log('Unit data Anthony', unit);

    const units = unitData?.units;

    function onPaginationLinkClicked(page) {
        if (!page || !session) {
          return;
        }
    
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["page"] = page;
    
        store.dispatch(getOneUnit(params));
      }

      console.log('Building data 123 Anthony', units);

      

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

    const printExpense = async (itemId) => {
        // Set loading state to true for the clicked item
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: true,
        }));
    
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/accounts/download-expense/${itemId}`;
    
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

    const invoices = unitData?.invoices;

    const expenses = unitData?.expenses;

    const repairs = unitData?.repairs;

    const bills = unitData?.bills;
    
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
                                <Link href={`/askaris/revenue/rentals/${buildingId}`}>
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Grid>
                            <Grid.Col lg={3}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Avatar src="https://edityellow377.weebly.com/uploads/1/2/5/4/125405473/958370132.png" size={120} radius={5} mx="auto" mb="md"/>
                                        <Text ta="center" fz="md" weight={500} mt="md">
                                            { unit?.name ?? '-'}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            Building: { unit?.building?.name ?? '-'}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            Rent: Ksh. { unit?.amount ?? '-'}
                                        </Text>
                                        <Text ta="center" c="dimmed" fz="xs">
                                            Tenant: { unit?.tenant?.name ?? '-'}
                                        </Text>

                                        <AddBillModal item={unit} />
                                        <SendInvoiceModal item={unit} due={unitData?.total_due} />

                                    </Paper>

                                    <Paper p="md" shadow='md' radius="md">
                                        <Text size="lg" fw={600} mb="md">Unit Type</Text>
                                        <Group spacing="xs">
                                             <Badge variant="filled" color="primary.8"> { unit?.type?.name ?? ''} </Badge>
                                        </Group>
                                    </Paper>
                                    <Paper p="md" shadow='md' radius="md">
                                        <Stack>
                                            <Text size="lg" fw={600}>Location</Text>
                                            <Group>
                                                <IconHome size={ICON_SIZE}/>
                                                <Text>{ unit?.building?.location ?? '-'}</Text>
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
                                            amount={unitData?.total_invoices ?? 0}
                                            title="total invoices"
                                            icon={IconListCheck}
                                            progressValue={12}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(unitData?.total_invoiced ?? 0) }
                                            title="Total Invoiced"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="yellow.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(unitData?.total_collected ?? 0) }
                                            title="total collected"
                                            icon={IconBusinessplan}
                                            progressValue={12}
                                            color="green.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(unitData?.total_due ?? 0) }
                                            title="total due (Including Utility Bills)"
                                            icon={IconCoins}
                                            progressValue={45}
                                            color="red.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                         <ProfileStatsCard
                                            amount={ `Ksh. ` + formatNumber(unitData?.total_expenses ?? 0) }
                                            title="Total Expenses"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="red.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                        <ProfileStatsCard
                                            amount={ unitData?.total_repairs ?? 0 }
                                            title="Total Repairs"
                                            icon={IconCoins}
                                            progressValue={72}
                                            color="blue.7"
                                            p="md" shadow='md' radius="md"
                                        />
                                    </SimpleGrid>

                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Unit Bills</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>                              
                                <th>Utility Type</th>
                                <th>Bill Amount</th>
                                <th>Utility Details</th>
                                <th>Status</th>
                                <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {bills?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.id }</td>      
                            <td>{ item?.type ?? '-' }</td>                       
                            <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>{item?.description ?? "-"}</td>
                            <td>                               
                                {item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : 
                                <StatusBadge status={`Complete`}/>
                                }
                            </td>
                            <td>{formatDate(item?.created_at)}</td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={bills}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>

                                </Stack>
                            </Grid.Col>


                            <Grid.Col lg={12}>
                                <Stack>
                            <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
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
                                <RecordPaymentModal item={item} />
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



                            <Grid.Col lg={6}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Expenses</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Expense</th>
                                {/* <th>Description</th>
                                <th>Notes</th>                                */}
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {expenses?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.name?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.name?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            {/* {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.desc?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.desc?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            <td>{item?.description ?? "-"}</td> */}
                            <td>Ksh. {item?.amount ?? "0"}</td>   
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>                       
                            <td>{formatDate(item?.expense_date)}</td>
                                                                                
                            <td>
                               
                                <Button color="blue" loading={pdfLoading[item.id]} onClick={() => printExpense(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                  
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={expenses}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col lg={6}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Repairs</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Repair</th>                             
                                <th>Description</th>
                                <th>Status</th>
                                <th>Date</th>
                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {repairs?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            <td>{ item?.title ?? '-' }</td>
                            <td>{ item?.description ?? '-' }</td> 
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>                      
                            <td>{formatDate(item?.created_at)}</td>
                                                                                
                            {/* <td>
                               
                                <Button color="blue" loading={pdfLoading[item.id]} onClick={() => printExpense(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                  
                            </td> */}
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={repairs}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                                </Stack>
                            </Grid.Col>


                            <Grid.Col lg={6}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Tenant History</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Tenant</th>
                                {/* <th>Description</th>
                                <th>Notes</th>                                */}
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {expenses?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.name?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.name?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            {/* {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.desc?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.desc?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            <td>{item?.description ?? "-"}</td> */}
                            <td>Ksh. {item?.amount ?? "0"}</td>   
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>                       
                            <td>{formatDate(item?.expense_date)}</td>
                                                                                
                            <td>
                               
                                <Button color="blue" loading={pdfLoading[item.id]} onClick={() => printExpense(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                  
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={expenses}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                                </Stack>
                            </Grid.Col>

                            <Grid.Col lg={6}>
                                <Stack>
                                    <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Lease History</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Lease No.</th>
                                <th>Tenant</th>
                                {/* <th>Description</th>
                                <th>Notes</th>                                */}
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {expenses?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.name?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.name?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            {/* {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.desc?.substr(0, 15);
                                const truncatedNameWithEllipsis =
                                    truncatedName &&
                                    truncatedName.length < itemData?.desc?.length
                                    ? truncatedName + "..."
                                    : truncatedName;
                                return truncatedNameWithEllipsis;
                                })}
                            </td>
                            ) : (
                            <td>-</td>
                            )}
                            <td>{item?.description ?? "-"}</td> */}
                            <td>Ksh. {item?.amount ?? "0"}</td>   
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>                       
                            <td>{formatDate(item?.expense_date)}</td>
                                                                                
                            <td>
                               
                                <Button color="blue" loading={pdfLoading[item.id]} onClick={() => printExpense(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                  
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={expenses}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                                </Stack>
                            </Grid.Col>

                            {/* /////////////////////// */}
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default DetailsPage;
