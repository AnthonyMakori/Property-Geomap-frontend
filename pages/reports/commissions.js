import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconCircleCheck, IconEdit, IconEye, IconPdf, IconPencil, IconPlus, IconPrinter, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getLeases } from "@/store/properties/buildings/buildings-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import { getCommissions } from "@/store/reports/reports-slice";
import { useSession } from "next-auth/react";
import {formatDate} from "@/lib/shared/data-formatters";
import { getDateFilterFrom, getDateFilterTo } from '@/lib/shared/data-formatters';
import PayCommissionModal from '../../components/commissions/pay-commission-modal';


function CommissionsReport() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
    const [startDate, setStartDate] = useState(getDateFilterFrom());
    const [endDate, setEndDate] = useState(getDateFilterTo());
  
    const itemsStatus = useSelector((state) => state.reports.getCommissionsStatus);
    const items = useSelector((state) => state.reports.getCommissions);
  
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

      if (!startDate && !endDate) {
        store.dispatch(getCommissions(params));
        return;
      }
      if (!startDate || !endDate) {
        return;
      }
  
      params["startDate"] = startDate;
      params["endDate"] = endDate;
  
      store.dispatch(getCommissions(params));
    }, [debouncedSearchTerm, startDate, endDate, session, status]);
  
  
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

      if (!startDate && !endDate) {
        store.dispatch(getCommissions(params));
        return;
      }
      if (!startDate || !endDate) {
        return;
      }
  
      params["startDate"] = startDate;
      params["endDate"] = endDate;
  
      store.dispatch(getCommissions(params));
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
                                    <Title order={3}>Agent Commissions</Title>
                                    {/* <Text fz="lg" fw={600}>Total Commissions: Ksh. {items?.total_commissions ?? 0}</Text> */}
                                </Stack>
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
                                <th>No.</th>
                                {/* <th>Unit</th>
                                <th>Tenant</th> */}
                                <th>Staff</th>
                                <th>Invoice</th>
                                <th>Paid Amount</th>
                                <th>Percentage</th>
                                <th>Amount</th> 
                                <th>Status</th>                               
                                <th>Date</th>
                                <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {items?.commissions?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{item?.code}</td>
                            {/* <td>{item?.unit?.code ?? "-"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td> */}
                            <td>{item?.staff?.name ?? "-"}</td>
                            <td>{item?.invoice?.code ?? "-"}</td>
                            <td>Ksh. {item?.paid ?? "0"}</td>
                            <td>{item?.percentage ?? "0"}%</td>
                            <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>
                              {item?.status === 'paid' ?
                              <Badge color='green' variant='filled'>Paid</Badge>
                              :
                              <Badge color='red' variant='filled'>Pending</Badge>
                              }
                            </td>
                            <td>{formatDate(item?.updated_at) ?? "0"}</td>
                            <td>
                              <PayCommissionModal item={item} />
                              {/* <Button color='green' size="xs" leftIcon={<IconCircleCheck size={18} />} >Mark as Paid</Button> */}
                            </td>
                            </tr>
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
                              Ksh. {items?.total_commissions ?? 0}
                            </td>
                          </tr>
                           

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={items?.commissions}
                                onLinkClicked={onPaginationLinkClicked}
                            />

                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default CommissionsReport;
