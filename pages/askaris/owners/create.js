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
    Title,
    PasswordInput
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {useForm} from "@mantine/form";
import {IconArrowBack, IconCurrentLocation} from "@tabler/icons-react";
import {AppLayout} from "@/layout";
import {PageHeader} from "@/components";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ICON_SIZE = 18;

function CreateBusiness() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [kra, setKra] = useState('');
    const [nid, setNid] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();


        
        if(!name){
            showNotification({
                title: "Error",
                message: "Name is required!",
                color: "red",
            });
            return;
        }

        if(!email){
            showNotification({
                title: "Error",
                message: "Email is required!",
                color: "red",
            });
            return;
        }

        if(!phone){
            showNotification({
                title: "Error",
                message: "Phone is required!",
                color: "red",
            });
            return;
        }

        if(password != confirmPassword){
            showNotification({
                title: "Error",
                message: "Password does not match!",
                color: "red",
            });
            return;
        }

        setIsSubmitting(true);
    
        try {
            const response = await fetch(`${API_URL}/users/store-owner`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    kra,
                    nid,
                    password,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Landloard Created Successfull",
                color: "green",
            });
    
            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push('/askaris/owners');
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
                                    <Title order={3}>Add Landloard</Title>
                                </Stack>
                                <Link href="/askaris/owners">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Stack>
                                <Text size="md" fw={600}>Landloard Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Landloard Name"
                                    placeholder="Landloard Name"
                                    onChange={e => setName(e.target.value)}
                                    />
                                    <TextInput
                                    label="Landloard Phone"
                                    placeholder="Landloard Phone"
                                    onChange={e => setPhone(e.target.value)}
                                    />
                                    <TextInput
                                    label="Landloard Email"
                                    placeholder="Landloard Email"
                                    onChange={e => setEmail(e.target.value)}
                                    />
                                    </Group> 
                                   <Group grow>
                                   <TextInput
                                    label="Landloard KRA Pin"
                                    placeholder="Landloard KRA Pin"
                                    onChange={e => setKra(e.target.value)}
                                    />
                                    <TextInput
                                    label="Landloard National ID"
                                    placeholder="Landloard National ID"
                                    onChange={e => setNid(e.target.value)}
                                    />
                                    </Group>
                                     <Group grow>
                                     <PasswordInput label="Password" onChange={e => setPassword(e.target.value)} mt="md"/>
                                     <PasswordInput label="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} mt="md"/>

                                    </Group>

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting}>Create Landloard</Button>
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
