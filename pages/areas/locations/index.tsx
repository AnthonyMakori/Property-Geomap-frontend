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
                                    <Title order={3}>Locations</Title>
                                </Stack>
                                <Link href="/areas/locations/create">
                                <Button leftIcon={<IconPlus size={18}/>}>Add Locations</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Group position="apart" mb="md">
                                <Text fz="lg" fw={600}>Locations</Text>
                                <Input placeholder="Search" />
                            </Group>
                            <Table>
                            <thead>
                                <tr>
                                <th>Location Name</th>
                                <th>Description</th>
                                <th>Created On</th>
                                <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
                            <td>01/09/2023</td>
                            <td>
                                <Link href="#">
                                <Button leftIcon={<IconEye size="1rem" />} variant='outline' mr="md" size='xs'> View </Button>
                                </Link>
                                <Button leftIcon={<IconEdit size="1rem" />} variant='outline' size='xs'> Edit </Button>                            
                            </td>
                            </tr>
                            <tr >
                            <td>Location 1</td>
                            <td>Test Description</td>
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
