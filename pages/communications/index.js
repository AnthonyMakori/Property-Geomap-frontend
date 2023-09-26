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

function Leases() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
    const communicationsStatus = useSelector((state) => state.communication.getCommunicationsStatus);
    const communications = useSelector((state) => state.communication.getCommunications);
  
    const isLoading = communicationsStatus === 'loading';
  
    useEffect(() => {
      const params = {};
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getCommunications(params));
    }, [debouncedSearchTerm]);
  
    console.log('data monyancha', communications);
  
    function onPaginationLinkClicked(page) {
      if (!page) {
        return;
      }
  
      const params = {};
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
                                    <Title order={3}>Messages</Title>
                                </Stack>
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

                            <Table>
                            <thead>
                                <tr>
                                <th>Invoice No.</th>
                                <th>Tenant</th>
                                <th>Type</th>
                                <th>Message</th>
                                <th>Status</th>
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
                            <td>Success</td>                           
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
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
