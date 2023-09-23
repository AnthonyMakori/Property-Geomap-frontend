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
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ICON_SIZE = 18;

function CreateBusiness() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
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


        setIsSubmitting(true);
    
        try {
            const response = await fetch(`${API_URL}/locations/store-zone`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    description,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to store: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Zone Created Successfull",
                color: "green",
            });
    
            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push('/areas/zones');
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
                                    <Title order={3}>Add Zone</Title>
                                </Stack>
                                <Link href="/areas/zones">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper p="md">
                            <Stack>
                                <Text size="md" fw={600}>Zone Details</Text>
                                <Group grow>
                                <TextInput
                                    label="Zone Name"
                                    placeholder="Zone Name"
                                    onChange={e => setName(e.target.value)}
                                    />
                                    <TextInput
                                    label="Description"
                                    placeholder="Description"
                                    onChange={e => setDescription(e.target.value)}
                                    />
                                    
                                    </Group> 
                                   

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting}>Create Zone</Button>
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
