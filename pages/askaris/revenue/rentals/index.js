import React, {SyntheticEvent, useState} from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus, IconTrash} from "@tabler/icons-react";
import Link from 'next/link';
import { useEffect } from 'react';
import PaginationLinks from '../../../../components/Pagination/pagination-links';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PAGE_SIZE = 10;

function List() {

    const [message, setMessage] = useState('');
    const [auth, setAuth] = useState(false);

    const [buildings, setBuildings] = useState([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/buildings/index');
    
                    if (response.ok) {
                        const result = await response.json();
                        setBuildings(result);
                        console.log("All buildings", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    console.log("Buildings kenya", buildings);

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
                                    <Title order={3}>Buildings {message}</Title>
                                </Stack>
                                <Link href="/askaris/revenue/rentals/create">
                                <Button leftIcon={<IconPlus size={18}/>}>New Building</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Buildings</Text>
                                <Input placeholder="Search" />
                            </Group>

                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Owner</th>
                                <th>Total Units</th>
                                <th>Zone</th>
                                <th>Location</th>
                                <th>Street Address</th>
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {buildings?.data?.map((item) => (
                            <tr >
                            <td>{ item?.name }</td>
                            <td>{ item?.type ?? '-' }</td>
                            <td>{item?.owner?.name ?? "-"}</td>
                            <td>{item?.units ?? "-"}</td>
                            <td>{item?.zone?.name ?? "-"}</td>
                            <td>{item?.location ?? "-"}</td>
                            <td>{item?.street?.name ?? "-"}</td>
                            <td>{new Date(item?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td>
                                <Link href="/askaris/revenue/rentals/1">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>    
                                {/* <ActionIcon variant="filled" color='red' aria-label="Settings">
                                    <IconTrash />
                                </ActionIcon>                         */}
                            </td>
                            </tr>
                             ))}

                            
                           
                            </tbody>
                            
                            </Table>
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

export default List;
