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
                                    <Title order={3}>Add Tenant</Title>
                                </Stack>
                                <Link href="/askaris/tenants">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Tenant Details</Text>
                                <Group grow>
                                <Select
                                    label="Tenant Type"
                                    placeholder="Select Type"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Individual' },
                                        { value: '2', label: 'Family' },
                                        { value: '3', label: 'Business' },
                                    ]}
                                    />
                                <TextInput
                                    label="Tenant Name"
                                    placeholder="Tenant Name"
                                    />
                                    <TextInput
                                    label="Tenant Phone"
                                    placeholder="Tenant Phone"
                                    />
                                    
                                    </Group> 
                                    <Group grow>
                                    <TextInput
                                    label="Tenant Email"
                                    placeholder="Tenant Email"
                                    />
                                     <TextInput
                                    label="Tenant ID Number"
                                    placeholder="Tenant ID Number"
                                    />
                                <Select
                                    label="Gender"
                                    placeholder="Select Gender"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Male' },
                                        { value: '2', label: 'Female' },
                                    ]}
                                    />
                               
                                    
                                    </Group> 
                                   <Group grow>
                                   <Select
                                    label="Marital Status"
                                    placeholder="Select Marital Status"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Single' },
                                        { value: '2', label: 'Married' },
                                        { value: '3', label: 'Divorced' },
                                    ]}
                                    />
                                    <Select
                                    label="Tenant Location"
                                    placeholder="Select Location"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Location 1' },
                                        { value: '2', label: 'Location 2' },
                                        { value: '3', label: 'Location 3' },
                                    ]}
                                    />

                                    <TextInput
                                    label="Password"
                                    placeholder="Password"
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
