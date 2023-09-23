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


function List() {
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/users/tenants');
    
                    if (response.ok) {
                        const result = await response.json();
                        setTenants(result);
                        console.log("All", result);
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
                                    <Title order={3}>Tenants</Title>
                                </Stack>
                                <Link href="/askaris/tenants/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Tenant</Button>
                                </Link>
                            </Flex>
                        <Paper  p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Tenants</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Phone No.</th>
                                <th>Email</th>
                                <th>National ID No.</th>
                                <th>Gender</th>
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tenants?.data?.map((item) => (
                            <tr >
                            <td>{item?.code}</td>
                            <td>{item?.name ?? "-"}</td>
                            <td>{item?.phone ?? "-"}</td>
                            <td>{item?.email ?? '-'}</td>
                            <td>{item?.nid ?? '-'}</td>
                            <td>{item?.gender ?? '-'}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                                <Link href="/askaris/tenants/1">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            ))}
                           
                            </tbody>
                            </Table>
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
