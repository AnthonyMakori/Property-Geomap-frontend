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
                                    <Title order={3}>Add a new Owner</Title>
                                </Stack>
                                <Link href="/askaris/revenue/addother">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Owner Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Owner Name"
                                    placeholder="Owner Name"
                                    />
                                    <TextInput
                                    label="Owner Phone"
                                    placeholder="Owner Phone"
                                    />
                                    <TextInput
                                    label="Owner Phone"
                                    placeholder="Owner Phone"
                                    />
                                    </Group> 
                                   <Group grow>
                                <Select
                                    label="Owner Zone"
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
                                    label="Owner Location"
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
                                    label="Owner Street"
                                    placeholder="Select Street"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Street 1' },
                                        { value: '2', label: 'Street 2' },
                                        { value: '3', label: 'Street 3' },
                                    ]}
                                    />
                                    </Group>
                                     <Group grow>
                                    
                                    <Button leftIcon={<IconCurrentLocation />} mt="xl" variant="outline">
                                    Pin Location
                                    </Button>
                                    <Select
                                    label="Status"
                                    placeholder="Select Status"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Active' },
                                        { value: '2', label: 'Inactive' },
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
