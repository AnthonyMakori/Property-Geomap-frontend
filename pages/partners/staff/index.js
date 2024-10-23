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
import RepairsModal from '@/components/repairs/repairs-modal';
import PurchasesModal from '@/components/purchases/purchases-modal';
import { getPurchases } from "@/store/accounts/accounts-slice";
import ApprovalModal from '@/components/purchases/approval-modal';
import { useSession } from "next-auth/react";
import AddStaffModal from '@/components/Partners/add-staff-modal';
import { getStaff } from '@/store/users/users-slice';

function Staff() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
    //setApprovalStatus
    
    const staffStatus = useSelector((state) => state.users.getStaffStatus);
    const staff = useSelector((state) => state.users.getStaff);
  
    const isLoading = staffStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getStaff(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data Anthony', staff?.data);
  
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
  
      store.dispatch(getStaff(params));
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
                                    <Title order={3}>Staff</Title>
                                </Stack>
                                <AddStaffModal />
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Staff</Text>
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
                                <th>ID NO.</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone No.</th>
                                <th>Role</th>
                                <th>Created At</th>
                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {staff?.data?.map((item) => (
                            <tr >
                            <td>{item?.code ?? '-'}</td>
                            <td>{item?.name ?? '-'}</td>
                            <td>{item?.email ?? '-'}</td>
                            <td>{item?.phone ?? '-'}</td>
                            <td>Staff</td>
                            <td>{formatDate(item?.created_at)}</td>
                            {/* <td>
                                <Button size='xs'>Edit</Button>
                            </td> */}

                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={staff}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Staff;
