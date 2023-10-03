import React from 'react';
import Head from "next/head";
import {ActionIcon, Table, Container, Group, Title, Input, Select, Button, Space, Flex, Paper, PaperProps, Stack, Text} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {InvoicesTable, PageHeader} from "@/components";
import InvoicesData from "@/mocks/Invoices.json";
import {AppLayout} from "@/layout";
import {IconEdit, IconEye, IconPlus} from "@tabler/icons-react";
import Link from 'next/link';

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
}

function List() {
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
                                    <Title order={3}>Businesses</Title>
                                </Stack>
                                <Link href="/askaris/businesses/create">
                                <Button leftIcon={<IconPlus size={18}/>}>New Business</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Businesses</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Owner</th>
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Business 1</td>
                            <td>Test Category</td>
                            <td>Benson Njumbi</td>
                            <td>01/09/2023</td>
                            <td>
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            </tbody>
                            </Table>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default List;
