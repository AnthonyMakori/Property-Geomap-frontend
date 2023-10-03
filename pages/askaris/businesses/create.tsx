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
                                    <Title order={3}>Create Business</Title>
                                </Stack>
                                <Link href="/askaris/businesses">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper {...PAPER_PROPS}>
                            <Stack>
                                <Text size="md" fw={600}>Business Details</Text>
                                <Group grow>
                                    <TextInput
                                        label="Business Name"
                                        placeholder="Ilovalue Innovations"
                                    />
                                    <Select
                                    label="Business Owner"
                                    placeholder="Select Owner"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Benson Njumbi' },
                                        { value: '2', label: 'Enock Monyancha' },
                                    ]}
                                    />
                                    <Button variant='outline' mt="xl">New Owner</Button>
                                </Group>
                                <Group grow>
                                <TextInput
                                    label="Business Email"
                                    placeholder="info@ilovalue.com"
                                />
                                <TextInput
                                    label="Business Phone Number"
                                    placeholder="0799117020" 
                                />
                                </Group>
                                <Select
                                    label="Business Category"
                                    placeholder="Select Category"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Businesses and Licences' },
                                        { value: '2', label: 'Outdoor Advertising' },
                                        { value: '3', label: 'Properties and land rates' },
                                        { value: '4', label: 'Property Rent' },
                                        { value: '5', label: 'Hire of county assets' },
                                        { value: '6', label: 'Public health - service fee' },
                                        { value: '7', label: 'Fire license and permits' },
                                        { value: '8', label: 'Market fees / sales / royalties' },
                                        { value: '9', label: 'Liquor licenses' },
                                        { value: '10', label: 'Physical planning and development' },
                                    ]}
                                    />
                                <Group grow>
                                <Select
                                    label="Business Zone"
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
                                    label="Business Location"
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
                                    label="Business Street"
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
                                    <Select
                                    label="Business Building"
                                    placeholder="Select Building"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Building 1' },
                                        { value: '2', label: 'Building 2' },
                                        { value: '3', label: 'Building 3' },
                                    ]}
                                    />
                                    <Select
                                    label="Business Floor"
                                    placeholder="Select Floor"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '1', label: 'Floor 1' },
                                        { value: '2', label: 'Floor 2' },
                                        { value: '3', label: 'Floor 3' },
                                    ]}
                                    />
                                    <TextInput
                                        label="Room No."
                                        placeholder="Room No. Eg. 3"
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
