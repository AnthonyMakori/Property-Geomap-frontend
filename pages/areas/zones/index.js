import React, {useEffect, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus} from "@tabler/icons-react";
import Link from 'next/link';
import PaginationLinks from '../../../components/Pagination/pagination-links';
//////////
import { useSession } from "next-auth/react";
import { getZones } from "@/store/settings/settings-slice";
import { useSelector } from 'react-redux';
import store from '@/store/store';

function List() {
    const { data: session, status } = useSession();

    const zonesStatus = useSelector((state) => state.settings.getZonesStatus);
    const zones = useSelector((state) => state.settings.getZones);
  
    const isLoading = zonesStatus === 'loading';
  
    useEffect(() => {
    if (!session || status !== "authenticated") {
    return;
    }
      const params = {};
      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getZones(params));
    }, [session, status]);
  
    function onPaginationLinkClicked(page) {
        if (!page || !session) {
            return;
        }
  
      const params = {};
      params['page'] = page;
      params["accessToken"] = session.user.accessToken;

      store.dispatch(getZones(params));
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
                                    <Title order={3}>Zones</Title>
                                </Stack>
                                <Link href="/areas/zones/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Zone</Button>
                                </Link>
                            </Flex>
                        <Paper p="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Zones</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Zone Name</th>
                                <th>Description</th>
                                <th>Created On</th>
                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {zones?.data?.map((item) => (
                            <tr key={item?.id}>
                            <td>{item?.name}</td>
                            <td>{item?.description ?? "-"}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            {/* <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td> */}
                            </tr>
                            ))}
                           
                            </tbody>
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={zones}
                                onLinkClicked={onPaginationLinkClicked}
                            />
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default List;
