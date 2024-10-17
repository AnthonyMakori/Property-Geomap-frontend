import React, { useRef } from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {
    ActionIcon,
    Alert,
    Badge,
    Button,
    Container,
    Divider,
    Grid,
    Group,
    Paper, PaperProps,
    rem,
    SimpleGrid,
    Stack,
    Table,
    Text,
    Title,
    useMantineTheme
} from "@mantine/core";
import {IconEye, IconInfoCircle, IconRefresh} from "@tabler/icons-react";
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
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import store from '@/store/store';
import Chart from 'chart.js/auto';
import { formatDate } from '@/lib/shared/data-formatters'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import TopUpModal from '@/components/Payments/topup-modal';
import { getAirtimeBalance } from '@/store/communications/communication-slice';
import { formatNumber } from '@/lib/shared/data-formatters'
import { getLandDashboard } from '../../store/properties/buildings/buildings-slice';
import PaginationLinks from '@/components/Pagination/pagination-links';

function LandDashboard() {
    const { data: session, status } = useSession();
    //Chart Data
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // Store a reference to the chart instance

    const dashboardStatus = useSelector((state) => state.buildings.getLandDashboardStatus);
    const dashboard = useSelector((state) => state.buildings.getLandDashboard);


    const isLoading = dashboardStatus === 'loading';
  
    useEffect(() => {
      const params = {};

      params["accessToken"] = session?.user?.accessToken;

      store.dispatch(getLandDashboard(params));
    }, [session]);

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
  
    console.log('data monyancha', dashboard);


    const sales = dashboard?.sales;


    function onPaginationLinkClicked(page) {
        if (!page || !session) {
          return;
      }
    
        const params = {};
        params['page'] = page;
        params["accessToken"] = session.user.accessToken;

    
        store.dispatch(getLandDashboard(params));
      }

    //Chart Data
    // useEffect(() => {
    //   const data = {
    //     labels: graphData?.map((item) => item.month),
    //     datasets: [
    //         {
    //             label: 'Total Revenue',
    //             data: graphData?.map((item) => parseFloat(item.total_revenue)),
    //             // fill: false,
    //             backgroundColor: 'rgba(54, 162, 235, 0.6)',
    //           },
    //     //   {
    //     //     label: 'Income',
    //     //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     //     backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
    //     //   },
    //     //   {
    //     //     label: 'Eden palace',
    //     //     data: [800, 900, 1100, 1200, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2200],
    //     //     backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
    //     //   },
    //       // Add more buildings' data here
    //     ],
    //   };
  
    // //   const ctx = chartRef.current.getContext('2d');
  
    //   // Check if a chart instance already exists and destroy it
    //   if (chartInstance.current) {
    //     chartInstance.current.destroy();
    //   }
  
    //   // Create a new chart instance
    //   chartInstance.current = new Chart(ctx, {
    //     type: 'bar',
    //     data: data,
    //     options: {
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //         },
    //       },
    //     },
    //   });
    // }, [graphData]);

    //Get Airtime Balance

 

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <SimpleGrid cols={1} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                            <SimpleGrid cols={3}>

                            <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Land
                                        </Text>
                                        <Link href="/lands" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}> { dashboard?.total_lands ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Purchase Value
                                        </Text>
                                        <Link href="/lands" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { formatNumber(dashboard?.land_purchase_value) ?? 0 }</Text>
                                    </Group>

                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Plots
                                        </Text>
                                        <Link href="/lands/subdivisions" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}> { dashboard?.total_plots ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Land Size (ha)
                                        </Text>
                                        <Link href="/lands" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ dashboard?.total_land_size ?? 0 } ha.</Text>
                                    </Group>

                                </Paper>
                                

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Sold Plots
                                        </Text>
                                        <Link href="/lands/sales" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}> { dashboard?.sold_plots ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Sold Plots Income
                                        </Text>
                                        <Link href="/lands" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { formatNumber(dashboard?.sold_plots_income) ?? 0 } </Text>
                                    </Group>

                                </Paper>


                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Income Projection
                                        </Text>
                                        <Link href="/lands/sales" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. {formatNumber(dashboard?.plots_income_projection) ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                        Sold Plots Size 
                                        </Text>
                                        <Link href="/lands" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ formatNumber(dashboard?.total_plots_size_sold) ?? 0 } ha. </Text>
                                    </Group>

                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Available Plots Size
                                        </Text>
                                        <Link href="/lands/sales" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{formatNumber(dashboard?.total_plots_size_available) ?? 0 } ha. </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                        Total Invoices
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ formatNumber(dashboard?.total_invoices) ?? 0 } </Text>
                                    </Group>

                                </Paper>


                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                           Paid Invocies
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{formatNumber(dashboard?.paid_invoices) ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                        Pending Invoices
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ formatNumber(dashboard?.pending_invoices) ?? 0 } </Text>
                                    </Group>

                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                           Partially Paid Invocies
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{formatNumber(dashboard?.partially_paid_invoices) ?? 0 } </Text>
                                    </Group>

                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                        Paid Invoices Value
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { formatNumber(dashboard?.paid_invoices_value) ?? 0 } </Text>
                                    </Group>

                                </Paper>


                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                           Pending Invoices Value
                                        </Text>
                                        <Link href="/invoices" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={10} mb={3}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. {formatNumber(dashboard?.pending_invoices_value) ?? 0 } </Text>
                                    </Group>


                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                        Partially Paid Invoices Value
                                        </Text>
                                        <Link href="/askaris/revenue/rentals" className="custom-link">
                                            <Text size="xs" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                                VIEW ALL
                                            </Text>
                                        </Link>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { formatNumber(dashboard?.partially_paid_invoices_value) ?? 0 } </Text>
                                    </Group>

                                    {/* <Text fz="xs" c="dimmed" mt={7}>
                                        Comprises of all the buildings from all the owners/landlords
                                    </Text> */}
                                </Paper>


                            </SimpleGrid>

                        </SimpleGrid>
                        <Grid>
                            
                            
                            <Grid.Col lg={12}>
                                <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Recent Land Sales</Text>
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                {/* <th>No.</th> */}
                                <th>Land Reg. ID</th>
                                <th>Plot No.</th>
                                <th>Buyer</th>
                                <th>Phone</th>
                                <th>Seller</th>
                                <th>Com(%)</th>
                                <th>Size(Acres)</th>  
                                {/* <th>Dimensions</th>                               */}
                                <th>Selling P.(KES)</th>
                                {/* <th>Acquired Date</th> */}
                                <th>Location</th> 
                                <th>Status</th> 
                                {/* <th>City</th>  */}
                                <th>Created On</th> 
                                {/* <th className='text-right'>Actions</th>  */}
                                </tr>
                            </thead>
                            <tbody>
                            {sales?.data?.map((item) => (
                            <tr key={item?.id} >
                            {/* <td>{ item?.id }</td> */}
                            <td>{ item?.land?.reg_id ?? '' }</td>
                            <td>{item?.plot?.number ?? "-"}</td>
                            <td>{item?.contact?.name ?? "-"}</td>
                            <td>{item?.contact?.phone ?? "-"}</td>
                            <td>{item?.staff?.name ?? "-"}</td>
                            <td>{item?.commission ?? 0}%</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> 
                            <td>{item?.owner?.phone ?? "-"}</td>   */}
                            <td>{item?.plot?.size ?? "0"}</td>
                            {/* <td>{item?.dimensions ?? "0"}</td> */}
                            <td>Ksh. {formatNumber(item?.price) ?? "0"}</td>
                            {/* <td>{formatDate(item?.acquired_date) ?? "-"}</td> */}
                            <td>{item?.land?.location ?? "-"}</td>
                            {/* <td>{item?.city ?? "-"}</td> */}
                            <td>
                            <Badge color="red" variant="filled" radius="sm">Sold</Badge>
                            </td>
                            <td>{formatDate(item?.created_at) ?? "-"}</td>  
                            {/* <td>
                            <Link href={`/lands/installments?saleId=${item?.id}`}>
                              <Button disabled={item?.type === "Cash" || item?.type === null} leftIcon={<IconEye size={18} />} variant='outline' size='xs'>Installments</Button>
                            </Link>
                            </td>                                                                              */}
                            </tr>
                             ))}

                            {/* <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="7"
                                className="text-primary font-bold"
                              >
                                ACTUAL SALES VALUE
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {formatNumber(dashboard?.total) ?? 0}
                              </td>
                            </tr> */}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={sales}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default LandDashboard;
