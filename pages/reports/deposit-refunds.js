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
import { debounce } from 'lodash'; // Import debounce from lodash
import { IconPrinter } from '@tabler/icons-react';
import { getRefunds } from "@/store/reports/reports-slice";
import { useSession } from "next-auth/react";
import { formatDate } from "@/lib/shared/data-formatters";

function DepositRefunds() {
  const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});

    const refundsStatus = useSelector((state) => state.reports.getRefundsStatus);
    const refunds = useSelector((state) => state.reports.getRefunds);
  
    const isLoading = refundsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getRefunds(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data Anthony income', refunds);
  
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
  
      store.dispatch(getRefunds(params));
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
                        <Paper p="md" shadow='md' radius="md">
                        <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Deposit Refunds</Text>
                                
                                <Group justify="flex-end">
                                <TextInput
                                    placeholder="Search"
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
                                <th scope="col" className="th-primary">
                Lease No.
              </th>
              <th scope="col" className="th-primary">
                Tenant
              </th>
              {/* <th scope="col" className="th-primary">
                Unit Name
              </th> */}
              <th scope="col" className="th-primary">
                Unit Code
              </th>
              <th scope="col" className="th-primary">
                Deposit Paid
              </th>
              <th scope="col" className="th-primary">
                Refunded Amount
              </th>
              <th scope="col" className="th-primary text-right">
                Deductions
              </th>
              <th scope="col" className="th-primary text-right">
                Date
              </th>
                                </tr>
                            </thead>
                            <tbody>
                            {refunds?.refunds?.data?.map((item) => (
                                <tr key={`1_payment`}>
                                <td>{item?.code}</td>
                                <td>{item?.tenant?.name ?? '-'}</td>
                                {/* <td>{item?.unit?.name ?? '-'}</td> */}
                                <td >{item?.unit?.code ?? '-'}</td>
                                <td >Ksh. {item?.deposit ?? 0}</td>
                                <td >Ksh. {item?.refunded ?? 0}</td>
                                <td >Ksh. {(item?.deposit) - (item?.refunded) ?? 0}</td>
                                <td >
                                {formatDate(item?.created_at)}
                                </td>
                                </tr>
                            ))}
                             <tr className="text-lg">
                              <th
                                scope="row"
                                colSpan="3"
                                className="text-primary font-bold"
                              >
                                TOTALS
                              </th>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {refunds?.total_deposits ?? 0}
                              </td>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {refunds?.total_refunds ?? 0}
                              </td>
                              <td className="text-dark tracking-wider text-xxl font-bold">
                                Ksh. {refunds?.total_deductions ?? 0}
                              </td>
                            </tr>
                            </tbody>                           
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={refunds?.refunds}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default DepositRefunds;
