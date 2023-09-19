import React, {useState} from 'react';
import Head from "next/head";
import {
    Anchor, Box,
    Breadcrumbs,
    Button,
    Container,
    FileButton,
    Grid,
    Group,
    Image,
    Paper, PaperProps,
    Stack,
    Text,
    Flex,
    Textarea,
    TextInput,
    Select,
    Title
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {useForm} from "@mantine/form";
import {IconArrowBack, IconCurrentLocation} from "@tabler/icons-react";
import {AppLayout} from "@/layout";
import {PageHeader} from "@/components";
import Link from 'next/link';

const ICON_SIZE = 18;

const PAPER_PROPS: PaperProps = {
    p: "md",
    shadow: "md",
    radius: "md",
    sx: {height: '100%'}
}

function CreateBusiness() {
    const [file, setFile] = useState<File | null>(null);


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
                                    <Title order={3}>Create Building</Title>
                                </Stack>
                                <Link href="/askaris/revenue/rentals">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Property Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Building Name"
                                    placeholder="Building 1"
                                    />
                                    
                                     <Select
                                    label="Landloard"
                                    placeholder="Select Building Owner"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Steve Owuor' },
                                        { value: '2', label: 'Enock Monyancha' },
                                        { value: '3', label: 'Timothy Karani' },
                                    ]}
                                    />

                                    <TextInput
                                        label="Total Units"
                                        placeholder="Rental Units No. Eg. 3"
                                    />
                                
                                    </Group>
                                    <Group grow>
                               
                                    <Select
                                    label="Building Type"
                                    placeholder="Select Type"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Apartment' },
                                        { value: '2', label: 'Commercial' },
                                        { value: '3', label: 'Flats' },
                                    ]}
                                    />
                                    
                                    <Select
                                    label="Building Zone"
                                    placeholder="Select Zone"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Zone 1' },
                                        { value: '2', label: 'Zone 2' },
                                        { value: '3', label: 'Zone 3' },
                                    ]}
                                    />
                                    
                                    </Group>
                                     <Group grow>
                                     <Select
                                    label="Building Location"
                                    placeholder="Select Location"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Location 1' },
                                        { value: '2', label: 'Location 2' },
                                        { value: '3', label: 'Location 3' },
                                    ]}
                                    />
                                    <Select
                                    label="Building Street"
                                    placeholder="Select Street"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Street 1' },
                                        { value: '2', label: 'Street 2' },
                                        { value: '3', label: 'Street 3' },
                                    ]}
                                    />
                                    <Button leftIcon={<IconCurrentLocation />} mt="xl" variant="outline">
                                    Pin Location
                                    </Button>
                                    
                                    </Group>
                                    {/* <Group grow>
                                    <TextInput
                                        label="Rent Amount"
                                        placeholder="Ksh. 5000"
                                    />
                                    <Select
                                    label="Payment Terms"
                                    placeholder="Select Payment Term"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Daily' },
                                        { value: '2', label: 'Monthly' },
                                        { value: '3', label: 'Quatery' },
                                        { value: '4', label: 'Semi-Annually' },
                                        { value: '4', label: 'Yearly' },
                                    ]}
                                    />
                                    <Select
                                    label="Status"
                                    placeholder="Select Status"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Free' },
                                        { value: '2', label: 'Occupied' },
                                        { value: '3', label: 'Reserved' },
                                    ]}
                                    />
                                </Group> */}
                                <Box sx={{width: 'auto'}}>
                                    <Button>Save</Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default CreateBusiness;
