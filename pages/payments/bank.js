import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getPayments } from "@/store/accounts/accounts-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { IconPrinter } from '@tabler/icons-react';
import { useSession } from "next-auth/react";

function BankPayments() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});

    const paymentsStatus = useSelector((state) => state.accounts.getPaymentsStatus);
    const payments = useSelector((state) => state.accounts.getPayments);
  
    const isLoading = paymentsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getPayments(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data Anthony', payments);
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
    }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getPayments(params));
    }
  
    console.log('Search Term Here', debouncedSearchTerm);
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };

    const download = async (itemId) => {
        // Set loading state to true for the clicked item
        setPdfLoading((prevPdfLoading) => ({
          ...prevPdfLoading,
          [itemId]: true,
        }));
    
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const endpoint = `${API_URL}/accounts/download-receipt/${itemId}`;
    
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
    


    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    {/* <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Bank Payments</Title>
                                </Stack>
                            </Flex> */}
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Bank Payments</Text>
                                <TextInput
                                    label="Search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice No.</th>
                                <th>Tenant</th>
                                <th>Amount</th>                               
                                <th>Method</th>
                                <th>Bank Account</th>
                                <th>Reference Code</th>
                                <th>Date</th>
                                {/* <th>Actions</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {payments?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.invoice?.code ?? '-' }</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>Ksh. {item?.amount ?? "-"}</td>
                            <td>{item?.method ?? "-"}</td> 
                            <td>Equity Bank</td> 
                            <td>{item?.reference_code ?? "-"}</td>                     
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td>
                            {/* <Button color="blue" loading={pdfLoading[item.id]} onClick={() => download(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button> */}
                            </td>   
                            </tr>
                             ))}
                            </tbody>                           
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={payments}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default BankPayments;
