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
    const accountForm = useForm({
        initialValues: {
            username: 'kelvinkiprop',
            biograghy: 'I\'m a software engineering graduate with a passion for transforming ideas into simple applications. I love experimenting with new technologies. Right now, I\'m working on building and shipping business automation solutions at Alternate Limited.\n',
        },
    });
    const accountInfoForm = useForm({
        initialValues: {
            firstname: 'kelvin',
            lastname: 'kiprop',
            email: 'kelvin.kiprop96@gmail.com',
            address: '',
            apartment: '',
            city: '',
            state: '',
            zip: ''
        },
    });

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
                                    <Title order={3}>Create Land Rate</Title>
                                </Stack>
                                <Link href="/askaris/revenue/landrates">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Land Rate Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Plot No."
                                    placeholder="Plot 123"
                                    />
                                <Select
                                    label="Zone"
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
                                    label="Location"
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
                                    label="Land Owner"
                                    placeholder="Select Owner"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Steve Owuor' },
                                        { value: '2', label: 'Enock Monyancha' },
                                    ]}
                                    />
                                    <Select
                                    label="Street"
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
                                    <Group grow>
                                    <TextInput
                                        label="Plot Size"
                                        placeholder="50x100"
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
