import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getInvoices } from "@/store/accounts/accounts-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';

function Invoices() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const invoicesStatus = useSelector((state) => state.accounts.getInvoicesStatus);
    const invoices = useSelector((state) => state.accounts.getInvoices);
  
    const isLoading = invoicesStatus === 'loading';
  
    useEffect(() => {
      const params = {};
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getInvoices(params));
    }, [debouncedSearchTerm]);
  
    console.log('data monyancha', invoices);
  
    function onPaginationLinkClicked(page) {
      if (!page) {
        return;
      }
  
      const params = {};
      params['page'] = page;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
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

    // const accessToken = session.user.accessToken;

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "GET",
      // Tell the server we're sending JSON.
      headers: {
        // Authorization: `Bearer ${accessToken}`,
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
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Invoices</Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                            </Group>

                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice No.</th>
                                <th>Building</th>
                                <th>Unit</th>
                                <th>Tenant</th>
                                <th>Lease No.</th>
                                <th>Rent Amount</th>
                                <th>Paid</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {invoices?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            <td>{ item?.building?.name ?? '-' }</td>
                            <td>{item?.unit?.name ?? "-"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>{ item?.lease?.code }</td>
                            <td>Ksh. {item?.amount ?? "-"}</td>
                            <td>Ksh. 0</td>
                            <td>Ksh. 0</td>
                            <td>{item?.status ?? "-"}</td>
                            
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>
                                <Link href={`/askaris/revenue/rentals/${item?.id}`}>
                                <Button color="cyan" leftIcon={<IconEye size="1rem" />} variant='outline' mr="xs" mb="xs" size='xs'> View </Button>
                                </Link>
                                <Button color="indigo" leftIcon={<IconEdit size="1rem" />} variant='outline' mb="xs"  mr="xs" size='xs'> Edit </Button>
                                <Button color="violet" leftIcon={<IconShare size="1rem" />} variant='outline'  mb="xs" mr="xs" size='xs'> Share </Button>
                                <Button color="yellow" loading={pdfLoading[item.id]} onClick={() => printInvoice(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                                <Button color="green" leftIcon={<IconCurrencyDollar size="1rem" />} variant='outline' size='xs'> Record Payment </Button>
                                    
                                {/* <ActionIcon variant="filled" color='red' aria-label="Settings">
                                    <IconTrash />
                                </ActionIcon>                         */}
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            <PaginationLinks
                                paginatedData={invoices}
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
