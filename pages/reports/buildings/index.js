import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, TextInput, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPencil, IconPlus, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '@/components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getBuildings } from "@/store/properties/buildings/buildings-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { useSession } from "next-auth/react";

function Buildings() {
    const { data: session, status } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
    const buildingsStatus = useSelector((state) => state.buildings.getBuildingsStatus);
    const buildings = useSelector((state) => state.buildings.getBuildings);
  
    const isLoading = buildingsStatus === 'loading';
  
    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
      const params = {};

      params["accessToken"] = session.user.accessToken;
  
      if (debouncedSearchTerm) {
        params['filter'] = debouncedSearchTerm;
      }
  
      store.dispatch(getBuildings(params));
    }, [debouncedSearchTerm, session, status]);
  
    console.log('Buildings data Anthony', buildings);
  
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
  
      store.dispatch(getBuildings(params));
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
                                    <Title order={3}>Buildings</Title>
                                </Stack>
                                <Link href="/askaris/revenue/rentals/create">
                                <Button leftIcon={<IconPlus size={18}/>}>New Building</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}></Text>
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
                                <th>Name</th>
                                <th>Category</th>
                                {/* <th>Owner</th> */}
                                <th>Units</th>
                                {/* <th>Zone</th> */}
                                <th>Location</th>
                                <th>Value(KES)</th>
                                {/* <th>Date</th> */}
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {buildings?.data?.map((item) => (
                            <tr key={item?.id} >
                            <td>{ item?.name }</td>
                            <td>{ item?.type ?? '-' }</td>
                            {/* <td>{item?.owner?.name ?? "-"}</td> */}
                            <td>{item?.units ?? "-"}</td>
                            {/* <td>{item?.zone?.name ?? "-"}</td> */}
                            <td>{item?.location ?? "-"}</td>
                            <td>Ksh. {item?.worth ?? 0}</td>
                            {/* <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td> */}
                            <td>
                                <Link href={`/reports/buildings/${item?.id}?`}>
                                <Button variant='outline' size='xs'>Statement</Button>
                                </Link>
                            </td>
                            </tr>
                             ))}

                            </tbody>
                            
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={buildings}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default Buildings;
