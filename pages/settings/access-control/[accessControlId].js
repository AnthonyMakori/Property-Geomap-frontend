import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Checkbox} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPrinter, IconCurrencyDollar, IconShare, IconPlus, IconLock, IconShieldLock} from "@tabler/icons-react";
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
import AddAccessControlRoleModal from '@/components/Settings/add-role-modal';
import { IconLockCog } from '@tabler/icons-react';
import { getAccessGroups } from '@/store/settings/settings-slice';

function AccessControl() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [pdfLoading, setPdfLoading] = useState({});
    //setApprovalStatus
    
    const accessGroupsStatus = useSelector((state) => state.settings.getAccessGroupsStatus);
    const accessGroups = useSelector((state) => state.settings.getAccessGroups);
  
    const isLoading = accessGroupsStatus === 'loading';
  
    useEffect(() => {
      if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getAccessGroups(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('data monyancha', accessGroups);
  
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
  
      store.dispatch(getAccessGroups(params));
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
                                    <Title order={3}>Assign Permissions</Title>
                                </Stack>
                                {/* <AddAccessControlRoleModal /> */}
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Assign Permissions</Text>
                                {/* <TextInput
                                    label="Search"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={handleSearchTermChange}
                                /> */}
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Assign</th>
                                </tr>
                            </thead>
                            <tbody>
                            {/* {accessGroups?.data?.map((item) => ( */}
                            <tr  >
                            <td>Dashboard</td>
                            <td> <Checkbox defaultChecked /> </td>
                            </tr>
                            <tr  >
                            <td>Properties</td>
                            <td> <Checkbox defaultChecked /> </td>
                            </tr>
                            <tr  >
                            <td>Accounts</td>
                            <td> <Checkbox defaultChecked /> </td>
                            </tr>
                            <tr  >
                            <td>Maintenance</td>
                            <td> <Checkbox defaultChecked /> </td>
                            </tr>
                            <tr  >
                            <td>Purchases</td>
                            <td> <Checkbox /> </td>
                            </tr>
                            <tr  >
                            <td>Messages</td>
                            <td> <Checkbox defaultChecked /> </td>
                            </tr>
                            <tr  >
                            <td>Users</td>
                            <td> <Checkbox /> </td>
                            </tr>
                            <tr  >
                            <td>Reports</td>
                            <td> <Checkbox /> </td>
                            </tr>
                            <tr  >
                            <td>Settings</td>
                            <td> <Checkbox /> </td>
                            </tr>
                             {/* ))} */}
                            </tbody>
                            
                            </Table>
                            </div>
                            {/* <PaginationLinks
                                paginatedData={accessGroups}
                                onLinkClicked={onPaginationLinkClicked}
                            /> */}
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default AccessControl;
