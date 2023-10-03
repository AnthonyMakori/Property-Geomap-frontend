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
import { useEffect } from 'react';
import { showNotification } from '@mantine/notifications';
import { useRouter } from 'next/router';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CreateBusiness() {
    const router = useRouter();

    const buildingId = router.query?.buildingId ?? null;

    const [buildings, setBuildings] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [types, setTypes] = useState([]);

    const [name, setName] = useState('');
    const [building, setBuilding] = useState(buildingId);
    const [floor, setFloor] = useState('');
    const [tenant, setTenant] = useState('');
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');
    const [unit_type, setUnitType] = useState('');
    const [sqfoot, setSqFoot] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${API_URL}/buildings/index`);
    
                    if (response.ok) {
                        const result = await response.json();
                        setBuildings(result);
                        console.log("All buildings", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${API_URL}/users/tenants`);
    
                    if (response.ok) {
                        const result = await response.json();
                        setTenants(result);
                        console.log("All Tenants", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${API_URL}/units/unit-types`);
    
                    if (response.ok) {
                        const result = await response.json();
                        setTypes(result);
                        console.log("All", result);
                    } else {
                        console.log("Error: API request failed");
                    }
    
                } catch (e) {
                    console.log("Error ", e);
                }
            }
        )();
    }, []);

    console.log("Buildings kenya", buildings);

    const buildingsList =
    buildings?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const tenantsList =
    tenants?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const unitTypesList =
    types?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];


    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        if (!name) {
            showNotification({
                title: "Error",
                message: "Name is required!",
                color: "red",
            });
            return;
        }


        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/units/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    building_id: building,
                    name,
                    floor,
                    tenant_id: tenant,
                    code,
                    amount,
                    type: unit_type,
                    sqfoot,
                    status,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Unit created Successfully",
                color: "green",
            });

            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push(`/askaris/revenue/rentals/${buildingId}`);
        } catch (error) {
            setIsSubmitting(false);
            // Handle network errors or other errors here

            showNotification({
                title: "Error",
                message: "" + error,
                color: "red",
            });
        }
    }



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
                                <Link href={`/askaris/revenue/rentals/${buildingId}`}>
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow="md">
                            <Stack>
                                <Text size="md" fw={600}>Unit Details</Text>
                                <Group grow>
                                {!building &&(
                                <Select
                                    label="Select Building"
                                    placeholder="Select Building"
                                    searchable
                                    clearable
                                    onChange={setBuilding}
                                    data={ buildingsList }
                                />
                                )}
                                <TextInput
                                    label="Unit Name"
                                    placeholder="B12"
                                    onChange={e => setName(e.target.value)}
                                    />
                                    <TextInput
                                    label="Unit Code (Number)"
                                    placeholder="B013"
                                    onChange={e => setCode(e.target.value)}
                                    />
                                
                                    </Group>
                                    <Group grow>

                                    <TextInput
                                    label="Unit Floor"
                                    placeholder="4"
                                    onChange={e => setFloor(e.target.value)}
                                    />
                                    <TextInput
                                        label="Rent Amount"
                                        placeholder="Ksh. 5000"
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                    
                                    <Select
                                        label="Unit Type"
                                        placeholder="Select Unit Type"
                                        searchable
                                        clearable
                                        onChange={setUnitType}
                                        data={ unitTypesList }
                                    />
                                    
                                    </Group>

                                    <Group grow>
                                    <TextInput
                                        label="Square Foot"
                                        onChange={e => setSqFoot(e.target.value)}
                                        placeholder="100sq"
                                    />
                                    <Select
                                        label="Status"
                                        onChange={setStatus}
                                        placeholder="Select Status"
                                        searchable
                                        clearable
                                        data={[
                                            { value: 'Vacant', label: 'Vacant' },
                                            { value: 'Occupied', label: 'Occupied' },
                                            { value: 'Under Maintenance', label: 'Under Maintenance' },
                                        ]}
                                    />
                                    <Select
                                    label="Assign Tenant"
                                    placeholder="Assign Tenant"
                                    searchable
                                    onChange={setTenant}
                                    clearable
                                    data={ tenantsList }
                                    />
                                    </Group>

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting} > Create Unit </Button>
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
