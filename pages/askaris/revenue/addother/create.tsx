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
                                    <Title order={3}>Add a Unit</Title>
                                </Stack>
                                <Link href="/askaris/revenue/addother">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Unit Details</Text>
                                <Group grow>
                                <Select
                                    label="Select Building"
                                    placeholder="Select Building"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '4', label: 'Building 1' },
                                        { value: '1', label: 'Building 2' },
                                        { value: '2', label: 'Building 3' },
                                        { value: '3', label: 'Building 4' },

                                    ]}
                                    />
                                <TextInput
                                    label="Unit Name"
                                    placeholder="B12"
                                    />
                                    <TextInput
                                    label="Unit Code (Number)"
                                    placeholder="B013"
                                    />
                                <TextInput
                                    label="Unit Floor"
                                    placeholder="4"
                                    />
                                    <TextInput
                                    label="Rent Amount"
                                    placeholder="Ksh. 20,000"
                                    />
                                    </Group>
                                    <Group grow>
                                    
                                    <Select
                                    label="Unit Type"
                                    placeholder="Select Unit Type"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '4', label: 'Studio' },
                                        { value: '1', label: 'One Bedroom' },
                                        { value: '2', label: 'Two Bedroom' },
                                        { value: '3', label: 'Bedsitter' },
                                        
                                        { value: '5', label: 'Villa' },
                                    ]}
                                    />
                                    <TextInput
                                    label="Square Foot"
                                    placeholder="100sq"
                                    />
                                    <Select
                                    label="Status"
                                    placeholder="Select Status"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '4', label: 'Vacant' },
                                        { value: '1', label: 'Occupied' },
                                        { value: '2', label: 'Under Maintenance' },
                                    ]}
                                    />
                                    <Select
                                    label="Assign Tenant"
                                    placeholder="Assign Tenant"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '4', label: 'Tenant 1' },
                                        { value: '1', label: 'Tenant 2' },
                                        { value: '2', label: 'Tenant 3' },
                                        { value: '3', label: 'Tenant 4' },
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
