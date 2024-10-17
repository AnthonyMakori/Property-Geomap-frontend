import React, { useRef, useState } from "react";
import Head from "next/head";
import { AppLayout } from "@/layout";
import {
  ActionIcon,
  Alert,
  Badge,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Modal,
  Paper,
  PaperProps,
  rem,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconInfoCircle, IconRefresh } from "@tabler/icons-react";
import {
  FilterDateMenu,
  LanguageTable,
  MapChart,
  MobileDesktopChart,
  PageHeader,
  SalesChart,
  StatsCard,
  TrafficTable,
  ProjectsTable,
} from "@/components";
import StatsData from "../../mocks/StatsGrid.json";
import LanguagesData from "../../mocks/Languages.json";
import ProjectsData from "../../mocks/Projects.json";
import { getDashboard } from "@/store/dashboard/dashboard-slice";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import store from "@/store/store";
import Chart from "chart.js/auto";
import { formatDate } from "@/lib/shared/data-formatters";
import { useSession } from "next-auth/react";
import Link from "next/link";
import TopUpModal from "@/components/Payments/topup-modal";
import { getAirtimeBalance } from "@/store/communications/communication-slice";
import { formatNumber } from "@/lib/shared/data-formatters";
import { IconAlertCircle } from "@tabler/icons-react";
import { getDateFilterFrom, getDateFilterTo } from '../../lib/shared/data-formatters';

function Analytics() {
  const { data: session, status } = useSession();
  //Chart Data
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Store a reference to the chart instance

  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const dashboardStatus = useSelector(
    (state) => state.dashboard.getDashboardStatus
  );
  const dashboard = useSelector((state) => state.dashboard.getDashboard);

  const graphData = dashboard?.revenue_data?.original?.revenueData;

  const [opened, setOpened] = useState(false);

  console.log("Monyancha 123", graphData);

  const isLoading = dashboardStatus === "loading";

  useEffect(() => {
    const params = {};

    params["accessToken"] = session?.user?.accessToken;
    // add date filters
    if (!startDate && !endDate) {
      store.dispatch(getInvoices(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getDashboard(params));
  }, [session, startDate, endDate,]);

  const StatusBadge = ({ status }) => {
    let color = "";

    switch (status) {
      case "Partially Paid":
        color = "blue";
        break;
      case "Cancelled":
        color = "red";
        break;
      case "Completed":
        color = "green";
        break;
      case "Pending":
        color = "orange";
        break;
      default:
        color = "gray";
    }

    return (
      <Badge color={color} variant="filled" radius="sm">
        {status}
      </Badge>
    );
  };

  console.log("data monyancha", dashboard);

    //Chart Data
    useEffect(() => {
      const data = {
        labels: graphData?.map((item) => item.month),
        datasets: [
          {
            label: "Total Revenue",
            data: graphData?.map((item) => parseFloat(item.total_revenue)),
            // fill: false,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
          },
          //   {
          //     label: 'Income',
          //     data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          //     backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
          //   },
          //   {
          //     label: 'Eden palace',
          //     data: [800, 900, 1100, 1200, 1400, 1500, 1600, 1700, 1800, 1900, 2000, 2200],
          //     backgroundColor: 'rgba(54, 162, 235, 0.6)', // Customize the color
          //   },
          // Add more buildings' data here
        ],
      };
  
      const ctx = chartRef.current.getContext("2d");
  
      // Check if a chart instance already exists and destroy it
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
  
      // Create a new chart instance
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          elements: {
            line: {
              tension: 0.4, // Optional: adds smooth curves
              fill: true, // This makes it an area chart
            },
          },
        },
      });
      
    }, [graphData]);


  //Get Airtime Balance
  const airtime = useSelector((state) => state.communication.getAirtimeBalance);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session?.user?.accessToken;
    store.dispatch(getAirtimeBalance(params));
  }, [session, status]);

  console.log("Monyancha Airtime", airtime);

  //End Airtime Balance

  const airtimeB = airtime / 0.7;

  return (
    <>
      <AppLayout>
        <Container fluid>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2  space-y-2 md:space-y-0">
  <h2 className="text-lg md:text-xl font-semibold text-gray-700">
    Hello <span className="text-blue-600">{session?.user?.name}</span>, welcome back!
  </h2>
  <div className="flex items-center space-x-4">
    <div className="flex items-center gap-2">
      <TextInput
        label="From"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        type="date"
        className="text-sm"
      />
      <TextInput
        label="To"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        type="date"
        className="text-sm"
      />
    </div>
  </div>
</header>

    <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
    <section className="grid grid-cols-2 md:grid-cols-2 gap-2 mb-2">
          {/* Card 1 */}
          <div className="bg-blue-500 text-white pl-4 rounded-lg ">
            <h3 className="text-xl font-bold">KES. {(dashboard?.paid ?? 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
            <p className="">From { dashboard?.paid_count ?? 0} Paid Invoices</p>
            {/* <div className="mt-4 flex items-center">
              <div className="text-3xl">35%</div>
            </div> */}
          </div>
          {/* Card 2 */}
          <div className="bg-amber-500 shadow-md text-white pl-4 rounded-lg">
            <h3 className="text-xl font-bold">KES. {(dashboard?.pending ?? 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
            <p className="">From { dashboard?.pending_count ?? 0} Pending Invoices</p>
            {/* <div className="mt-4 flex items-center">
              <div className="text-3xl">45%</div>
            </div> */}
          </div>
          {/* Card 3 */}
          <div className="bg-lime-500 shadow-md text-white pl-4 rounded-lg">
            <h3 className="text-xl font-bold">KES. {(dashboard?.partially_paid ?? 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </h3>
            <p className="">From { dashboard?.partially_paid_count ?? 0} Partially Paid Invoices</p>
            {/* <div className="mt-4 flex items-center">
              <div className="text-3xl">25%</div>
            </div> */}
          </div>
          {/* Card 4 */}
          <div className="bg-yellow-400 shadow-md text-white pl-4 rounded-lg">
            <h3 className="text-xl font-bold">KES. 0</h3>
            <p className="">Total Agent Commissions</p>
            {/* <div className="mt-4 flex items-center">
              <div className="text-3xl">0%</div>
            </div> */}
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-1 gap-2 mb-2">
          <div className="bg-white p-2 rounded-lg">
            {/* <h3 className="text-lg font-semibold">Quick Stats</h3> */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50  rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-500">{ dashboard?.total_buildings ?? 0}</p>
                <p className="text-gray-500">Total Buildings</p>
              </div>
              <div className="bg-blue-50  rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-500">{ dashboard?.total_units ?? 0}</p>
                <p className="text-gray-500">Total Apartment Units</p>
              </div>
              <div className="bg-blue-50  rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-500">{ dashboard?.occupied_units ?? 0}</p>
                <p className="text-gray-500">Occupied Units</p>
              </div>
              <div className="bg-blue-50  rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-500">{ dashboard?.vacant_units ?? 0}</p>
                <p className="text-gray-500">Vacant Units</p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Quick Stats and Revenue */}
      <section className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-2">
        <div className="bg-white p-2 rounded-lg shadow-custom">
          <div className="flex justify-between items-center">
            <b>Revenue Graph</b>
            <a href="/reports/income" style={{ textDecoration: "none"}} className="text-blue-500">
              View All
            </a>
          </div>
          <div style={{ height: "200px", width: "100%" }}>
            <canvas ref={chartRef} style={{ height: "200px", width: "100%" }} />
          </div>  
        </div>
      </section>


      <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Invoices Section */}
        <div className="bg-white p-2 rounded-lg shadow-custom">
          
          {/* <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Invoices</h3>
            <a href="/invoices" style={{ textDecoration: "none"}} className="text-blue-500">
              View All
            </a>
          </div> */}

          <div className="flex justify-between items-center  mb-2">
            <b>Recent Invoices</b>
            <a href="/invoices" style={{ textDecoration: "none"}} className="text-blue-500">
              View All
            </a>
          </div>
          
          <div className="space-y-2">
            
          {dashboard?.invoices_list?.map((item) => (
            <div
              key={item?.id} // Added a key prop for each item, assuming `item.id` is unique
              className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>{item?.code} - {item?.tenant?.name}</span>
              </div>
              <span>KES. {item?.total ?? 0}</span>
            </div>
          ))}

          </div>
        </div>
        {/* Payments Section */}
        <div className="bg-white p-2 rounded-lg shadow-custom">
          <div className="flex justify-between items-center mb-2">
            <b>Recent Payments</b>
            <a href="/reports/income" style={{ textDecoration: "none"}} className="text-blue-500">
              View All
            </a>
          </div>
          <div className="space-y-2">
          {dashboard?.payments?.map((item) => (
            <div
              key={item?.id} // Added a key prop for each item, assuming `item.id` is unique
              className="flex justify-between items-center p-2 bg-blue-50 rounded-lg"
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>{item?.invoice?.code} - {item?.tenant?.name}</span>
              </div>
            <span>KES. {item?.amount ?? 0}</span>
            </div>
          ))}
          
           
          </div>
        </div>
      </section>
      



        </Container>
      </AppLayout>
    </>
  );
}

export default Analytics;
