import React, { SyntheticEvent, useState } from "react";
import Head from "next/head";
import {
  ActionIcon,
  Table,
  Container,
  Group,
  Title,
  TextInput,
  Select,
  Button,
  Space,
  Flex,
  Paper,
  PaperProps,
  Stack,
  Text,
} from "@mantine/core";
import { PATH_DASHBOARD } from "@/routes";
import { InvoicesTable, PageHeader } from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import { AppLayout } from "@/layout";
import {
  IconEdit,
  IconEye,
  IconPlus,
  IconTableExport,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import PaginationLinks from "@/components/Pagination/pagination-links";
import store from "@/store/store";
import { useSelector } from "react-redux";
import { debounce } from "lodash"; // Import debounce from lodash
import { IconPrinter } from "@tabler/icons-react";
import { getInvoicesAgingReport } from "@/store/reports/reports-slice";
import { useSession } from "next-auth/react";
import {
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";
import { showNotification } from "@mantine/notifications";
import { formatNumber, formatDate } from "@/lib/shared/data-formatters";

function AgingReport() {
  const { data: session, status } = useSession();
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] = useState({});

  const itemsStatus = useSelector(
    (state) => state.reports.getInvoicesAgingReportStatus
  );
  const items = useSelector((state) => state.reports.getInvoicesAgingReport);

  const isLoading = itemsStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};

    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getInvoicesAgingReport(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getInvoicesAgingReport(params));
  }, [debouncedSearchTerm, session, status, startDate, endDate]);

  console.log("data monyancha income", items);

  function onPaginationLinkClicked(page) {
    if (!session || !page) {
      return;
    }
    const params = {};

    params["accessToken"] = session.user.accessToken;
    params["page"] = page;

    if (startDate) {
      params["startDate"] = startDate;
    }
    if (endDate) {
      params["endDate"] = endDate;
    }

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getInvoicesAgingReport(params));
  }

  console.log("Search Term Here", debouncedSearchTerm);

  // Debounce the search term input
  const debouncedSearch = debounce(
    (value) => setDebouncedSearchTerm(value),
    500
  );

  const handleSearchTermChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value); // Debounced search term
  };

  const exportExcel = async () => {
    setIsLoadingExcel(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/reports/export-income-excel?start_date=${startDate}&end_date=${endDate}`;

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

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = "Income Report.xlsx";
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
    }
    setIsLoadingExcel(false);
  };

  return (
    <>
      <AppLayout>
        <Container fluid>
          <Stack spacing="lg">
            <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
                <Text fz="lg" fw={600}>
                  Tenants Aging Report
                </Text>

                <Group justify="flex-end">
                  <TextInput
                    label="From"
                    placeholder="From"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />

                  <TextInput
                    label="To"
                    placeholder="To"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />

                  <Button
                    mt="xl"
                    onClick={exportExcel}
                    leftIcon={<IconTableExport size={14} />}
                    loading={isLoadingExcel}
                    variant="filled"
                  >
                    Excel
                  </Button>
                </Group>
              </Group>
              <div id="responsive-table">
                <Table>
                  <thead>
                    <tr>
                      <th>CLIENT</th>
                      <th>CURRENT</th>
                      <th>1-30</th>
                      <th>31-60</th>
                      <th>61-90</th>
                      <th>OVER 90</th>
                      <th className="text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.data?.map((item) => (
                      <tr key={item?.id}>
                        <td>{item?.name ?? "-"}</td>
                        <td>{formatNumber(item?.owed_now)}</td>
                        <td>{formatNumber(item?.owed_1_to_30)}</td>
                        <td>{formatNumber(item?.owed_31_to_60)}</td>
                        <td>{formatNumber(item?.owed_61_to_90)}</td>
                        <td>{formatNumber(item?.owed_over_90)}</td>
                        <td>{formatNumber(item?.owed_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <PaginationLinks
                paginatedData={items}
                onLinkClicked={onPaginationLinkClicked}
              />
            </Paper>
          </Stack>
        </Container>
      </AppLayout>
    </>
  );
}

export default AgingReport;
