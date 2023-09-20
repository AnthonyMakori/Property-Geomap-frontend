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
import { Autocomplete, useLoadScript } from "@react-google-maps/api";

const placesLibrary = ["places"];

const ICON_SIZE = 18;



function CreateBusiness() {
    const [location, setLocation] = useState("");

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        libraries: placesLibrary,
      });
    
      const [autocompleteRef, setAutocompleteRef] = useState("");

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
                        <Paper p="md">
                            <Stack>
                                <Text size="md" fw={600}>Property Details</Text>
                                <Group grow>
                                <Select
                                    label="Property Category"
                                    placeholder="Select Property Category"
                                    searchable
                                    clearable
                                    data={[
                                        { value: '2', label: 'Flats' },
                                        { value: '1', label: 'Standalone' },
                                    ]}
                                    />

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
                                        placeholder="Total Units No. Eg. 3"
                                    />

                                    <TextInput
                                        label="Total Standalone"
                                        placeholder="Total Standalone No. Eg. 3"
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
                                     {isLoaded && (
                                        <Autocomplete
                                        onPlaceChanged={() => {
                                            setLocation(autocompleteRef?.getPlace()?.formatted_address);
                                        }}
                                        onLoad={(autocomplete) => {
                                            setAutocompleteRef(autocomplete);
                                        }}
                                        >
                                        <TextInput
                                            label="Location"
                                            placeholder="Location"
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        </Autocomplete>
                                    )}
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
                                    
                                    </Group>
                                    <Group grow>
                                    <TextInput
                                    label="Unit Code (Number)"
                                    placeholder="B013"
                                    />
                                    <TextInput
                                        label="Rent Amount"
                                        placeholder="Ksh. 5000"
                                    />
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
