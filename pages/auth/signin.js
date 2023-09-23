import React, {SyntheticEvent, useState} from 'react';
import {
    Button, Center,
    Checkbox,
    Group,
    Paper,
    PasswordInput,
    rem,
    Text,
    TextInput, TextProps,
    Title, useMantineTheme,
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";
import {useRouter} from "next/router";
import { showNotification } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Signin() {
    const theme = useMantineTheme()
    const mobile_match = useMediaQuery('(max-width: 425px)');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);
    
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Login Successfull",
                color: "green",
            });
    
            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push(PATH_DASHBOARD.default);
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
    

    return (
        <>
            <AuthLayout>
                <Title fz="xl" ta="center">
                    Properties Management
                </Title>
                <Text ta="center">Sign in to your account to continue</Text>

                <Paper shadow="xl" radius="md" p="lg" mt={15} sx={{width: rem(mobile_match ? 360 : 420)}}>
                    <TextInput label="Email" onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" required/>
                    <PasswordInput label="Password" onChange={e => setPassword(e.target.value)} placeholder="Your password" required mt="md"/>
                    <Group position="apart" mt="lg">
                        <Checkbox label="Remember me"/>
                        {/* <Text component={Link} href={PATH_AUTH.passwordReset} size="sm">
                            Forgot password?
                        </Text> */}
                    </Group>
                    <Button onClick={submit} loading={isSubmitting} fullWidth mt="xl">
                        Sign in
                    </Button>
                    <Center mt="md">
                        <Text fz="sm" ta="center" component={Link} href={PATH_AUTH.signup}>
                            Do not have an account yet? Create account
                        </Text>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default Signin;
