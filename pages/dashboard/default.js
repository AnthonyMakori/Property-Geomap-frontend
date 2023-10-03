import React, { useRef } from 'react';
import Head from "next/head";
import {AppLayout} from "@/layout";
import {
    ActionIcon,
    Badge,
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
import {IconRefresh} from "@tabler/icons-react";
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
import { getDashboard } from "@/store/dashboard/dashboard-slice";
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import store from '@/store/store';
import Chart from 'chart.js/auto';

function Analytics() {
    //Chart Data
    const chartRef = useRef(null);
    const chartInstance = useRef(null); // Store a reference to the chart instance

    const dashboardStatus = useSelector((state) => state.dashboard.getDashboardStatus);
    const dashboard = useSelector((state) => state.dashboard.getDashboard);
  
    const isLoading = dashboardStatus === 'loading';
  
    useEffect(() => {
      const params = {};

      store.dispatch(getDashboard(params));
    }, []);

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

    //Chart Data

    useEffect(() => {
      const data = {
        labels: [
          'January', 'February', 'March', 'April',
          'May', 'June', 'July', 'August',
          'September', 'October', 'November', 'December'
        ],
        datasets: [
          {
            label: 'Ridge Apartments',
            data: [1000, 1200, 1500, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000],
            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Customize the color
          },
          {
            label: 'Eden palace',
            data: [800, 900, 1100, 1200, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2200],
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
          },
          // Add more buildings' data here
        ],
      };
  
      const ctx = chartRef.current.getContext('2d');
  
      // Check if a chart instance already exists and destroy it
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, []);

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <PageHeader title="Welcome back," withActions={true}/>
                        <SimpleGrid cols={2} spacing="md" breakpoints={[{maxWidth: 'sm', cols: 1}]}>
                            <SimpleGrid cols={2}>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Buildings
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}> { dashboard?.total_buildings ?? 0 } </Text>
                                    </Group>

                                    <Text fz="xs" c="dimmed" mt={7}>
                                        Comprises of all the buildings from all the owners/landloards
                                    </Text>
                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Units
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ dashboard?.total_units?? 0 }</Text>
                                    </Group>

                                    <Text fz="xs" c="dimmed" mt={7}>
                                        Comprises of all the units from all the buildings in the system.
                                    </Text>
                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Occupied Units
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ dashboard?.occupied_units ?? 0 }</Text>
                                    </Group>
                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Vacant Units
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>{ dashboard?.vacant_units ?? 0 }</Text>
                                    </Group>

                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Invoices Amount
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { (dashboard?.total_invoices ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</Text>
                                    </Group>

                                    <Text fz="xs" c="dimmed" mt={7}>
                                        Calculates the total amount for all the invoices generated
                                    </Text>

                                    <Text size="xs" color="dimmed" mt="md" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Invoices Paid
                                    </Text>
                                    <Badge color="blue" variant="filled" radius="xs">
                                        Ksh. { (dashboard?.total_paid ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
                                    </Badge>
                                </Paper>

                                <Paper p="md" shadow='md' radius="md">
                                    <Group position="apart">
                                        <Text size="xs" color="dimmed" style={{ fontWeight: 500, textTransform: 'uppercase'}}>
                                            Total Invoices Owed Amount
                                        </Text>
                                    </Group>

                                    <Group align="flex-end" spacing="xs" mt={25}>
                                        <Text style={{ fontWeight: 500, lineHeight: 1, fontSize: rem(24)}}>Ksh. { (dashboard?.total_due ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</Text>
                                    </Group>

                                    <Text fz="xs" c="dimmed" mt={7}>
                                    Calculates the total owed amount for all the invoices generated
                                    </Text>
                                </Paper>

                                

                            </SimpleGrid>
                            <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Revenue Graph</Text>
                            </Group>
                            <div style={{ width: '100%', margin: '0 auto' }}>
                                <canvas ref={chartRef} width={400} height={200} />
                            </div>
                            </Paper>
                        </SimpleGrid>
                        <Grid>
                            
                            <Grid.Col lg={4}>
                                <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Recent Buildings</Text>
                            </Group>

                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                {/* <th>Owner</th> */}
                                <th>Units</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dashboard?.buildings?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.name }</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> */}
                            <td>{item?.units ?? "-"}</td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                        </Paper>
                            </Grid.Col>
                            <Grid.Col lg={8}>
                                <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Recent Invoices</Text>
                            </Group>

                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                {/* <th>Tenant</th> */}
                                <th>Amount</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            {dashboard?.invoices?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            {/* <td>{ item?.tenant?.name ?? '-' }</td> */}
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
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                        </Paper>
                            </Grid.Col>
                        </Grid>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Analytics;
