import React, {SyntheticEvent, useState} from 'react';
import {
    Button,
    Center,
    Flex,
    Paper,
    PasswordInput,
    rem,
    Text,
    TextInput, TextProps,
    Title, useMantineTheme
} from "@mantine/core";
import Head from "next/head";
import Link from "next/link";
import {PATH_AUTH, PATH_DASHBOARD} from "@/routes";
import {AuthLayout} from "@/layout";
import {useMediaQuery} from "@mantine/hooks";
import {useRouter} from "next/router";
import { showNotification } from '@mantine/notifications';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function SignUp() {
    const theme = useMantineTheme();
    const mobile_match = useMediaQuery('(max-width: 425px)');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
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
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    password,
                }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to log in: ${response.statusText}`);
            }

            setIsSubmitting(false);

            showNotification({
                title: "Success",
                message: "Registration Successfull",
                color: "green",
            });
    
            // Assuming the login was successful, you can proceed to navigate to the dashboard.
            await router.push('/auth/signin');
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
                <Title ta="center">
                   Signup
                </Title>
                <Text ta="center">Create your account to continue</Text>

                <Paper
                    shadow="xl"
                    p="lg"
                    mt={15}
                    radius="md"
                    sx={{
                        width: rem(mobile_match ? 360 : 420),
                    }}
                >
                    <Flex
                        direction={{base: 'column', sm: 'row'}}
                        gap={{base: 'md'}}
                    >
                        <TextInput label="Full Name" onChange={e => setName(e.target.value)} placeholder="John Doe" required/>
                        <TextInput label="Phone Number" onChange={e => setPhone(e.target.value)} placeholder="0799117020" required/>
                    </Flex>
                    <TextInput label="Email" onChange={e => setEmail(e.target.value)} placeholder="you@gmail.com" required mt="md"/>
                    <PasswordInput label="Password" onChange={e => setPassword(e.target.value)} placeholder="Your password" required mt="md"/>
                    <PasswordInput label="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required mt="md"/>
                    <Button onClick={submit} loading={isSubmitting} fullWidth mt="xl">
                        Create account
                    </Button>
                    <Center mt="md">
                        <Text size="sm" component={Link} href={PATH_AUTH.signin} >
                            Already have an account? Sign in
                        </Text>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default SignUp;
