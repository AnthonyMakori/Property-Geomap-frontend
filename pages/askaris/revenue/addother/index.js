import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '../../../../components/Pagination/pagination-links';

function List() {
    const [units, setUnits] = useState([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/units/index');
    
                    if (response.ok) {
                        const result = await response.json();
                        setUnits(result);
                        console.log("All Units", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    console.log("Buildings kenya", units);

    
    function onPaginationLinkClicked(page) {
        if (!page) {
          return;
        }

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
                                    <Title order={3}>Manage Units</Title>
                                </Stack>
                                <Link href="/askaris/revenue/addother/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Unit</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Manage Units</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>                               
                                <th>Unit Name</th>
                                <th>Unit Code</th>
                                <th>Building</th>
                                <th>Rent Amount</th>
                                <th>Tenant</th>
                                <th>Type</th>
                                <th>Square Foot</th>
                                <th>Status</th>                               
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {units?.data?.map((item) => (
                            <tr >
                            <td>{item?.name}</td>
                            <td>{item?.code ?? "-"}</td>
                            <td>{item?.building?.name}</td>
                            <td>Ksh. {item?.amount ?? "0"}</td>
                            <td>{item?.tenant?.name ?? "-"}</td>
                            <td>{item?.type ?? "-"}</td>
                            <td>{item?.sqfoot ?? "-"}</td>
                            <td>{item?.status ?? "Vacant"}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                                <Link href="/askaris/revenue/addother/1">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            ))}
                           
                            </tbody>
                            </Table>
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
