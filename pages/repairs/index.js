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
import { debounce } from 'lodash'; // Import debounce from lodash
import { showNotification } from '@mantine/notifications';
import RecordPaymentModal from '@/components/Invoices/record-payment-modal';
import StkPushModal from '@/components/Invoices/stk-push-modal';
import { formatDate } from "@/lib/shared/data-formatters";
import { getRepairs } from "@/store/properties/buildings/buildings-slice";
import RepairsModal from '@/components/repairs/repairs-modal';
import ApprovalModal from '../../components/purchases/approval-modal';
import { useSession } from "next-auth/react";

function Expenses() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
  
    const repairsStatus = useSelector((state) => state.buildings.getRepairsStatus);
    const repairs = useSelector((state) => state.buildings.getRepairs);
  
    const isLoading = repairsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getRepairs(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data Anthony', repairs);
  
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
  
      store.dispatch(getRepairs(params));
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
    const endpoint = `${API_URL}/repairs/download/${itemId}`;

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
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Repairs</Title>
                                </Stack>
                                <RepairsModal />
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Repairs</Text>
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
                                <th>No.</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Unit</th>
                                <th>Tenant</th>  
                                <th>Status</th>                              
                                <th>Date</th>

                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {repairs?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.code }</td>
                            <td>{ item?.title ?? '' }</td>
                            <td>{item?.description ?? "-"}</td>
                            {/* <td>{item?.unit?.building?.name ?? "-"}</td>  */}
                            <td>{item?.unit?.name ?? "-"}</td>  
                            <td>{item?.unit?.tenant?.name ?? "-"}</td>
                            <td>                               
                                {item?.status === "Rejected"
                                ? <StatusBadge status={`Rejected`}/>
                                : item?.status === "Pending"
                                ? <StatusBadge status={`Pending`}/>
                                : item?.status === "Approved"
                                ? <StatusBadge status={`Approved`}/>
                                : null}
                            </td>

                            <td>{formatDate(item?.created_at)}</td>

                            <ApprovalModal item={item} origin="repairs" />

                           
                                                                               
                            {/* <td>
                                <Button color="blue" loading={pdfLoading[item.id]} onClick={() => printExpense(item?.id)} mb="xs" leftIcon={<IconPrinter size="1rem" />} variant='outline' mr="xs" size='xs'> Download </Button>
                            </td> */}
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={repairs}
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
