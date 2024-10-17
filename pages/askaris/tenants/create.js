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
import { useSession } from "next-auth/react";
//
import { getTenants } from '@/store/users/users-slice';
import { useSelector } from 'react-redux';
import store from '@/store/store';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ICON_SIZE = 18;


function CreateTenant() {
    const { data: session, status } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [type, setType] = useState('');
    const [code, setCode] = useState('');
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

        const accessToken = session.user.accessToken;
    
        try {
            const response = await fetch(`${API_URL}/users/store-tenant`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken} `,
                    Accept: "application/json",
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    type,
                    code,
                    gender,
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
                message: "Tenant Created Successfull",
                color: "green",
            });
    
            
            await router.push('/askaris/tenants');
        } catch (error) {
            setIsSubmitting(false);
            

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
                                    <Title order={3}>Add Client</Title>
                                </Stack>
                                <Link href="/askaris/tenants">
                                <Button leftIcon={<IconArrowBack size={18}/>} size='xs' variant='outline'>Back</Button>
                                </Link>
                            </Flex>
                        <Paper p="md" shadow='md' radius="md">
                            <Stack>
                                <Text size="md" fw={600}>Client Details</Text>
                                <Group grow>
                                 <Select
                                    label="Tenant Type"
                                    placeholder="Select Type"
                                    onChange={setType}
                                    searchable
                                    clearable
                                    data={[
                                        { value: 'Individual', label: 'Individual' },
                                        { value: 'Business', label: 'Business' },
                                    ]}
                                    /> 
                                <TextInput
                                    label="Client Name"
                                    placeholder="Client Name"
                                    onChange={e => setName(e.target.value)}
                                    />
                                    <TextInput
                                    label="Client Phone"
                                    placeholder="Client Phone"
                                    onChange={e => setPhone(e.target.value)}
                                    />
                                    
                                    </Group> 
                                    <Group grow>
                                    <TextInput
                                    label="Client Email"
                                    placeholder="Client Email"
                                    onChange={e => setEmail(e.target.value)}
                                    />
                                     <TextInput
                                    label="Client ID Number"
                                    placeholder="Client ID Number"
                                    onChange={e => setNid(e.target.value)}
                                    />
                                <Select
                                    label="Gender"
                                    placeholder="Select Gender"
                                    onChange={setGender}
                                    searchable
                                    clearable
                                    data={[
                                        { value: 'Male', label: 'Male' },
                                        { value: 'Female', label: 'Female' },
                                    ]}
                                    />                               
                                    
                                    </Group> 
                                    <Group grow>

                                   <TextInput
                                    label="Client Code(Leave empty to autogenerate random code)"
                                    placeholder="Client Code"
                                    onChange={e => setCode(e.target.value)}
                                    />

                                <PasswordInput label="Password" onChange={e => setPassword(e.target.value)} mt="md"/>
                                     <PasswordInput label="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} mt="md"/>

                                    </Group> 

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting}>Create Client</Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default CreateTenant;
