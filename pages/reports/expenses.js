import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getExpenses } from "@/store/reports/reports-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { formatDate } from "@/lib/shared/data-formatters";
import ApprovalModal from '../../components/purchases/approval-modal';
import { useSession } from "next-auth/react";

function Expenses() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const expensesStatus = useSelector((state) => state.reports.getExpensesStatus);
    const expenses = useSelector((state) => state.reports.getExpenses);
  
    const isLoading = expensesStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
  
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getExpenses(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data Anthony', expenses);
  
    function onPaginationLinkClicked(page) {
      if (!session || !page) {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
        params['page'] = page;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getExpenses(params));
    }
  
    console.log('Search Term Here', debouncedSearchTerm);
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };

      //
  const printExpense = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/download-expense/${itemId}`;

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
    const filename = filenameHeader ? filenameHeader.split('filename=')[1] : 'Invoice.pdf';

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
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setPdfLoading((prevPdfLoading) => ({
        ...prevPdfLoading,
        [itemId]: false,
      }));
    }
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: false,
    }));
  };

  const StatusBadge = ({status}) => {
    let color = '';

    switch (status) {
        case 'Partially Paid':
            color = "blue"
            break;
        case 'Rejected':
            color = "red"
            break;
        case 'Approved':
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


    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">

                        <Paper p="md" shadow='md' radius="md">
                        <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Expense Report</Text>
                                
                                <Group justify="flex-end">
                                <TextInput
                                    placeholder="Search"
                                />
                                <Select
                                        placeholder="Filter by Building"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Ridge Apartments', label: 'Ridge Apartments' },
                                            { value: 'Eden Palace', label: 'Eden Palace' },
                                            { value: 'Test building', label: 'Test building' },
                                        ]}
                                />
                                <Select
                                        placeholder="Filter by Type"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Electricity', label: 'Electricity' },
                                            { value: 'Salaries', label: 'Salaries' },
                                            { value: 'Cleaning', label: 'Cleaning' },
                                        ]}
                                />
                                <Button leftIcon={<IconPrinter size={14} />} variant="filled">
                                    Export PDF
                                </Button>
                                </Group>
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                {/* <th>No.</th> */}
                                <th>Type</th>
                                <th>Description</th>
                                <th>Notes</th>
                                {/* <th>Building</th> */}
                                <th>Unit</th>
                                <th>Tenant</th>                                
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                            {expenses?.expenses?.data?.map((item) => (
                              <>
                            <tr key={item?.id} >
                            {/* <td>{ item?.code }</td> */}
                            {item?.items ? (
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.name?.substr(0, 15);
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
                            <td style={{
                                whiteSpace: "pre-wrap",
                                wordWrap: "break-word",
                                maxWidth: "50ch",
                            }}>
                                {JSON.parse(item?.items).map((itemData) => {
                                const truncatedName = itemData?.desc?.substr(0, 15);
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
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>                     
                            <td>{formatDate(item?.expense_date)}</td>
                                                                                
                            </tr>
                            
                          </>
                             ))}

                             <tr className="text-lg">
                            <th
                              scope="row"
                              colSpan="5"
                              className="text-primary font-bold"
                            >
                              TOTALS
                            </th>
                            <td className="text-dark tracking-wider text-xxl font-bold">
                              Ksh. {expenses?.total_expenses ?? 0}
                            </td>
                          </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={expenses?.expenses}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Expenses;
