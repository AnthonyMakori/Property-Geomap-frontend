import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPencil, IconPlus, IconPrinter, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import PaginationLinks from '@/components/Pagination/pagination-links';
import { useSession } from "next-auth/react";
import { getTenants } from '@/store/users/users-slice';
import { useSelector } from 'react-redux';
import store from '@/store/store'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function List() {
    const { data: session, status } = useSession();

    ///
    const tenants = useSelector((state) => state.users.getTenants);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;

        store.dispatch(getTenants(params));

    }, [session, status]);

    ///

    function onPaginationLinkClicked(page) {
        if (!page || !session) {
          return;
        }
    
        const params = {};
        params["accessToken"] = session?.user?.accessToken;
        params['page'] = page;

        store.dispatch(getTenants(params));
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
                                    <Title order={3}>Clients</Title>
                                </Stack>
                                <Link href="/askaris/tenants/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Client</Button>
                                </Link>
                            </Flex>
                        <Paper  p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Clients</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>
                                {/* <th>Code</th> */}
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>ID No.</th>
                                <th>Gender</th>
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tenants?.data?.map((item) => (
                            <tr key={item?.id}>
                            {/* <td>{item?.code}</td> */}
                            <td>{item?.name ?? "-"}</td>
                            <td>{item?.phone ?? "-"}</td>
                            <td>{item?.email ?? '-'}</td>
                            <td>{item?.nid ?? '-'}</td>
                            <td>{item?.gender ?? '-'}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
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
                                    <Link href={`/askaris/tenants/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link>
                                    <Link
                                        href={`/askaris/tenants/${item?.id}`}
                                    >
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPencil size={15} />}
                                        >
                                        Edit
                                        </Menu.Item>
                                    </Link>
                                    <Link href={`/askaris/tenants/statement?clientId=${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconPrinter size={15} />}
                                        >
                                        Statement
                                        </Menu.Item>
                                    </Link>
                                    <Menu.Item
                                        icon={<IconTrash size={15} />}
                                         onClick={() => {
                                         setDeleteModalOpen(true);
                                         setCurrentStaff(item);
                                         }}
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
                                paginatedData={tenants}
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
