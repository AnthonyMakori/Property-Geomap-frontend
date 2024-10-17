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
import { getCommunications } from "@/store/communications/communication-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { useSession } from "next-auth/react";
import TopUpModal from '@/components/Payments/topup-modal';
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { getAirtimeBalance } from '@/store/communications/communication-slice';
import { formatNumber } from '@/lib/shared/data-formatters'

function Leases() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
    const communicationsStatus = useSelector((state) => state.communication.getCommunicationsStatus);
    const communications = useSelector((state) => state.communication.getCommunications);
  
    const isLoading = communicationsStatus === 'loading';
  
    useEffect(() => {
        if (!session || status !== "authenticated") {
            return;
            }
      const params = {};
      
        params["accessToken"] = session?.user?.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getCommunications(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data monyancha', communications);
  
    function onPaginationLinkClicked(page) {
      if (!page) {
        return;
      }
  
      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      params['page'] = page;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getCommunications(params));
    }
  
    console.log('Search Term Here', debouncedSearchTerm);
  
    // Debounce the search term input
    const debouncedSearch = debounce((value) => setDebouncedSearchTerm(value), 500);
  
    const handleSearchTermChange = (e) => {
      const { value } = e.target;
      setSearchTerm(value);
      debouncedSearch(value); // Debounced search term
    };


    //Get Airtime Balance
    const airtime = useSelector((state) => state.communication.getAirtimeBalance);

    useEffect(() => {
    if (!session || status !== "authenticated") {
        return;
    }
      const params = {};
      params["accessToken"] = session?.user?.accessToken;
      store.dispatch(getAirtimeBalance(params));
    }, [session, status]);

    console.log("Monyancha Airtime", airtime);

    //End Airtime Balance

    const airtimeB = (airtime / 0.7);

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                    {airtime <= 10 && (
                    <Alert variant="filled" color="orange" radius="md" withCloseButton title="Airtime Low" icon={<IconInfoCircle />}>
                    <Group position="apart">
                        <Text>Your airtime balance is low! Kindly topup to avoid interruptions. Current credit balance is: { formatNumber(airtimeB) ?? '0'} SMSs</Text>
                    </Group>
                    </Alert>
                    )}
                    {airtime > 10 && (
                    <Alert variant="filled" color="blue" radius="md" withCloseButton title="Airtime Balance" icon={<IconInfoCircle />}>                    
                    <Group position="apart">
                        <Text>Your current credit balance is: { formatNumber(airtimeB) ?? '0'} SMSs</Text>
                    </Group>                    
                    </Alert>
                    )}
                    <Flex
                                align="center"
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                    <Title order={3}>Messages</Title>
                                </Stack>
                                <TopUpModal />
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Messages</Text>
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
                                <th>Type</th>
                                <th>Message</th>
                                {/* <th>Status</th> */}
                                <th>Created On</th>
                                </tr>
                            </thead>
                            <tbody>
                            {communications?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>#{ item?.invoice?.code ?? '-' }</td>
                            <td>{item?.user?.name ?? "-"}</td>
                            <td>{item?.subject ?? "-"}</td>
                            <td>{item?.message ?? "-"}</td>
                            {/* <td>Success</td>                            */}
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={communications}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Leases;
