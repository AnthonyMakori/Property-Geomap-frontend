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
                                    <Title order={3}>Create Parking</Title>
                                </Stack>
                                <Link href="/askaris/revenue/parking">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Parking Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Name"
                                    placeholder="Parking 1"
                                    />
                                <Select
                                    label="Parking Zone"
                                    placeholder="Select Zone"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Zone 1' },
                                        { value: '2', label: 'Zone 2' },
                                        { value: '3', label: 'Zone 3' },
                                    ]}
                                    />
                                    <Select
                                    label="Parking Location"
                                    placeholder="Select Location"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Location 1' },
                                        { value: '2', label: 'Location 2' },
                                        { value: '3', label: 'Location 3' },
                                    ]}
                                    />
                                    </Group>
                                     <Group grow>
                                    <Select
                                    label="Parking Street"
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
                                    <TextInput
                                        label="No. of Parking Slots"
                                        placeholder="Parking Slots No. Eg. 3"
                                    />
                                    </Group>
                                    <Group grow>
                                    <TextInput
                                        label="Parking Lane"
                                        placeholder="Tom Mboya"
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
                                </Group>
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
