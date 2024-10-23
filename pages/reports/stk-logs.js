import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPdf, IconPencil, IconPlus, IconPrinter, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getLeases } from "@/store/properties/buildings/buildings-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import { getVacantUnits } from "@/store/reports/reports-slice";
import { getStkLogs } from '@/store/settings/settings-slice';
import { useSession } from "next-auth/react";

function StkPushLogs() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const itemsStatus = useSelector((state) => state.reports.getStkLogsStatus);
    const stkLogs = useSelector((state) => state.reports.getStkLogs);
  
    const isLoading = itemsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getStkLogs(params));
    }, [debouncedSearchTerm, session, status]);
  
  
    function onPaginationLinkClicked(page) {
      if (!page || !session) {
        return;
      }
  
      const params = {};
      params["accessToken"] = session.user.accessToken;
      params['page'] = page;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getStkLogs(params));
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
        const endpoint = `${API_URL}/leases/download/${itemId}`;
    
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
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Stk Push Logs</Title>
                                </Stack>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Total Initiated: Ksh. 12,790</Text>
                                
                                <Group justify="flex-end">
                                <TextInput
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
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
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Merchant Request ID</th>
                                <th>Checkout Request ID</th>                                
                                <th>Result Code</th>
                                <th>Result Description</th>
                                <th>Amount</th>
                                <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>

                            <tr  >
                            <td>Anthony Makori</td>
                            <td>0707497200</td>
                            <td>29604-316883713-1</td>
                            <td>ws_CO_28092023135449424707497200</td>
                            <td>2001</td>
                            <td>The initiator information is invalid.</td>
                            <td>Ksh. 12,790</td>
                            <td>2023-09-28</td>

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

export default StkPushLogs;
