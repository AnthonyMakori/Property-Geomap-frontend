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
import { getProfitLoss } from "../../store/reports/reports-slice";
import {
  getDateFilterFrom,
  getDateFilterTo,
} from "@/lib/shared/data-formatters";

function ProfitLoss() {
  const { data: session, status } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] = useState({});
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  //setApprovalStatus

  const trialBalanceStatus = useSelector((state) => state.reports.getProfitLossStatus);
  const trialBalance = useSelector((state) => state.reports.getProfitLoss);

  const isLoading = trialBalanceStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }
    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getIncomes(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getProfitLoss(params));
  }, [startDate, endDate, session, status]);


  return (
    <>
      <AppLayout>
        <Container fluid>
          <Stack spacing="lg">
            <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
                <Text fz="lg" fw={600}>
                  Profit and Loss
                </Text>
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
                    leftIcon={<IconFileExport size={14} />}
                  >
                    Export PDF
                  </Button>
                </Group>
              </Group>
              <div id="responsive-table">
                <Table>
                  {/* <thead>
                    <tr>
                      <th>Account Name</th>
                      <th>Debit Balance</th>
                      <th>Credit Balance</th>
                    </tr>
                  </thead> */}
                  <tbody>
                    <>
                      <h5>INCOME</h5>
                      <tr key={1}>
                        <td>Income</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.incomes) ?? 0}
                        </td>
                      </tr>
                      <tr key={1}>
                        <td>Invoices</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.invoices) ?? 0}
                        </td>
                      </tr>
                      <tr style={{ background: "#364b6a", color: "#ffffff" }} key={1}>
                        <td>TOTAL INCOME</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.invoices + trialBalance?.incomes) ?? 0}
                        </td>
                      </tr>
                      <h5>LESS COST OF SALES</h5>
                      <tr key={1}>
                        <td>Purchases</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.purchases) ?? 0}
                        </td>
                      </tr>
                      <tr style={{ background: "#364b6a", color: "#ffffff" }} key={1}>
                        <td>GROSS PROFIT</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.invoices - trialBalance?.purchases) ?? 0}
                        </td>
                      </tr>
                      <h5>OPERATING EXPENSES</h5>
                      <tr key={1}>
                        <td>Expenses</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.expenses) ?? 0}
                        </td>
                      </tr>
                    </>

                    <tr style={{ background: "#364b6a", color: "#ffffff" }} key={1}>
                        <td>Total Net Income</td>
                        <td>
                          Ksh. {formatNumber(trialBalance?.invoices - trialBalance?.purchases - trialBalance?.expenses) ?? 0}
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

export default ProfitLoss;
