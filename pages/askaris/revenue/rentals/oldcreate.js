import React, { useState } from 'react';
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
import { PATH_DASHBOARD } from "@/routes";
import { useForm } from "@mantine/form";
import { IconArrowBack, IconCurrentLocation } from "@tabler/icons-react";
import { AppLayout } from "@/layout";
import { PageHeader } from "@/components";
import Link from 'next/link';
import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useEffect } from 'react';
//
import { getZones, getStreets, getUnitTypes } from "@/store/settings/settings-slice";
import { useSelector } from 'react-redux';
import { useSession } from "next-auth/react";
import store from '@/store/store';
import { getOwners } from '@/store/users/users-slice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const placesLibrary = ["places"];

function CreateBusiness() {
    const { data: session, status } = useSession();
    const [location, setLocation] = useState("");
    const [types, setTypes] = useState([]);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        libraries: placesLibrary,
    });

    const [autocompleteRef, setAutocompleteRef] = useState("");

    const [category, setCategory] = useState('1');
    const [name, setName] = useState('');
    const [owner, setOwner] = useState('');
    const [units, setUnits] = useState('');
    const [type, setType] = useState('');
    const [zone, setZone] = useState('');
    const [street, setStreet] = useState('');
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');
    const [unit_type, setUnitType] = useState('');
    const [sqfoot, setSqFoot] = useState('');
    const [unitStatus, setUnitStatus] = useState('');

    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    ///
    const zones = useSelector((state) => state.settings.getZones);
  
    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
      const params = {};

      params["accessToken"] = session.user.accessToken;
  
      store.dispatch(getZones(params));
    }, [session]);

    console.log("Anthony Zones", zones);
    ///

    ///
    const owners = useSelector((state) => state.users.getOwners);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
    
        store.dispatch(getOwners(params));
    }, [session]);

    console.log("Anthony Owners", owners);
    ///

    ///
    const streets = useSelector((state) => state.settings.getStreets);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
    
        store.dispatch(getStreets(params));
    }, [session]);

    console.log("Anthony Streets", streets);
    ///

    ///
    const unitTypes = useSelector((state) => state.settings.getUnitTypes);

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;
    
        store.dispatch(getUnitTypes(params));
    }, [session]);

    console.log("Anthony Unit Types", unitTypes);
    ///
    

    const submit = async (e) => {
        e.preventDefault();

        if (!category) {
            showNotification({
                title: "Error",
                message: "Category is required!",
                color: "red",
            });
            return;
        }

        if (!name) {
            showNotification({
                title: "Error",
                message: "Name is required!",
                color: "red",
            });
            return;
        }


        setIsSubmitting(true);

        const accessToken = session.user.accessToken;

        try {
            const response = await fetch(`${API_URL}/buildings/store`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken} `,
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category,
                    name,
                    units,
                    owner,
                    location,
                    zone,
                    street,
                    code,
                    amount,
                    unit_type,
                    sqfoot,
                    status: unitStatus,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Building created Successfully",
                color: "green",
            });

            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push('/askaris/revenue/rentals');
        } catch (error) {
            setIsSubmitting(false);
            // Handle network errors or other errors here

            showNotification({
                title: "Error",
                message: "" + error,
                color: "red",
            });

            console.error('Error during login:', error);
        }
    }


    const ownersList =
    owners?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const zonesList =
    zones?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];


    const streetsList =
    streets?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const unitTypesList =
    unitTypes?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    return (
        <>
            <AppLayout>
                <Container fluid>
                    <Stack spacing="lg">
                        <Flex
                            align="center"
                            justify="space-between"
                            direction={{ base: 'row', sm: 'row' }}
                            gap={{ base: 'sm', sm: 4 }}
                        >
                            <Stack>
                                <Title order={3}>Create Building</Title>
                            </Stack>
                            <Link href="/askaris/revenue/rentals">
                                <Button leftIcon={<IconArrowBack size={18} />} size='xs' variant='outline'>Back</Button>
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
                                        onChange={setCategory}
                                        defaultValue={category}
                                        clearable
                                        data={[
                                            { value: 'Apartment', label: 'Apartment' },
                                            { value: 'Standalone', label: 'Standalone' },
                                            { value: 'Commercial', label: 'Commercial' },
                                        ]}
                                    />

                                    <   TextInput
                                        label="Building Name"
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Building 1"
                                    />

                                    <Select
                                        label="Landloard"
                                        placeholder="Select Building Owner"
                                        searchable
                                        onChange={setOwner}
                                        clearable
                                        data={ ownersList }
                                    />

                                </Group>
                                <Group grow>


                                    <TextInput
                                        label="Total Units"
                                        onChange={e => setUnits(e.target.value)}
                                        placeholder="Total Units No. Eg. 3"
                                    />
                                    <Select
                                        label="Building Zone"
                                        placeholder="Select Zone"
                                        onChange={setZone}
                                        searchable
                                        clearable
                                        data={zonesList}
                                    />

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

                                </Group>
                                <Group grow>
                                    
                                    <Select
                                        label="Building Street"
                                        placeholder="Select Street"
                                        searchable
                                        clearable
                                        onChange={setStreet}
                                        data={streetsList}
                                    />
                                    <TextInput
                                        label="Rent Amount"
                                        placeholder="Ksh. 5000"
                                        onChange={e => setAmount(e.target.value)}
                                    />

                                </Group>

                                <Group grow>
                                    
                                    <Select
                                        label="Unit Type"
                                        placeholder="Select Unit Type"
                                        searchable
                                        clearable
                                        onChange={setUnitType}
                                        data={ unitTypesList }
                                    />
                                    <TextInput
                                        label="Square Foot"
                                        onChange={e => setSqFoot(e.target.value)}
                                        placeholder="100sq"
                                    />
                                    <Select
                                        label="Status"
                                        onChange={setUnitStatus}
                                        placeholder="Select Status"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Vacant', label: 'Vacant' },
                                            { value: 'Occupied', label: 'Occupied' },
                                            { value: 'Under Maintenance', label: 'Under Maintenance' },
                                        ]}
                                    />
                                </Group>

                                <Box sx={{ width: 'auto' }}>
                                    <Button onClick={submit} loading={isSubmitting}>Create Building</Button>
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
