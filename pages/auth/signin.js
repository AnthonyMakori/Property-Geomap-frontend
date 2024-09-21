import React, { useState } from 'react';
import {
  Button, Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  rem,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { AuthLayout } from '@/layout';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';  // Import PATH_AUTH for signup route

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function Signin() {
  const theme = useMantineTheme();
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
        title: 'Success',
        message: 'Login Successful',
        color: 'green',
      });

      if (email === 'antonymakori2019@gmail.com') {
        await router.push('/dashboard/tenant');
      } else {
        await router.push(PATH_DASHBOARD.default);
      }

    } catch (error) {
      setIsSubmitting(false);
      showNotification({
        title: 'Error',
        message: '' + error,
        color: 'red',
      });
      console.error('Error during login:', error);
    }
  };

  const handleSignup = () => {
    router.push(PATH_AUTH.signup); // Navigate to the Signup page using PATH_AUTH.signup
  };

  return (
    <>
      <AuthLayout>
        <Title fz="xl" ta="center">
          Properties Management
        </Title>
        <Text ta="center">Sign in to your account to continue</Text>

        <Paper shadow="xl" radius="md" p="lg" mt={15} sx={{ width: rem(mobile_match ? 360 : 420) }}>
          <TextInput label="Email" onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" required />
          <PasswordInput label="Password" onChange={(e) => setPassword(e.target.value)} placeholder="Your password" required mt="md" />
          <Group position="apart" mt="lg">
            <Checkbox label="Remember me" />
          </Group>
          <Button onClick={submit} loading={isSubmitting} fullWidth mt="xl">
            Sign in
          </Button>


          <Center mt="md">
            <Text fz="sm" ta="center" mt="xsm" mb="xsm">
              Do not have an account yet?
            </Text>
          </Center>
          <Center mt="xsm">
            <Button
              onClick={handleSignup}
              fullWidth
              sx={{
                backgroundColor: 'aqua',
                '&:hover': {
                  backgroundColor: 'green',
                },
              }}
            >
              Create account
            </Button>
          </Center>
        </Paper>
      </AuthLayout>
    </>
  );
}

export default Signin;
