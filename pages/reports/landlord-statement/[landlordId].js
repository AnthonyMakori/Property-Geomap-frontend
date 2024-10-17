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
  Badge,
  Card,
} from "@mantine/core";
import { PATH_DASHBOARD } from "@/routes";
import { InvoicesTable, PageHeader } from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import { AppLayout } from "@/layout";
import {
  IconEdit,
  IconEye,
  IconPrinter,
  IconCurrencyDollar,
  IconShare,
  IconPlus,
  IconArrowBack,
} from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import PaginationLinks from "@/components/Pagination/pagination-links";
import store from "@/store/store";
import { useSelector } from "react-redux";
import { debounce } from "lodash"; // Import debounce from lodash
import { showNotification } from "@mantine/notifications";
import RecordPaymentModal from "@/components/Invoices/record-payment-modal";
import StkPushModal from "@/components/Invoices/stk-push-modal";
import { formatDate } from "@/lib/shared/data-formatters";
import RepairsModal from "@/components/repairs/repairs-modal";
import PurchasesModal from "@/components/purchases/purchases-modal";
import { getPurchases } from "@/store/accounts/accounts-slice";
import ApprovalModal from "@/components/purchases/approval-modal";
import { useSession } from "next-auth/react";
import AddStaffModal from "@/components/Partners/add-staff-modal";
import { getStaff } from "@/store/users/users-slice";
import { TrafficLayer } from "@react-google-maps/api";
import { formatNumber } from "@/lib/shared/data-formatters";
import { IconFileExport } from "@tabler/icons-react";
import { getLandlordStatement } from "@/store/reports/reports-slice";
import { useRouter } from "next/router";
import {
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";
import {
  getLands,
  getPlotSales,
} from "../../../store/properties/buildings/buildings-slice";

export default function CompanyStatementOfAccounts() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());

  const router = useRouter();

  const landlordId = router.query?.landlordId ?? null;

  const statementStatus = useSelector(
    (state) => state.reports.getLandlordStatementStatus
  );
  const statement = useSelector((state) => state.reports.getLandlordStatement);

  const isLoading = statementStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};

    params["landlordId"] = landlordId;

    params["accessToken"] = session.user.accessToken;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    if (!startDate && !endDate) {
      store.dispatch(getLandlordStatement(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }

    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getLandlordStatement(params));
  }, [debouncedSearchTerm, session, startDate, endDate, status, landlordId]);

  console.log("Monyancha Onya Landlord Statement", statement);

  function onPaginationLinkClicked(page) {
    if (!session || !page) {
      return;
    }
    const params = {};

    params["accessToken"] = session.user.accessToken;
    params["page"] = page;
    params["landlordId"] = landlordId;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getLandlordStatement(params));
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

  //downloadBasic
  const downloadBasic = async () => {
    // Set loading state to true for the clicked item
    setPdfLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/reports/new-landlord-statement/${landlordId}`;

    // Add query parameters conditionally
    if (startDate && endDate) {
      endpoint += `?start_date=${startDate}&end_date=${endDate}`;
    }

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

    const filenameHeader = response.headers.get("Content-Disposition");
    const filename = filenameHeader
      ? filenameHeader.split("filename=")[1]
      : "Statement.pdf";

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
      setPdfLoading(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setPdfLoading(false);
    }
    setPdfLoading(false);
  };


  const download = async () => {
    // Set loading state to true for the clicked item
    setPdfLoading(true);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/reports/download-landlord-statement/${landlordId}`;

    // Add query parameters conditionally
    if (startDate && endDate) {
      endpoint += `?start_date=${startDate}&end_date=${endDate}`;
    }

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

    const filenameHeader = response.headers.get("Content-Disposition");
    const filename = filenameHeader
      ? filenameHeader.split("filename=")[1]
      : "Statement.pdf";

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
      setPdfLoading(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setPdfLoading(false);
    }
    setPdfLoading(false);
  };

  //agingReport

  const agingReport = statement?.aging?.original;

  const itemsStatus = useSelector(
    (state) => state.buildings.getPlotSalesStatus
  );
  const items = useSelector((state) => state.buildings.getPlotSales);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getPlotSales(params));
  }, [session, status]);

  console.log("data monyancha", items);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["page"] = page;
    params["accessToken"] = session.user.accessToken;

    store.dispatch(getPlotSales(params));
  }

  const landsStatus = useSelector((state) => state.buildings.getLandsStatus);
  const lands = useSelector((state) => state.buildings.getLands);

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLands(params));
  }, [searchTerm, session, status]);

  console.log("data monyancha", items);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["page"] = page;
    params["accessToken"] = session.user.accessToken;

    if (searchTerm) {
      params["filter"] = searchTerm;
    }

    store.dispatch(getLands(params));
  }

  const actions = (
    <Button
      size="xs"
      variant="outline"
      //   onClick={downloadPdf}
      //   loading={isDownloadingPdf}
    >
      Pdf
    </Button>
  );

  return (
    <AppLayout>
      <Container fluid>
        <Stack spacing="lg">
          <Card>
            <Flex
              align="center"
              justify="space-between"
              direction={{ base: "row", sm: "row" }}
              gap={{ base: "sm", sm: 4 }}
              m-5
            >
              <Stack>
                <Title order={4}>Statement of Account</Title>
              </Stack>
              <Group justify="flex-end">
                <TextInput
                  label="From"
                  placeholder="From"
                  type="date"
                  size="xs"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <TextInput
                  label="To"
                  placeholder="To"
                  type="date"
                  size="xs"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button
                  mt="xl"
                  size="xs"
                  variant="outline"
                  onClick={downloadBasic}
                  loading={pdfLoading}
                  leftIcon={<IconFileExport size={14} />}
                >
                  Basic Statement
                </Button>
                <Button
                  mt="xl"
                  size="xs"
                  variant="outline"
                  onClick={download}
                  loading={pdfLoading}
                  leftIcon={<IconFileExport size={14} />}
                >
                  Export PDF
                </Button>
                <Link href="/askaris/owners/">
                  <Button
                    mt="xl"
                    leftIcon={<IconArrowBack size={18} />}
                    size="xs"
                    variant="outline"
                  >
                    Back
                  </Button>
                </Link>
              </Group>
            </Flex>
          </Card>
          <Card>
            <main className="flex flex-col gap-4">
              {/* <TableCardHeader actions={actions}>
          <TDateFilter
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
          />
        </TableCardHeader> */}

              <section className="flex w-full flex-row justify-end mb-5">
                <div className="w-full">
                  <Table>
                    {/* <Thead> */}
                    {/* <tr>
                  <th
                    scope="col"
                    className="th-primary text-lg text-left"
                    colSpan={2}
                  >
                    Statement of Accounts
                  </th>
                </tr> */}
                    {/* </Thead> */}
                    {/* {!isLoading && ( */}
                    <tbody>
                      <TRowSubHeader label="Account Summary (Ksh)" />
                      <TRowRecord
                        label="Invoiced Amount"
                        value={statement?.invoiced ?? 0}
                      />
                      <TRowRecord
                        label="Amount Paid"
                        value={statement?.paid ?? 0}
                        // value="7000"
                      />
                      <TRowFooter
                        label="Balance Due"
                        value={statement?.due ?? 0}
                        // value="3000"
                      />
                    </tbody>
                    {/* )} */}
                  </Table>
                </div>
              </section>

              <h4 className="mb-0 mt-0 text-primary">Invoices Statement</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Record ID
                    </th>
                    <th scope="col" className="th-primary">
                      Type
                    </th>
                    <th scope="col" className="th-primary">
                      Details
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Amount
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Payments
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    statement?.invoices?.map((item) => (
                      <>
                        {item?.payments?.map((record) => (
                          <tr key={`1_payment`}>
                            <td>{record?.id}</td>
                            <td>Payment</td>
                            <td>FOR: {item?.code ?? "-"}</td>
                            <td></td>
                            <td>Ksh. {record?.amount ?? 0}</td>
                            <td>{formatDate(record?.created_at)}</td>
                          </tr>
                        ))}

                        <tr key={`2_invoice`}>
                          <td>{item?.id}</td>
                          <td>Invoice</td>
                          <td>{item?.code}</td>
                          <td>Ksh. {item?.total ?? 0}</td>
                          <td></td>
                          <td>{formatDate(item?.created_at)}</td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Agent Commissions</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th>No.</th>
                    <th>Unit</th>
                    <th>Tenant</th>
                    <th>Invoice</th>
                    <th>Paid Amount</th>
                    <th>Percentage</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.commissions?.map((item) => (
                      <tr key={item?.id}>
                        <td>{item?.code}</td>
                        <td>{item?.unit?.code ?? "-"}</td>
                        <td>{item?.tenant?.name ?? "-"}</td>
                        <td>{item?.invoice?.code ?? "-"}</td>
                        <td>Ksh. {item?.paid ?? "0"}</td>
                        <td>{item?.percentage ?? "0"}%</td>
                        <td>Ksh. {item?.amount ?? "0"}</td>
                        <td>{formatDate(item?.created_at) ?? "0"}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Refunded Deposits</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Lease No.
                    </th>
                    <th scope="col" className="th-primary">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary">
                      Unit Name
                    </th>
                    <th scope="col" className="th-primary">
                      Unit Code
                    </th>
                    <th scope="col" className="th-primary">
                      Deposit Paid
                    </th>
                    <th scope="col" className="th-primary">
                      Refunded Amount
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Deductions
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.refunded?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code}</td>
                        <td>{item?.tenant?.name ?? "-"}</td>
                        <td>{item?.unit?.name ?? "-"}</td>
                        <td>{item?.unit?.code ?? "-"}</td>
                        <td>Ksh. {item?.deposit ?? 0}</td>
                        <td>Ksh. {item?.refunded ?? 0}</td>
                        <td>Ksh. {item?.deposit - item?.refunded ?? 0}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Due Invoices</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Invoice No.
                    </th>
                    <th scope="col" className="th-primary">
                      Total
                    </th>
                    <th scope="col" className="th-primary">
                      Paid
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Owed
                    </th>
                    {/* <th scope="col" className="th-primary text-right">
                Payments
              </th> */}
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.dueInvoices?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code}</td>
                        <td>Ksh. {item?.total ?? 0}</td>
                        <td>Ksh. {item?.total_paid ?? 0}</td>
                        <td>Ksh. {item?.total_owed ?? 0}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Buildings List</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Name
                    </th>
                    <th scope="col" className="th-primary">
                      Category
                    </th>
                    <th scope="col" className="th-primary">
                      Units
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Location
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.buildings?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.name ?? "-"}</td>
                        <td>{item?.category ?? "-"}</td>
                        <td>{item?.units ?? 0}</td>
                        <td>{item?.location ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Leases</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Lease No.
                    </th>
                    <th scope="col" className="th-primary">
                      Unit
                    </th>
                    <th scope="col" className="th-primary">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Rent
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Due
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.leases?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code ?? "-"}</td>
                        <td>{item?.unit?.name ?? "-"}</td>
                        <td>{item?.tenant?.name ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? 0}</td>
                        <td>{item?.due ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Vacant Units</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Name
                    </th>
                    <th scope="col" className="th-primary">
                      Unit
                    </th>
                    <th scope="col" className="th-primary">
                      Type
                    </th>
                    <th scope="col" className="th-primary">
                      Building
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Rent
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Location
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.vacant_units?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.name ?? "-"}</td>
                        <td>{item?.code ?? "-"}</td>
                        <td>{item?.type?.name ?? "-"}</td>
                        <td>{item?.building?.name ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? "-"}</td>
                        <td>{item?.building?.location ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Occupied Units</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Name
                    </th>
                    <th scope="col" className="th-primary">
                      Unit
                    </th>
                    <th scope="col" className="th-primary">
                      Type
                    </th>
                    <th scope="col" className="th-primary">
                      Building
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Rent
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Location
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.occupied_units?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.name ?? "-"}</td>
                        <td>{item?.code ?? "-"}</td>
                        <td>{item?.type?.name ?? "-"}</td>
                        <td>{item?.building?.name ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? 0}</td>
                        <td>{item?.building?.location ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Invoice Payments</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Invoice No.
                    </th>
                    <th scope="col" className="th-primary">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary">
                      Amount
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Method
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Reference Code
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.payments?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.invoice?.code ?? "-"}</td>
                        <td>{item?.tenant?.name ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? 0}</td>
                        <td>{item?.method ?? "-"}</td>
                        <td>{item?.reference_code ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Expenses</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Expense No.
                    </th>
                    <th scope="col" className="th-primary">
                      Type
                    </th>
                    <th scope="col" className="th-primary">
                      Description
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Notes
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Unit
                    </th>
                    <th scope="col" className="th-primary">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary">
                      Amount
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.expenses?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code}</td>
                        {item?.items ? (
                          <td
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              maxWidth: "50ch",
                            }}
                          >
                            {JSON.parse(item?.items).map((itemData) => {
                              const truncatedName = itemData?.name?.substr(
                                0,
                                15
                              );
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
                        {item?.items ? (
                          <td
                            style={{
                              whiteSpace: "pre-wrap",
                              wordWrap: "break-word",
                              maxWidth: "50ch",
                            }}
                          >
                            {JSON.parse(item?.items).map((itemData) => {
                              const truncatedName = itemData?.desc?.substr(
                                0,
                                15
                              );
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
                        <td>{item?.description ?? "-"}</td>
                        {/* <td>{item?.unit?.building?.name ?? "-"}</td>  */}
                        <td>{item?.unit?.name ?? "-"}</td>
                        <td>{item?.unit?.tenant?.name ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? "0"}</td>
                        <td>{formatDate(item?.expense_date)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Purchases</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      No.
                    </th>
                    <th scope="col" className="th-primary">
                      Item
                    </th>
                    <th scope="col" className="th-primary">
                      Description
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Vendor
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Quantity
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Amount
                    </th>
                    <th scope="col" className="th-primary">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.purchases?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code ?? "-"}</td>
                        <td>{item?.name ?? "-"}</td>
                        <td>{item?.description ?? "-"}</td>
                        <td>{item?.vendor ?? "-"}</td>
                        <td>{item?.quantity ?? "-"}</td>
                        <td>Ksh. {item?.amount ?? 0}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Repairs</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      No.
                    </th>
                    <th scope="col" className="th-primary">
                      Title
                    </th>
                    <th scope="col" className="th-primary">
                      Description
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Unit
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.repairs?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.code}</td>
                        <td>{item?.title ?? ""}</td>
                        <td>{item?.description ?? "-"}</td>
                        <td>{item?.unit?.name ?? "-"}</td>
                        <td>{item?.unit?.tenant?.name ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <h4 className="mb-0 mt-0 text-primary">Messages</h4>
              <Table>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="th-primary">
                      Invoice No.
                    </th>
                    <th scope="col" className="th-primary">
                      Tenant
                    </th>
                    <th scope="col" className="th-primary">
                      Type
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Message
                    </th>
                    <th scope="col" className="th-primary text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* {!isLoading &&
              records?.invoices?.data?.map((item) => ( */}
                  <>
                    {statement?.messages?.map((item) => (
                      <tr key={`1_payment`}>
                        <td>{item?.invoice?.code ?? "-"}</td>
                        <td>{item?.user?.name ?? "-"}</td>
                        <td>{item?.type ?? "-"}</td>
                        <td>{item?.message ?? "-"}</td>
                        <td>{formatDate(item?.created_at)}</td>
                      </tr>
                    ))}
                  </>
                  {/* ))} */}
                </tbody>
              </Table>

              <Group position="apart" mb="md">
                <h4 className="mb-0 mt-0 text-primary">Aging Report</h4>
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
                    {agingReport?.data?.map((item) => (
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
                paginatedData={agingReport}
                onLinkClicked={onPaginationLinkClicked}
              />

              <Group position="apart" mb="md">
                <h4 className="mb-0 mt-0 text-primary">Owner Lands</h4>
              </Group>

              <div id="responsive-table">
                <Table>
                  <thead>
                    <tr>
                      {/* <th>No.</th> */}
                      <th>Reg. ID</th>
                      <th>Land ID</th>
                      {/* <th>Owner</th>                                */}
                      {/* <th>Phone No.</th> */}
                      <th>Size(Acres)</th>
                      {/* <th>Dimensions</th>                               */}
                      <th>Buying P.(KES)</th>
                      {/* <th>Acquired Date</th> */}
                      <th>Location</th>
                      {/* <th>City</th>  */}
                      <th>Created On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lands?.lands?.data?.map((item) => (
                      <tr key={item?.id}>
                        {/* <td>{ item?.id }</td> */}
                        <td>{item?.reg_id ?? ""}</td>
                        <td>{item?.land_id ?? "-"}</td>
                        {/* <td>{item?.owner?.name ?? "-"}</td> 
                            <td>{item?.owner?.phone ?? "-"}</td>   */}
                        <td>{item?.size ?? "0"}</td>
                        {/* <td>{item?.dimensions ?? "0"}</td> */}
                        <td>Ksh. {formatNumber(item?.price) ?? "0"}</td>
                        {/* <td>{formatDate(item?.acquired_date) ?? "-"}</td> */}
                        <td>{item?.location ?? "-"}</td>
                        {/* <td>{item?.city ?? "-"}</td> */}
                        <td>{formatDate(item?.created_at) ?? "-"}</td>
                      </tr>
                    ))}

                    <tr className="text-lg">
                      <th
                        scope="row"
                        colSpan="5"
                        className="text-primary font-bold"
                      >
                        TOTAL LANDS VALUE
                      </th>
                      <td className="text-dark tracking-wider text-xxl font-bold">
                        Ksh. {formatNumber(lands?.total) ?? 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <PaginationLinks
                paginatedData={lands?.lands}
                onLinkClicked={onPaginationLinkClicked}
              />

              <Group position="apart" mb="md">
                <h4 className="mb-0 mt-0 text-primary">Land Sales</h4>
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
                    {items?.sales?.data?.map((item) => (
                      <tr key={item?.id}>
                        {/* <td>{ item?.id }</td> */}
                        <td>{item?.land?.reg_id ?? ""}</td>
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
                          <Badge color="red" variant="filled" radius="sm">
                            Sold
                          </Badge>
                        </td>
                        <td>{formatDate(item?.created_at) ?? "-"}</td>
                        {/* <td>
                            <Link href={`/lands/installments?saleId=${item?.id}`}>
                              <Button disabled={item?.type === "Cash" || item?.type === null} leftIcon={<IconEye size={18} />} variant='outline' size='xs'>Installments</Button>
                            </Link>
                            </td>                                                                              */}
                      </tr>
                    ))}

                    <tr className="text-lg">
                      <th
                        scope="row"
                        colSpan="7"
                        className="text-primary font-bold"
                      >
                        ACTUAL SALES VALUE
                      </th>
                      <td className="text-dark tracking-wider text-xxl font-bold">
                        Ksh. {formatNumber(items?.total) ?? 0}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <PaginationLinks
                paginatedData={items?.sales}
                onLinkClicked={onPaginationLinkClicked}
              />
            </main>

            {/* {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={records?.invoices}
        onLinkClicked={onPaginationLinkClicked}
      /> */}
          </Card>
        </Stack>
      </Container>
    </AppLayout>
  );
}

function TRowRecord({ label, value }) {
  return (
    <tr>
      <td>
        <span className="">{label}</span>
      </td>
      <td className="text-right">Ksh. {formatNumber(value ?? 0)}</td>
    </tr>
  );
}

function TRowSubHeader({ label }) {
  return (
    <tr>
      <td className="text-xl text-primary font-bold" colSpan={2}>
        {label}
      </td>
    </tr>
  );
}

function TRowFooter({ label, value }) {
  return (
    <tr>
      <td className="text-lg bg-primary text-info">{label}</td>
      <td className="text-right bg-primary text-info">
        Ksh. {formatNumber(value ?? 0)}
      </td>
    </tr>
  );
}
