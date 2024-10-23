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
  Accordion,
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
  IconPdf,
  IconFileExport,
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
import { getBalanceSheet } from "../../store/reports/reports-slice";
import { formatNumber } from "../../lib/shared/data-formatters";

function BalanceSheet() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] = useState({});
  //setApprovalStatus

  const itemstatus = useSelector(
    (state) => state.reports.getBalanceSheetStatus
  );
  const items = useSelector((state) => state.reports.getBalanceSheet);

  const isLoading = itemstatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getBalanceSheet(params));
  }, [debouncedSearchTerm, session, status]);

  console.log("data Anthony balance sheet", items);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
      return;
    }

    const params = {};
    params["page"] = page;
    params["accessToken"] = session.user.accessToken;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getBalanceSheet(params));
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

  return (
    <>
      <AppLayout>
        <Container fluid>
          <Stack spacing="lg">
            <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
                <Text fz="lg" fw={600}>
                  Balance Sheet Statement
                </Text>
                <Group justify="flex-end">
                  <TextInput
                    label="From"
                    placeholder="From"
                    type="date"
                    size="xs"
                    // value={startDate}
                    // onChange={(e) => onChangeStartDate(e.target.value)}
                  />
                  <TextInput
                    label="To"
                    placeholder="To"
                    type="date"
                    size="xs"
                    // value={endDate}
                    // onChange={(e) => onChangeEndDate(e.target.value)}
                  />
                  <Button
                    mt="xl"
                    size="xs"
                    variant="outline"
                    leftIcon={<IconFileExport size={14} />}
                  >
                    Export PDF
                  </Button>
                </Group>
              </Group>
              <div id="responsive-table">
                <Table>
                  <thead>
                    <tr>
                      <th>ASSETS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: "100%"}}>
                      <div className="w-full flex justify-between items-center">
                      <Accordion style={{ width: "100%"}}>
                            <Accordion.Item value="Inventories">
                              <Accordion.Control>
                                <div className="flex justify-between items-center">
                                  <span>Cash (Invoice Payments)</span>
                                  <span className="text-right">
                                    Ksh. {formatNumber(items?.current_assets) ?? 0}
                                  </span>
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                {/* Add a table here for inventories */}
                                <div style={{ width: "100%"}} className="w-full">
                                <Table>
                                    <thead>
                                      <tr>
                                        <th scope="col" className="th-primary">
                                          NO
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          TENANT
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          INVOICE
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          METHOD
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          COST(KES)
                                        </th>
              
                                        <th scope="col" className="th-primary text-right">
                                          DATE
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!isLoading &&
                                        items?.payments_list?.data &&
                                        items?.payments_list?.data.map((item) => (
                                          <tr key={item?.id}>
                                            <>
                                              <td>{item?.id}</td>
                                              <td>{item?.tenant?.name ?? '-'}</td>
                                              <td>{item?.invoice?.code ?? '-'}</td>
                                              <td>{item?.method ?? '-'}</td>
                                              <td>Ksh. {formatNumber(item?.amount)}</td>
                                       
                                              <td className="text-right">{item && new Date(item.created_at).toLocaleDateString()}</td>
                                             
                                            </>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                  <PaginationLinks
                                    paginatedData={items?.payments_list}
                                    onLinkClicked={onPaginationLinkClicked}
                                  />
                              </div>
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                          </div>
                          </td>
                    </tr>
                    <tr>
                      <td>
                      <div className="w-full flex justify-between items-center">
                      <Accordion style={{ width: "100%"}}>
                            <Accordion.Item value="Inventories">
                              <Accordion.Control>
                                <div className="flex justify-between items-center">
                                  <span>Long Term Investments & Funds</span>
                                  <span className="text-right">
                                    Ksh. {formatNumber(items?.investments) ?? 0}
                                  </span>
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                {/* Add a table here for inventories */}
                                <div style={{ width: "100%"}} className="w-full">
                                <Table>
                                    <thead>
                                      <tr>
                                        <th scope="col" className="th-primary">
                                          NO
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          TITLE
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          DESCRIPTION
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          COST(KES)
                                        </th>
              
                                        <th scope="col" className="th-primary text-right">
                                          DATE
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!isLoading &&
                                        items?.income_list?.data &&
                                        items?.income_list?.data.map((item) => (
                                          <tr key={item?.id}>
                                            <>
                                              <td>{item?.id}</td>
                                              <td>{item?.name ?? '-'}</td>
                                              <td>{item?.description ?? '-'}</td>
                                              <td>Ksh. {formatNumber(item?.amount)}</td>
                                       
                                              <td className="text-right">{item && new Date(item.created_at).toLocaleDateString()}</td>
                                             
                                            </>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                  <PaginationLinks
                                    paginatedData={items?.income_list}
                                    onLinkClicked={onPaginationLinkClicked}
                                  />
                              </div>
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                          </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                      <div className="w-full flex justify-between items-center">
                      <Accordion style={{ width: "100%"}}>
                            <Accordion.Item value="Inventories">
                              <Accordion.Control>
                                <div className="flex justify-between items-center">
                                  <span>Property, Plant & Equipment</span>
                                  <span className="text-right">
                                    Ksh. {formatNumber(items?.total_properties) ?? 0}
                                  </span>
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                {/* Add a table here for inventories */}
                                <div style={{ width: "100%"}} className="w-full">
                                <Table>
                                    <thead>
                                      <tr>
                                        <th scope="col" className="th-primary">
                                          NO
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          NAME
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          LOCATION
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          VALUE (KES)
                                        </th>
              
                                        <th scope="col" className="th-primary text-right">
                                          DATE
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!isLoading &&
                                        items?.properties_list?.data &&
                                        items?.properties_list?.data.map((item) => (
                                          <tr key={item?.id}>
                                            <>
                                              <td>{item?.id}</td>
                                              <td>{item?.name ?? '-'}</td>
                                              <td>{item?.location ?? '-'}</td>
                                              <td>Ksh. {formatNumber(item?.worth)}</td>
                                       
                                              <td className="text-right">{item && new Date(item.created_at).toLocaleDateString()}</td>
                                             
                                            </>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                  <PaginationLinks
                                    paginatedData={items?.properties_list}
                                    onLinkClicked={onPaginationLinkClicked}
                                  />
                              </div>
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                          </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "100%"}}>
                      <div className="w-full flex justify-between items-center">
                      <Accordion style={{ width: "100%"}}>
                            <Accordion.Item value="Inventories">
                              <Accordion.Control>
                                <div className="flex justify-between items-center">
                                  <span>Intangible Assets (Invoices owed etc.)</span>
                                  <span className="text-right">
                                    Ksh. {formatNumber(items?.invoices_owed) ?? 0}
                                  </span>
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                {/* Add a table here for inventories */}
                                <div style={{ width: "100%"}} className="w-full">
                                <Table>
                                    <thead>
                                      <tr>
                                        <th scope="col" className="th-primary">
                                          NO
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          TENANT
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          INVOICE
                                        </th>
                                        {/* <th scope="col" className="th-primary ">
                                          METHOD
                                        </th> */}
                                        <th scope="col" className="th-primary ">
                                          AMOUNT (KES)
                                        </th>
              
                                        <th scope="col" className="th-primary text-right">
                                          DATE
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!isLoading &&
                                        items?.owed_list?.data &&
                                        items?.owed_list?.data.map((item) => (
                                          <tr key={item?.id}>
                                            <>
                                              <td>{item?.id}</td>
                                              <td>{item?.tenant?.name ?? '-'}</td>
                                              <td>{item?.code ?? '-'}</td>
                                              {/* <td>{item?.method ?? '-'}</td> */}
                                              <td>Ksh. {formatNumber(item?.total_owed) ?? 0}</td>
                                       
                                              <td className="text-right">{item && new Date(item.created_at).toLocaleDateString()}</td>
                                             
                                            </>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                  <PaginationLinks
                                    paginatedData={items?.owed_list}
                                    onLinkClicked={onPaginationLinkClicked}
                                  />
                              </div>
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                          </div>
                          </td>

                    </tr>
                    <tr>
                      

                      <td style={{ width: "100%"}}>
                      <div className="w-full flex justify-between items-center">
                      <Accordion style={{ width: "100%"}}>
                            <Accordion.Item value="Inventories">
                              <Accordion.Control>
                                <div className="flex justify-between items-center">
                                  <span>Other Assets</span>
                                  <span className="text-right">
                                    Ksh. {formatNumber(items?.other_assets) ?? 0}
                                  </span>
                                </div>
                              </Accordion.Control>
                              <Accordion.Panel>
                                {/* Add a table here for inventories */}
                                <div style={{ width: "100%"}} className="w-full">
                                <Table>
                                    <thead>
                                      <tr>
                                        <th scope="col" className="th-primary">
                                          NO
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          TITLE
                                        </th>
                                        <th scope="col" className="th-primary ">
                                          DESCRIPTION
                                        </th>
                                        {/* <th scope="col" className="th-primary ">
                                          METHOD
                                        </th> */}
                                        <th scope="col" className="th-primary ">
                                          AMOUNT (KES)
                                        </th>
              
                                        <th scope="col" className="th-primary text-right">
                                          DATE
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {!isLoading &&
                                        items?.assets_list?.data &&
                                        items?.assets_list?.data.map((item) => (
                                          <tr key={item?.id}>
                                            <>
                                              <td>{item?.id}</td>
                                              <td>{item?.name ?? '-'}</td>
                                              <td>{item?.description ?? '-'}</td>
                                              {/* <td>{item?.method ?? '-'}</td> */}
                                              <td>Ksh. {formatNumber(item?.amount) ?? 0}</td>
                                       
                                              <td className="text-right">{item && new Date(item.created_at).toLocaleDateString()}</td>
                                             
                                            </>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </Table>

                                  <PaginationLinks
                                    paginatedData={items?.assets_list}
                                    onLinkClicked={onPaginationLinkClicked}
                                  />
                              </div>
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                          </div>
                          </td>

                    </tr>
                    <tr className="text-lg bg-primary text-info">
                      <td>Total Assets</td>
                      <td>Ksh. {items?.total_assets ?? 0}</td>
                    </tr>

                    <tr>
                      <th>LIABILITIES</th>
                      <th></th>
                    </tr>
                    <tr>
                      <td>Equity</td>
                      <td>Ksh. {items?.equity ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Current Liabilities (Taxes,Redemptions etc.)</td>
                      <td>Ksh. {items?.current_liabilities ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Expenses (Staff Commissions, Payments etc.)</td>
                      <td>Ksh. {items?.expenses ?? 0}</td>
                    </tr>
                    <tr>
                      <td>Long Term Liabilities (Eg. Long term Loans, )</td>
                      <td>Ksh. {items?.long_term_liabilities ?? 0}</td>
                    </tr>
                    <tr className="text-lg bg-primary text-info">
                      <td>Total Liabilities</td>
                      <td>Ksh. {items?.total_liabilities ?? 0}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Paper>
          </Stack>
        </Container>
      </AppLayout>
    </>
  );
}

export default BalanceSheet;
