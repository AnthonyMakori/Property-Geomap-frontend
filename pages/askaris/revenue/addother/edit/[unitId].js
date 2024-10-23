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
import { useSession } from "next-auth/react";
//
import { getUnitTypes } from "@/store/settings/settings-slice";
import { useSelector } from 'react-redux';
import store from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function EditUnit() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const buildingId = router.query?.buildingId ?? null;

    const [types, setTypes] = useState([]);

    const [name, setName] = useState('');
    const [building, setBuilding] = useState(buildingId);
    const [floor, setFloor] = useState('');
    const [tenant, setTenant] = useState('');
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');
    const [unit_type, setUnitType] = useState('');
    const [sqfoot, setSqFoot] = useState('');
    const [unitStatus, setUnitStatus] = useState('Vacant');

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

    const unitTypesList =
    unitTypes?.data?.map((item) => ({
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

        const accessToken = session.user.accessToken;

        try {
            const response = await fetch(`${API_URL}/units/store`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken} `,
                    Accept: "application/json",
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
                    status: unitStatus,
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
                                    </Group>

                                    <Group grow>
                                    <TextInput
                                        label="Agent Commission (%)"
                                        placeholder="Agent Commission (%)"
                                        />
                                    </Group>

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting} > Edit Unit </Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default EditUnit;
