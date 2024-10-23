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
    PasswordInput,
    FileInput,
    SimpleGrid
} from "@mantine/core";
import {PATH_DASHBOARD} from "@/routes";
import {useForm} from "@mantine/form";
import {IconArrowBack, IconCurrentLocation, IconUpload} from "@tabler/icons-react";
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
import { getSystemSettings } from '@/store/settings/settings-slice';
import { useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ICON_SIZE = 18;


function SystemSettings() {
    const { data: session, status } = useSession();

    const systemSettings = useSelector((state) => state.settings.getSystemSettings);
    
    const [logo, setLogo] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [days, setDays] = useState('');
    const [password, setPassword] = useState('');
    const [sendReminders, setSendReminders] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bank, setBank] = useState('');

    useEffect(() => {
        if (!session || status !== "authenticated") {
        return;
        }
        const params = {};

        params["accessToken"] = session.user.accessToken;

        store.dispatch(getSystemSettings(params));
        console.log("Anthony 2");
    }, [session, status]);

    console.log("Anthony Anthony", systemSettings);
    
    useEffect(() => {
        if(!systemSettings){
            return;
        }
        setName(systemSettings.name);
        setEmail(systemSettings.email);
        setPhone(systemSettings.phone);
        setDays(systemSettings.days);
        setDays(systemSettings.bank);
        setSendReminders(systemSettings.send_reminders);
      }, [systemSettings]);

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

        const accessToken = session.user.accessToken;

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("send_reminders", sendReminders);
        formData.append("days", days ?? 0);
        formData.append("password", password);
        formData.append("logo", logo);
        formData.append("bank", bank);
        
    
        try {
            const response = await fetch(`${API_URL}/settings/store-system`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken} `,
                    Accept: "application/json",
                    // 'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Settings saved Successfull",
                color: "green",
            });

            //Get the new Settings
            const params = {};
            params["accessToken"] = session.user.accessToken;
            store.dispatch(getSystemSettings(params));
    
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
                        <Paper p="md" shadow='md' radius="md">
                            <Stack>
                                <Text size="md" fw={600}>System Settings</Text>
                                <Group grow>
                                <TextInput
                                    label="System Name"
                                    placeholder="System Name"
                                    defaultValue={name}
                                    onChange={e => setName(e.target.value)}
                                    />
                                    <TextInput
                                    label="Phone No."
                                    placeholder="Phone No."
                                    defaultValue={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    />  
                                                                     
                                    </Group> 
                                    <SimpleGrid cols={2} >

                                    <TextInput
                                    label="Email"
                                    placeholder="Email"
                                    defaultValue={email}
                                    onChange={e => setEmail(e.target.value)}
                                    /> 

                                    <TextInput
                                    label="Bank Account"
                                    placeholder="Bank Account"
                                    defaultValue={bank}
                                    onChange={e => setBank(e.target.value)}
                                    /> 

                                    <Select
                                    label="Send Invoice Reminders"
                                    onChange={setSendReminders}
                                    placeholder="Send Invoice Reminders"
                                    searchable
                                    clearable
                                    value={sendReminders}
                                    data={[
                                        { value: 'Yes', label: 'Yes' },
                                        { value: 'No', label: 'No' },
                                    ]}
                                    />
                                    
                                    {sendReminders === "Yes" && (
                                     <TextInput
                                    label="Send Reminders After (Days)"
                                    placeholder="Enter No. of Days"
                                    defaultValue={days}
                                    onChange={e => setDays(e.target.value)}
                                    />  
                                    )}

                                    <TextInput
                                    label="Change Password"
                                    placeholder="Change password"
                                    onChange={e => setPassword(e.target.value)}
                                    />   

                                    {/* Upload Logo  */}
                                    <FileInput
                                        placeholder="Upload Logo"
                                        label="Upload Logo"
                                        withAsterisk
                                        icon={<IconUpload size={14} />}
                                        onChange={setLogo}
                                    />

                                    {systemSettings?.logo && (
                                    <Image alt="" src={systemSettings?.logo} radius="sm" mt="xs" height={100} width={100} />
                                    )}


                                    
                                    </SimpleGrid> 

                                <Box sx={{width: 'auto'}}>
                                    <Button onClick={submit} loading={isSubmitting}>Save Settings</Button>
                                </Box>
                            </Stack>
                        </Paper>
                    </Stack>
                </Container>
            </AppLayout>
        </>
    );
}

export default SystemSettings;
