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
import { IconFileExport } from "@tabler/icons-react";
import { formatNumber } from "../../lib/shared/data-formatters";
import { getTrialBalance } from "../../store/reports/reports-slice";

function BalanceSheet() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] = useState({});
  //setApprovalStatus

  const trialBalanceStatus = useSelector((state) => state.reports.getTrialBalanceStatus);
  const trialBalance = useSelector((state) => state.reports.getTrialBalance);

  const isLoading = trialBalanceStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (debouncedSearchTerm) {
      params["filter"] = debouncedSearchTerm;
    }

    store.dispatch(getTrialBalance(params));
  }, [debouncedSearchTerm, session, status]);

  console.log("data monyancha", trialBalance?.data);

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

  // Replace these with your actual trial balance data
  const accounts = [
    { name: "Cash", debit: 101500, credit: 0 },
    { name: "Accounts Receivable(Invoices)", debit: 0, credit: 392631 },
    { name: "Properties, Plant & Equipment", debit: 386483, credit: 0 },
    { name: "Owner&apos;s Equity", debit: 0, credit: 27487 },
    { name: "Expenses", debit: 0, credit: 67865 },
  ];

  // Calculate the total debit and credit balances
  const totalDebit = accounts.reduce((sum, account) => sum + account.debit, 0);
  const totalCredit = accounts.reduce(
    (sum, account) => sum + account.credit,
    0
  );

  // Calculate the difference between total debit and total credit (should be zero in a balanced trial balance)
  const balanceDifference = totalDebit - totalCredit;

  return (
    <>
      <AppLayout>
        <Container fluid>
          <Stack spacing="lg">
            <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
                <Text fz="lg" fw={600}>
                  Trial Balance Statement
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
                      <th>Account Name</th>
                      <th>Debit Balance</th>
                      <th>Credit Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      <tr key={1}>
                        <td>Cash</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.current_assets) ?? 0}
                        </td>
                        <td></td>
                      </tr>
                      <tr key={1}>
                        <td>Accounts Receivable(Invoices)</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.invoices_owed) ?? 0}
                        </td>
                        <td></td>
                      </tr>
                      <tr key={1}>
                        <td>Income</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.investments) ?? 0}
                        </td>
                        <td></td>
                      </tr>
                      <tr key={1}>
                        <td>Properties, Plant & Equipment</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.total_properties) ?? 0}
                        </td>
                        <td></td>
                      </tr>
                      <tr key={1}>
                        <td>Owner&apos;s Equity </td>
                        <td></td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.equity) ?? 0}
                        </td>
                      </tr>
                      <tr key={1}>
                        <td>Expenses</td>
                        <td></td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.expenses) ?? 0}
                        </td>
                      </tr>
                    </>

                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>Ksh. { formatNumber(trialBalance?.total_assets) ?? 0 }</strong>
                      </td>
                      <td>
                        <strong>Ksh. { formatNumber(trialBalance?.total_liabilities) ?? 0}</strong>
                      </td>
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
