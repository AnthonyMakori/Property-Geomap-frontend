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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const placesLibrary = ["places"];

function EditBuilding() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const buildingId = router.query?.buildingId ?? null;

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
        libraries: placesLibrary,
    });

    const [autocompleteRef, setAutocompleteRef] = useState("");

    const [category, setCategory] = useState('1');
    const [name, setName] = useState('');
    const [units, setUnits] = useState('');
    const [zone, setZone] = useState('');
    const [street, setStreet] = useState('');
    const [location, setLocation] = useState("");

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

    console.log("Monyancha Zones", zones);
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
            const response = await fetch(`${API_URL}/buildings/update`, {
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
                    location,
                    zone,
                    street,
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
                                <Title order={3}>Edit Building</Title>
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
                                        onChange={setStreet}
                                        data={streetsList}
                                    />


                                </Group>

                                <Box sx={{ width: 'auto' }}>
                                    <Button onClick={submit} loading={isSubmitting}>Edit Building</Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default EditBuilding;
