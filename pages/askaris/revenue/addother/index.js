import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text, Badge, Menu} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconChevronDown, IconEdit, IconEye, IconPencil, IconPlus, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '../../../../components/Pagination/pagination-links';
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getUnits } from "@/store/properties/buildings/buildings-slice";
//////////
import { useSession } from "next-auth/react";

function List() {
    const { data: session, status } = useSession();

    const unitsStatus = useSelector(
        (state) => state.buildings.getUnitsStatus
      );
      const units = useSelector(
        (state) => state.buildings.getUnits
      );
    
      const isLoading = unitsStatus === "loading";
    
      useEffect(() => {  
        if (!session || status !== "authenticated") {
        return;
        }

        const params = {};
        params["accessToken"] = session.user.accessToken;

        store.dispatch(getUnits(params));
      }, [session, status]);
    
      console.log("Units data Anthony", units);

      function onPaginationLinkClicked(page) {
        if (!page || !session) {
            return;
        }
    
        const params = {};
        params["accessToken"] = session.user.accessToken;
        params["page"] = page;
    
        store.dispatch(getUnits(params));
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
                                    <Title order={3}>All Units</Title>
                                </Stack>
                                {/* <Link href="/askaris/revenue/addother/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Unit</Button>
                                </Link> */}
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>All Units</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <div id="responsive-table">
                            <Table>
                            <thead>
                                <tr>   
                                <th>Code</th>                            
                                <th>Name</th>
                                {/* <th>Unit Code</th> */}
                                <th>Building</th>
                                <th>Rent</th>
                                <th>Commission(%)</th>
                                <th>Tenant</th>
                                <th>Type</th>
                                {/* <th>Square Foot</th> */}
                                <th>Status</th>                               
                                <th>Date</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {units?.data?.map((item) => (
                            <tr key={item?.id}>
                            <td>{item?.code ?? "-"}</td>
                            <td>{item?.name}</td>
                            {/* <td>{item?.code ?? "-"}</td> */}
                            <td>{item?.building?.name}</td>
                            <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>{item?.commission ?? "0"}%</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>{item?.type?.name ?? "-"}</td>
                            {/* <td>{item?.sqfoot ?? "-"}</td> */}
                            <td>
                            {item?.unit_status >= 1 
                            ? <Badge color="blue" variant="filled" radius="sm">Occupied</Badge> 
                            : <Badge color="orange" variant="filled" radius="sm">Vacant</Badge>
                            }
                            </td>
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
                                    <Link href={`/askaris/revenue/addother/${item?.id}`}>
                                        <Menu.Item
                                        color="blue"
                                        icon={<IconEye size={15} />}
                                        >
                                        View
                                        </Menu.Item>
                                    </Link>

                                    <Link
                                        href={`/askaris/revenue/addother/${item?.id}`}
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
                                paginatedData={units}
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
