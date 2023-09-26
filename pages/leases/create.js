/* eslint-disable react-hooks/exhaustive-deps */
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
import store from '@/store/store'
import { useSelector } from "react-redux";
import { getBuildings, getUnits } from "@/store/properties/buildings/buildings-slice";
import { getTenants } from "@/store/users/users-slice";
import { debounce } from 'lodash'; // Import debounce from lodash
import { DateInput } from '@mantine/dates';
import { formatNumber } from '@/lib/shared/data-formatters';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function CreateBusiness() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [penalty, setPenalty] = useState('');
    const [building, setBuilding] = useState('');
    const [unit, setUnit] = useState('');
    const [deposit, setDeposit] = useState(0);
    const [tenant, setTenant] = useState('');
    const [generateOn, setGenerateOn] = useState('');
    const [amount, setAmount] = useState(0);
    const [serviceFee, setServiceFee] = useState(0);
    const [processingFee, setProcessingFee] = useState(0);
    const [gracePeriod, setGracePeriod] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [dueOn, setDueOn] = useState('');

    // Format the startDate in the desired format for MySQL
    const formattedStartDate = format(new Date(startDate), 'yyyy-MM-dd HH:mm:ss');

    console.log("Buidling Id", building);

    // Calculate Total
    const total = parseFloat(amount) + parseFloat(serviceFee) + parseFloat(processingFee) + parseFloat(deposit);
    // End Calculate Total


    //Get Buildings
    const buildings = useSelector((state) => state.buildings.getBuildings);

    useEffect(() => {
      const params = {};

      store.dispatch(getBuildings(params));
    }, []);

    //End Get Buildings

    //Get Units
    const units = useSelector((state) => state.buildings.getUnits);

    useEffect(() => {
        if(building) {
            const params = {};
            params['buildingId'] = building;

            store.dispatch(getUnits(params));
        }
        
    }, [building]);

    //End Get Units

    //Get Units
    const tenants = useSelector((state) => state.users.getTenants);

    useEffect(() => {
        const params = {};

        store.dispatch(getTenants(params));
    }, []);

    //End Get Units


    const buildingsList =
    buildings?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const unitsList =
    units?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];

    const tenantsList =
    tenants?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) ?? [];


    const submit = async (e) => {
        e.preventDefault();

        if (!building) {
            showNotification({
                title: "Error",
                message: "Select a Building first!",
                color: "red",
            });
            return;
        }


        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/leases/store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    building_id: building,
                    unit_id: unit,
                    tenant_id: tenant,
                    amount: amount,
                    start_date: formattedStartDate,
                    due: dueOn,
                    deposit: deposit,
                    processing_fee: processingFee,
                    service_fee: serviceFee,
                    penalty: penalty,
                    grace_period: gracePeriod,
                    generate_on: generateOn,
                    total: total,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed : ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Lease created Successfully",
                color: "green",
            });

            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push('/leases');
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


    // Handle unit selection change
    const handleUnitChange = (selectedUnit) => {
        setUnit(selectedUnit);

        // Find the selected unit in the unitsList and update the rent amount
        const selectedUnitData = units?.data?.find((unitData) => unitData.id === selectedUnit);

        if (selectedUnitData) {
            setAmount(selectedUnitData.amount); // Assuming amount is the property name for the rent amount in your data
        } else {
            setAmount(0); // If the unit is not found or rentAmount is not available, set the amount to 0
        }
    };

    useEffect(() => {
        // Initialize the rent amount based on the selected unit when the component is loaded
        handleUnitChange(unit);
    }, [unit]);

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
                                    <Title order={3}>Add a Lease</Title>
                                </Stack>
                                <Link href="/leases">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow="md">
                            <Stack>
                            <Flex
                                justify="space-between"
                                direction={{base: 'row', sm: 'row'}}
                                gap={{base: 'sm', sm: 4}}
                            >
                                <Stack>
                                <Text size="md" fw={600}>Lease Details</Text>
                                </Stack>
                                <Text size="md" fw={600}>Total: Ksh. {total ?? 0}</Text>
                            </Flex>
                                
                                <Group grow>
                            <Select
                                label="Select Building"
                                placeholder="Select Building"
                                searchable
                                clearable
                                value={building}
                                onChange={(selectedBuilding) => {
                                    setBuilding(selectedBuilding);
                                    // Clear the selected unit when the building changes
                                    setUnit('');
                                    setAmount(0);
                                }}
                                data={buildingsList}
                            />
                            <Select
                                label="Select Unit"
                                placeholder="Select Unit"
                                searchable
                                clearable
                                value={unit}
                                onChange={handleUnitChange} // Use the handleUnitChange function
                                data={unitsList}
                            />
                            <Select
                                label="Assign Tenant"
                                placeholder="Select Tenant"
                                searchable
                                clearable
                                value={tenant}
                                onChange={(selectedTenant) => setTenant(selectedTenant)}
                                data={tenantsList}
                            />
                        </Group>
                                    <Group grow>

                                    <TextInput
                                        label="Rent Amount"
                                        placeholder="Ksh. 50000"
                                        defaultValue={ amount }
                                        onChange={e => setAmount(e.target.value)}
                                    />

                                    <DateInput
                                        value={startDate}
                                        onChange={setStartDate}
                                        label="Start Date"
                                        placeholder="Start Date"
                                        />
                              
                                    <Select
                                        label="Due On (Day of every Month)"
                                        onChange={setDueOn}
                                        placeholder="Select Day"
                                        searchable
                                        clearable
                                        data={Array.from({ length: 31 }, (_, index) => ({
                                            value: (index + 1).toString(),
                                            label: (index + 1).toString(),
                                        }))}
                                        />

                                    </Group>

                                    <Group grow>
                                    <TextInput
                                        label="Rent Deposit Amount"
                                        onChange={e => setDeposit(e.target.value)}
                                        placeholder="Eg. 50000"
                                    />
                                    <TextInput
                                        label="Processing Fee"
                                        onChange={e => setProcessingFee(e.target.value)}
                                        placeholder="Eg. 1000"
                                    />
                                    <TextInput
                                        label="Service Fee"
                                        onChange={e => setServiceFee(e.target.value)}
                                        placeholder="Eg. 5000"
                                    />
                                    </Group>

                                    <Group grow>
                                    <TextInput
                                        label="Late/Penalty Fee"
                                        description="This amount will be applied everytime a tenant exceeds the rent due date."
                                        onChange={e => setPenalty(e.target.value)}
                                        placeholder="Eg. 1000"
                                    />
                                    <TextInput
                                        label="Grace Period (Days)"
                                        description="Extend your tenant payment period by selecting a grace period."
                                        onChange={e => setGracePeriod(e.target.value)}
                                        placeholder="Eg. 6"
                                    />
                                        <Select
                                        label="Generate Invoice On (Day of Month)"
                                        description="Day of each month when invoices are generated and sent to tenants."
                                        onChange={setGenerateOn}
                                        placeholder="Select Day"
                                        searchable
                                        clearable
                                        data={Array.from({ length: 31 }, (_, index) => ({
                                            value: (index + 1).toString(),
                                            label: (index + 1).toString(),
                                        }))}
                                        />
                                    </Group>

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting} > Create Lease </Button>
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
