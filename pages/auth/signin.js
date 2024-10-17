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
//
import { signIn, useSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Signin() {
    const { data: session, status } = useSession();
    const mobile_match = useMediaQuery('(max-width: 425px)');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);


    async function submit(event) {
        event.preventDefault();
        setIsSubmitting(true);
    
        // TODO: Add validation
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        console.log("Login Result Data", result);
    
        setIsSubmitting(false);
    
        if (result.error) {
            showNotification({
                title: "Error",
                message: "Invalid Credentials, Try again!",
                color: "red",
            });
          console.log("An Error Occured", result.error);
        } else {
          // router.replace("/");
          showNotification({
                title: "Success",
                message: "Login Successfull",
                color: "green",
          });
          router.push("/");
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
                         <Text component={Link} href={PATH_AUTH.passwordReset} size="sm">
                            Forgot password?
                        </Text> 
                    </Group>
                    <Button  color='blue' onClick={submit} loading={isSubmitting} fullWidth mt="xl">
                        Sign in
                    </Button>
                    <Center mt="md">
                        <Text fz="sm" ta="center" >
                            Do not have an account yet?
                        </Text>
                    </Center>
                    <Center>
                        <Link href={PATH_AUTH.signup} passHref style={{ display: 'block', width: '100%', textDecoration: 'none' }}>
                            <Button
                                style={{
                                    width: '100%',
                                    backgroundColor: 'aqua',
                                    transition: 'background-color 0.3s',
                                    display: 'block'
                                }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'green'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'aqua'}
                            >
                                Create account
                            </Button>
                        </Link>
                    </Center>
                </Paper>
            </AuthLayout>
        </>
    );
}

export default Signin;
