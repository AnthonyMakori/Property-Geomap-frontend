import React, {useState, useEffect} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus} from "@tabler/icons-react";
import Link from 'next/link';
import PaginationLinks from '../../../components/Pagination/pagination-links';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function List() {

    const [owners, setOwners] = useState([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${API_URL}/users/owners`);
    
                    if (response.ok) {
                        const result = await response.json();
                        setOwners(result);
                        console.log("All Owners", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    
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
                                    <Title order={3}>Landloards</Title>
                                </Stack>
                                <Link href="/askaris/owners/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Landloard</Button>
                                </Link>
                            </Flex>
                        <Paper p="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Landloards</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>ID No.</th>
                                <th>KRA PIN</th>
                                <th>Date</th>
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
                                <Link href="/askaris/owners/1">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                {/* <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                             */}
                            </td>
                            </tr>
                            ))}
                            
                            </tbody>
                            </Table>
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
