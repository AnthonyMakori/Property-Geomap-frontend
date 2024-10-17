import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconChevronDown, IconPencil, IconTrash, IconCircleCheck, IconFileExport} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getInvoices } from "@/store/accounts/accounts-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { useSession } from "next-auth/react";
import GenerateInvoices from '../../components/Invoices/generate-invoices-modal';
import { getDateFilterFrom, getDateFilterTo } from '../../lib/shared/data-formatters';
import BankModal from '../../components/Invoices/bank-modal';

function Invoices() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(getDateFilterFrom());
    const [endDate, setEndDate] = useState(getDateFilterTo());
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
    const [paymentStatus, setPaymentStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  
    const invoicesStatus = useSelector((state) => state.accounts.getInvoicesStatus);
    const invoices = useSelector((state) => state.accounts.getInvoices);
  
    const isLoading = invoicesStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
      const params = {};
      params["accessToken"] = session.user.accessToken;

      if(paymentStatus){
        params['status'] = paymentStatus;
      }
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }

      if (!startDate && !endDate) {
        store.dispatch(getInvoices(params));
        return;
      }
      if (!startDate || !endDate) {
        return;
      }
  
      params["startDate"] = startDate;
      params["endDate"] = endDate;
  
      store.dispatch(getInvoices(params));
    }, [debouncedSearchTerm, paymentStatus, startDate, endDate, session, status]);
  
    console.log('data monyancha', invoices);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
      }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;

      if(paymentStatus){
        params['status'] = paymentStatus;
      }
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }

      if (!startDate && !endDate) {
        store.dispatch(getInvoices(params));
        return;
      }
      if (!startDate || !endDate) {
        return;
      }
  
      params["startDate"] = startDate;
      params["endDate"] = endDate;
  
      store.dispatch(getInvoices(params));
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
  const printInvoice = async (itemId) => {
    // Set loading state to true for the clicked item
    setPdfLoading((prevPdfLoading) => ({
      ...prevPdfLoading,
      [itemId]: true,
    }));

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const endpoint = `${API_URL}/accounts/download-invoice/${itemId}`;

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


  const exportPDF = async () => {
    setIsLoadingPdf(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let endpoint = `${API_URL}/accounts/invoices/download-pdf`;

    // Add query parameters conditionally
    if (startDate && endDate) {
      endpoint += `?start_date=${startDate}&end_date=${endDate}`;
    }
  
    if (paymentStatus) {
      endpoint += `&status=${paymentStatus}`;
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

    const response = await fetch(endpoint, options);
    const result = await response.blob();

    if (!response.ok) {
      throw { message: "failure" };
    }

    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(result);
    a.innerHTML = `Invoices.pdf`;
    a.target = "_blank";
    a.click();

    if (response.status === 200) {
      showNotification({
        title: "Success",
        message: "Download Successful",
        color: "green",
      });
      setIsLoadingPdf(false);
    } else {
      showNotification({
        title: "Error",
        message: "Sorry! " + result.message,
        color: "red",
      });
      setIsLoadingPdf(false);
    }
    setIsLoadingPdf(false);
  };

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


    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Invoices</Title>
                                </Stack>
                                <Group justify="flex-end">
                                  <GenerateInvoices />
                                <Link href="/leases/create">
                                <Button size='xs' leftIcon={<IconPlus size={18}/>}>New Invoice</Button>
                                </Link>
                                </Group>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">

                            <Group justify="flex-start">
                                <TextInput 
                                  label="From"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  type='date'
                                />
                                <TextInput 
                                  label="To"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  type='date'
                                />
                                </Group>
                                <Group justify="flex-end">

                                <Select
                              placeholder="Payment Status"
                              // label="Payment Status"
                              data={[
                                { value: "paid", label: "Paid" },
                                { value: "partially_paid", label: "Partially Paid" },
                                { value: "pending", label: "Pending" },
                              ]}
                              searchable
                              clearable
                              onChange={setPaymentStatus}
                            />
                             <Button
                                  onClick={exportPDF}
                                  loading={isLoadingPdf}
                                  // variant="outline"
                                  // size="xs"
                                  color="blue"
                                  leftIcon={<IconFileExport size={16} />}
                                >
                                  Export PDF
                                </Button>
                            </Group>
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>No.</th>
                                <th>Tenant</th>                                
                                {/* <th>Rent</th>
                                <th>Deposit</th>
                                <th>Service Fee</th>
                                <th>Processing Fee</th>
                                <th>Penalty</th> */}
                                <th>Total</th>
                                <th>Paid</th>
                                <th>Owed</th>
                                <th>Status</th>
                                {/* <th>Date</th> */}
                                <th>Offline</th>
                                <th>Bank</th>
                                <th>M-pesa</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoices?.invoices.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.code }</td>
                            <td>{item?.tenant?.name ?? "-"}</td>                            
                            {/* <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>Ksh. {item?.deposit ?? "0"}</td>
                            <td>Ksh. {item?.service_fee ?? "0"}</td>
                            <td>Ksh. {item?.processing_fee ?? "0"}</td>
                            <td>Ksh. {item?.penalty ?? "0"}</td> */}
                            <td>Ksh. {item?.total ?? "0"}</td>
                            <td>Ksh. {item?.total_paid ?? "0"}</td>
                            <td>Ksh. {item?.total_owed ?? "0"}</td>
                            
                            <td>
                            {item?.status === 'paid'
                                ? <StatusBadge status={`Completed`} />
                                : item?.status === 'partially_paid'
                                ? <StatusBadge status={`Partially Paid`} />
                                : <StatusBadge status={`Pending`} />}
                            </td>
                            <td>
                             <RecordPaymentModal item={item} />
                            </td>
                            <td>
                            <BankModal item={item} />
                            </td>
                            <td>
                                <StkPushModal item={item} />
                            </td>
                                                                                
                            {/* <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td> */}
                            <td>
                            
                                <Menu
                                    shadow="md"
                                    ml="xs"
                                    width={200}
                                    position="bottom-end"
                                    variant="outline"
                                >
                                    <Menu.Target>
                                    <Button
                                        rightIcon={<IconChevronDown size={14} />}
                                        size="xs"
                                    >
                                        Actions
                                    </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                    <Menu.Label>#{item?.id}</Menu.Label>
                                    {/* <Link href={`/askaris/revenue/rentals/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link> */}

                                    {/* <Link
                                        href={`/leases/edit/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link> */}
                                        <Menu.Item
                                        color="yellow"
                                        loading={pdfLoading[item.id]} 
                                        onClick={() => printInvoice(item?.id)}
                                        icon={<IconPrinter size={15} />}
                                        >
                                        Download
                                        </Menu.Item>
                                        
                                    {/* <Menu.Item
                                        icon={<IconTrash size={15} />}
                                        // onClick={() => {
                                        // setDeleteModalOpen(true);
                                        // setCurrentStaff(item);
                                        // }}
                                        color="red"
                                    >
                                        Delete
                                    </Menu.Item> */}
                                    </Menu.Dropdown>
                                </Menu>
                                
                            </td>
                            </tr>
                             ))}

                      <tr className="text-lg">
                            <th
                              scope="row"
                              colSpan="2"
                              className="text-primary font-bold"
                            >
                              TOTALS
                            </th>
                            <td className="text-dark tracking-wider text-xxl font-bold">
                              Ksh. {invoices?.total_invoices ?? 0}
                            </td>
                          </tr>

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={invoices?.invoices}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Invoices;
