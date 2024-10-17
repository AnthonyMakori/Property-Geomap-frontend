import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPencil, IconPlus, IconReport, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import PaginationLinks from '@/components/Pagination/pagination-links';
import { getOwners } from '@/store/users/users-slice';
import { useSession } from "next-auth/react";
import { useSelector } from 'react-redux';
import store from '@/store/store'


const API_URL = process.env.NEXT_PUBLIC_API_URL;

function List() {
    const { data: session, status } = useSession();

    ///
    const owners = useSelector((state) => state.users.getOwners);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(getOwners(params));

    }, [session, status]);

    ///

    function onPaginationLinkClicked(page) {
        if (!page || !session) {
          return;
        }
    
        const params = {};
        params["accessToken"] = session?.user?.accessToken;
        params['page'] = page;

        store.dispatch(getOwners(params));
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
                                    <Title order={3}>Landlords</Title>
                                </Stack>
                                <Link href="/askaris/owners/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Landlord</Button>
                                </Link>
                            </Flex>
                        <Paper p="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Landlords</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>ID No.</th>
                                <th>KRA PIN</th>
                                <th>Date</th>
                                <th>Basic</th>
                                <th>Statement</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {owners?.data?.map((item) => (
                            <tr key={item?.id}>
                            <td>{item?.name}</td>
                            <td>{item?.phone ?? '-'}</td>
                            <td>{item?.email ?? '-'}</td>
                            <td>{item?.nid ?? '-'}</td>
                            <td>{item?.kra ?? '-'}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                            <Link href={`/reports/basic-statement/${item?.id}`}>
                                <Button size='xs' mr="xs" variant='outline' >Basic</Button>
                            </Link>
                            </td>
                            <td>
                            <Link href={`/reports/landlord-statement/${item?.id}`}>
                                <Button size='xs' mr="xs" variant='outline' >Statement</Button>
                            </Link>
                            </td>
                            <td>
                            
                                <Menu
                                    shadow="md"
                                    width={200}
                                    position="bottom-end"
                                    variant="outline"
                                >
                                    <Menu.Target>
                                    <Button
                                        rightIcon={<IconChevronDown size={14} />}
                                        size="xs"
                                    >
                                        Actions
                                    </Button>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                    <Menu.Label>#{item?.id}</Menu.Label>
                                    <Link href={`/askaris/owners/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link>

                                    <Link
                                        href={`/askaris/owners/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link>
                                    <Menu.Item
                                        icon={<IconTrash size={15} />}
                                        // onClick={() => {
                                        // setDeleteModalOpen(true);
                                        // setCurrentStaff(item);
                                        // }}
                                        color="red"
                                    >
                                        Delete
                                    </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </td>
                            </tr>
                            ))}
                            
                            </tbody>
                            </Table>
                            </div>
                            <PaginationLinks
                                paginatedData={owners}
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
