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
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { getUnitTypes } from "@/store/settings/settings-slice";
import store from '@/store/store'
import { formatNumber } from "@/lib/shared/data-formatters"
import { useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function List() {
    const { data: session, status } = useSession();
    const router = useRouter();
    ///

    const unitTypes = useSelector((state) => state.settings.getUnitTypes);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;

        store.dispatch(getUnitTypes(params));
        console.log("Monyancha 2");
    }, [session, status]);

    console.log("Monyancha Unit Types", unitTypes);
    ///

    function onPaginationLinkClicked(page) {
        if (!page || !session) {
          return;
        }
    
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["page"] = page;
    
        store.dispatch(getUnitTypes(params));
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
                                    <Title order={3}>Unit Types</Title>
                                </Stack>
                                <Link href="/settings/unit-types/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Unit Type</Button>
                                </Link>
                            </Flex>
                        <Paper p="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Unit Types</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Created On</th>
                                {/* <th>Action</th> */}
                                </tr>
                            </thead>
                            <tbody>
                            {unitTypes?.data?.map((item) => (
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
                                paginatedData={unitTypes}
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
