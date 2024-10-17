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
import PurchasesModal from "../../components/purchases/purchases-modal";
import { getPurchases } from "@/store/accounts/accounts-slice";
import ApprovalModal from "../../components/purchases/approval-modal";
import { useSession } from "next-auth/react";
import AddIncomeModal from "../../components/Settings/add-income-modal";
import { formatNumber } from "@/lib/shared/data-formatters";
import { getTaxes } from "@/store/settings/settings-slice";
import AddTaxModal from "../../components/Settings/add-tax-modal";

function Taxes() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const itemStatus = useSelector((state) => state.settings.getTaxesStatus);
  const items = useSelector((state) => state.settings.getTaxes);

  const isLoading = itemStatus === "loading";

  useEffect(() => {
    if (!session || status !== "authenticated") {
      return;
    }

    const params = {};
    params["accessToken"] = session.user.accessToken;

    if (!startDate && !endDate) {
      store.dispatch(getTaxes(params));
      return;
    }
    if (!startDate || !endDate) {
      return;
    }
    params["startDate"] = startDate;
    params["endDate"] = endDate;

    store.dispatch(getTaxes(params));
  }, [session, status, startDate, endDate]);

  function onPaginationLinkClicked(page) {
    if (!page || !session) {
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

    store.dispatch(getTaxes(params));
  }

  return (
    <>
      <AppLayout>
        <Container fluid>
          <Stack spacing="lg">
            <Flex
              align="center"
              justify="space-between"
              direction={{ base: "row", sm: "row" }}
              gap={{ base: "sm", sm: 4 }}
            >
              <Stack>
                <Title order={3}>Taxes</Title>
              </Stack>
              <AddTaxModal />
            </Flex>
            <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
                <Text fz="lg" fw={600}>
                  Taxes
                </Text>
                <TextInput label="Search" placeholder="Search" />
              </Group>
              <div id="responsive-table">
                <Table>
                  <thead>
                    <tr>
                      <th scope="col" className="th-primary">
                        NO
                      </th>
                      <th scope="col" className="th-primary">
                        NAME
                      </th>
                      <th scope="col" className="th-primary">
                        TAX (%)
                      </th>
                      <th scope="col" className="th-primary">
                        DATE
                      </th>
                      {/* <th scope="col" className="th-primary text-right">
                  ACTION
                </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {!isLoading &&
                      items?.data?.map((item) => (
                        <tr key={item?.id}>
                          <td>{item?.id}</td>
                          <td>{item?.name ?? "-"}</td>
                          <td>{formatNumber(item?.tax) ?? 0}%</td>
                          <td>{formatDate(item?.created_at)}</td>
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

export default Taxes;
