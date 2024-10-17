import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Card} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconArrowBack} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { debounce } from 'lodash'; 
import { showNotification } from '@mantine/notifications';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { formatDate } from "@/lib/shared/data-formatters";
import RepairsModal from '@/components/repairs/repairs-modal';
import PurchasesModal from '@/components/purchases/purchases-modal';
import { getPurchases } from "@/store/accounts/accounts-slice";
import ApprovalModal from '@/components/purchases/approval-modal';
import { useSession } from "next-auth/react";
import AddStaffModal from '@/components/Partners/add-staff-modal';
import { getStaff } from '@/store/users/users-slice';
import { TrafficLayer } from '@react-google-maps/api';
import { formatNumber } from '@/lib/shared/data-formatters'
import { IconFileExport } from '@tabler/icons-react';
import { getClientStatement } from '@/store/reports/reports-slice';
import { useRouter } from 'next/router';

export default function ClientStatementOfAccounts() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState(false);

    const router = useRouter();

    const clientId = router.query?.clientId ?? null;

    const statementStatus = useSelector((state) => state.reports.getClientStatementStatus);
    const statement = useSelector((state) => state.reports.getClientStatement);
  
    const isLoading = statementStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["clientId"] = clientId;

        params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getClientStatement(params));
    }, [debouncedSearchTerm, session, status, clientId]);

    const agingReport = statement?.aging?.original;
  
    function onPaginationLinkClicked(page) {
      if (!session || !page) {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
        params['page'] = page;
        params["clientId"] = clientId;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getClientStatement(params));
    }
  
    console.log('Search Term Here', debouncedSearchTerm);
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };

    const download = async () => {
        // Set loading state to true for the clicked item
        setPdfLoading(true);
    
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/reports/download-landlord-statement/${clientId}`;
    
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
        const filename = filenameHeader ? filenameHeader.split('filename=')[1] : 'Statement.pdf';
    
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

  const actions = (
    <Button
      size="xs"
      variant="outline"
       onClick={downloadPdf}
       loading={isDownloadingPdf}
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
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                                m-5
                            >
                                <Stack>
                                    <Title order={4}>Client Statement of Account</Title>
                                </Stack>
                                <Group justify="flex-end">  
                                    <TextInput
                                        label="From"
                                        placeholder="From"
                                        type="date"
                                        size='xs'
                                        // value={startDate}
                                        // onChange={(e) => onChangeStartDate(e.target.value)}
                                    />
                                    <TextInput
                                        label="To"
                                        placeholder="To"
                                        type="date"
                                        size='xs'
                                        // value={endDate}
                                        // onChange={(e) => onChangeEndDate(e.target.value)}
                                    />          
                                    <Button mt="xl" size='xs' variant='outline' onClick={download} loading={pdfLoading} leftIcon={<IconFileExport size={14} />}>Export PDF</Button>
                                    <Link href="/askaris/tenants/">
                                      <Button mt="xl" leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                    </Link>
                                </Group> 
                            </Flex>
                            </Card>
    <Card>
      <main className="flex flex-col gap-4">
        <section className="flex w-full flex-row justify-end mb-5">
          <div className="w-full">
            <Table>
                <tbody>
                  <TRowSubHeader label="Account Summary (Ksh)" />
                  <TRowRecord
                    label="Invoiced Amount"
                    value={statement?.invoiced ?? 0}
                  />
                  <TRowRecord
                    label="Amount Paid"
                    value={statement?.paid ?? 0}
                  />
                  <TRowFooter
                    label="Balance Due"
                    value={statement?.due ?? 0}
                  />
                </tbody>
            </Table>
          </div>
        </section>

        <h4 className='mb-0 mt-0 text-primary'>Invoices Statement</h4>
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
                Invoiced
              </th>
              <th scope="col" className="th-primary text-right">
                Paid
              </th>
              <th scope="col" className="th-primary text-right">
                Date
              </th>
            </tr>
            </thead>
          <tbody>
            {!isLoading &&
              statement?.invoices?.data?.map((item) => ( 
                <>
                  {item?.payments?.map((record) => (
                    <tr key={`1_payment`}>
                      <td>{record?.id}</td>
                      <td>Payment</td>
                      <td>FOR: {item?.code ?? '-'}</td>
                      <td ></td>
                      <td >
                        Ksh. {record?.amount ?? 0}
                      </td>
                      <td >
                      {formatDate(record?.created_at)}
                      </td>
                    </tr>
                    ))}

                  <tr key={`2_invoice`}>
                    <td>{item?.id}</td>
                    <td>Invoice</td>
                    <td>{item?.code}</td>
                    <td >
                      Ksh. {item?.total ?? 0}
                    </td>
                    <td ></td>
                    <td >
                    {formatDate(item?.created_at)}
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </Table>
        <PaginationLinks
            paginatedData={statement?.invoices}
            onLinkClicked={onPaginationLinkClicked}
        />

      </main>

       {isLoading && (
        <div className="flex justify-center w-full p-3 bg-light rounded-lg">
          <StatelessLoadingSpinner />
        </div>
      )}

      <PaginationLinks
        paginatedData={records?.invoices}
        onLinkClicked={onPaginationLinkClicked}
      /> 
    </Card>

    <Paper p="md" shadow="md" radius="md">
              <Group position="apart" mb="md">
              <h4 className='mb-0 mt-0 text-primary'>Aging Report</h4>

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
            </Paper>


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
