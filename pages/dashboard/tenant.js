import React, { useEffect, useState } from 'react';  
import { useRouter } from 'next/router';
import { getDateFilterFrom, getDateFilterTo } from '../../lib/shared/data-formatters';
import store from "@/store/store";
import { getDashboard } from "@/store/dashboard/dashboard-slice";
import { useSession } from "next-auth/react";


import {
  Avatar,
  Button,
  Flex,
  Group,
  Input,
  Paper,
  Stack,
  Text,
  Title,
  Menu,
  Select,
  Image,
  TextInput,
} from "@mantine/core";
import {
  IconDashboard,
  IconShield,
  IconChartBar,
  IconNotification,
  IconSettings,
  IconBell,
  IconPower,
  IconUser,
  IconMail,
  IconMessageCircle,
  IconTools,
} from "@tabler/icons-react";

const PATH_AUTH = {
  signin: '/../../auth/signin',
  login: '/login'
};

const Tenant = ({  }) => {
  const router = useRouter();
  const [startDate, setStartDate] = useState(getDateFilterFrom());
  const [endDate, setEndDate] = useState(getDateFilterTo());
  const { data: session, status } = useSession();

  const handleLogout = () => {
    router.push(PATH_AUTH.signin);
  };

  const handleProfile = () => {
    router.push('/dashboard/Profiles/tenantProfile');
  };

  const [newMessages, setNewMessages] = useState(3); 

const handleSettingsRedirect = () => {
  window.location.href = '/dashboard/Profiles/tenantProfile'; 
};



useEffect(() => {
  const params = {};

  params["accessToken"] = session?.user?.accessToken; 
  // add date filters
  if (!startDate && !endDate) {
    store.dispatch(getInvoices(params));
    return;
  }
  if (!startDate || !endDate) {
    return;
  }

  params["startDate"] = startDate;
  params["endDate"] = endDate;

  store.dispatch(getDashboard(params));
}, [session, startDate, endDate,]);
useEffect(() => {
  if (!session  == "authenticated") {
    return;
  }
  
  const params = {};
  params["accessToken"] = session?.user?.accessToken;
}, [session ]);

const handleSelectChange = (value) => {
  if (value) {
    
    switch (value) {
      case 'Payment':
        router.push('/payment'); 
        break;
      case 'Repair':
        router.push('/repair'); 
        break;
      case 'Message':
        router.push('/message'); 
        break;
      case 'Report':
        router.push('/report'); 
        break;
      default:
        break;
    }
  }
};



  return (
    <Flex style={{ backgroundColor: '#0E0631' }}>
      {/* Sidebar */}
      <Stack
        spacing="xs"
        style={{
          background: "#181449",
          height: "100vh",
          width: '250px',
          padding: '1rem',
          color: 'white',
          //position:'fixed'
        }}
      >
    <Flex align="center" style={{ marginBottom: '1rem' }}>
      <Avatar src={ session?.user?.logo || '/TechForge 1.PNG'} size="lg" radius="xl" />
      <h2 className="text-lg md:text-xl font-bold text-white" style={{ marginLeft: '10px' }}>
        Hi, <span className="text-blue-600">{ session?.user?.name || 'Guest'}</span>
      </h2>
    </Flex>


        <Input
          placeholder="Search..."
          variant="filled"
          style={{ marginBottom: '1rem' }}
        />
        <h2 className="text-lg md:text-xl font-semibold text-white" style={{ marginLeft: '10px' }}>
            Menu
          </h2>
        <Button variant="subtle" color="gray" leftIcon={<IconDashboard />}>
          Dashboard
        </Button>
        <Button variant="subtle" color="gray" leftIcon={<IconShield />}>
          Data Security
        </Button>
        <Button variant="subtle" color="gray" leftIcon={<IconChartBar />}>
          User Behavior
        </Button>
        <h2 className="text-lg md:text-xl font-semibold text-white" style={{ marginLeft: '10px' }}>
            Manage
          </h2>
          <Button variant="subtle" color="gray" leftIcon={<IconDashboard />}>
          Dashboard
        </Button>
        <Button variant="subtle" color="gray" leftIcon={<IconShield />}>
          Data Security
        </Button>
        <Button variant="subtle" color="gray" leftIcon={<IconChartBar />}>
          User Behavior
        </Button>
        <Button variant="light" color="violet" style={{ marginTop: 'auto' }}>
          Upgrade Now
        </Button>
      </Stack>

      {/* Main Content */}
      <Flex direction="column" style={{ flex: 1, padding: 0 }}>
        {/* Top Bar */}
        <Flex
    justify="space-between"
    align="center"
    padding="lg"
    style={{
      background: "#181449",
      position: '',  
      top: 0,
      right: 0,
      left: '250px',  
      zIndex: 9,
      height: '50px',  
      paddingRight: '20px',
    }}
  >
  <Input
    placeholder="Type to search..."
    variant="filled"
    style={{ width: '250px', paddingLeft: '20px' }}
  />
  <Group spacing="xs">
  <div style={{ position: 'relative' }}>
    <IconNotification color="white" />
    {newMessages > 0 && (
      <div
        style={{
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          width: 20,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
        }}
      >
        {newMessages}
      </div>
    )}
  </div>
  <IconSettings color="white" style={{ cursor: 'pointer' }} onClick={handleSettingsRedirect} />
  <Menu>
    <Menu.Target>
      <Image
        src={session?.user?.logo || '/TechForge 1.PNG'}
        alt="Options"
        height={44}
        width={44}
        radius={120}
        style={{ cursor: 'pointer' }}
      />
    </Menu.Target>
    <Menu.Dropdown>
      <Menu.Item onClick={handleProfile}>
        <IconUser size={18} style={{ marginRight: 8 }} />
        Profile
      </Menu.Item>
      <Menu.Item onClick={handleLogout}>
        <IconPower size={18} style={{ marginRight: 8 }} />
        Log Out
      </Menu.Item>
    </Menu.Dropdown>
  </Menu>
</Group>

</Flex>

        {/* Dashboard */}
        <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
      <Title order={3} style={{ color: 'blue', paddingLeft: '20px' }}>
        Tenant Dashboard
      </Title>
      <Select
        placeholder="Changes"
        data={['Payment', 'Repair', 'Message', 'Report']}
        style={{ width: '150px', paddingTop: '20px', paddingRight: '20px' }} 
        onChange={handleSelectChange} 
      />
    </Flex>

        {/* Cards Section */}
        <Flex wrap="wrap" gap="lg" style={{ justifyContent: 'space-between', width: '100%', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <Paper
            withBorder
            shadow="md"
            padding="md"
            radius="lg"
            style={{
              backgroundColor: '#62B2FF',
              width: 'calc(25% - 20px)',
              minHeight: '150px',
              flex: '1 1 auto',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Group position="apart">
              <Text size="sm" color="white">High-risk events</Text>
              <IconShield size={18} color="white" />
            </Group>
            <Text size="xl" weight={700} color="white">29</Text>
          </Paper>

          <Paper
            withBorder
            shadow="md"
            padding="md"
            radius="lg"
            style={{
              backgroundColor: '#5EDAD3',
              width: 'calc(25% - 20px)',
              minHeight: '150px',
              flex: '1 1 auto',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Group position="apart">
              <Text size="sm" color="white">Risky activities</Text>
              <IconChartBar size={18} color="white" />
            </Group>
            <Text size="xl" weight={700} color="white">08</Text>
          </Paper>

          <Paper
            withBorder
            shadow="md"
            padding="md"
            radius="lg"
            style={{
              background: 'linear-gradient(135deg, #FF61C2 0%, #9A48D0 100%)',
              width: 'calc(25% - 20px)',
              minHeight: '150px',
              flex: '1 1 auto',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Group position="apart">
              <Text size="sm" color="white">High-risk Users</Text>
              <IconNotification size={18} color="white" />
            </Group>
            <Text size="xl" weight={700} color="white">06</Text>
          </Paper>

          <Paper
            withBorder
            shadow="md"
            padding="md"
            radius="lg"
            style={{
              backgroundColor: '#FF61C2',
              width: 'calc(25% - 20px)',
              minHeight: '150px',
              flex: '1 1 auto',
              paddingLeft: '20px',
              paddingRight: '20px',
            }}
          >
            <Group position="apart">
              <Text size="sm" color="white">Devices with issues</Text>
              <IconSettings size={18} color="white" />
            </Group>
            <Text size="xl" weight={700} color="white">01</Text>
          </Paper>
        </Flex>

        {/* Graph and Environment Settings Section */}
                  <Flex style={{ marginTop: '2rem', width: '100%', paddingLeft: '1rem', paddingRight: '1rem' }}>
            {/* Left Column: Live Graph, Your Details, One Time Report */}
            <Flex direction="column" style={{ flex: 3, marginRight: '2rem' }}>
              {/* Graph */}
              <Paper withBorder shadow="md" padding="lg" radius="lg" style={{ backgroundColor: '#181449', marginBottom: '2rem' }}>
                  <Title order={4} style={{ color: 'white', paddingLeft: '20px' }}>Payments In Time</Title>
                  <div style={{ height: 200, background: '#181449', position: 'relative' }}>
                    {/* Horizontal Grid Lines and Labels */}
                    <div style={{ position: 'absolute', top: '0', left: '20px', width: 'calc(100% - 40px)', height: 'calc(100% - 30px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                      {['7k', '6k', '5k', '4k', '3k', '2k', '1k', '0'].map((label, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                          <Text color="white" size="xs" style={{ width: '30px', textAlign: 'right', paddingRight: '10px' }}>{label}</Text>
                          <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#ffffff50' }} />
                        </div>
                      ))}
                    </div>

                    {/* Months at the Bottom */}
                    <div style={{ position: 'absolute', bottom: '0px', left: '50px', right: '50px', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                        <span key={index}>{month}</span>
                      ))}
                    </div>
                  </div>
                </Paper>



            <Flex wrap="wrap" gap="lg">
              {/* Your Details */}
              <Paper withBorder shadow="md" padding="md" radius="lg" style={{ backgroundColor: '#181449', flex: '1 1 calc(50% - 20px)', height: '180px' }}>
                <Title order={5} align="center" style={{ color: 'white' }}>Your Details</Title>
                
                <Text size="sm" color="white" style={{ textAlign: 'left', marginTop: '10px', paddingLeft: '20px' }}>
                    <Text component="span" color="blue">Name:</Text> {session?.user?.name || 'N/A'}
                </Text>
                
                <Text size="sm" color="white" style={{ textAlign: 'start', paddingLeft: '20px' }}>
                    <Text component="span" color="blue">Email:</Text> {session?.user?.email || 'N/A'}
                </Text>
                
                <Text size="sm" color="white" style={{ textAlign: 'start', paddingLeft: '20px' }}>
                    <Text component="span" color="blue">Phone:</Text> {session?.user?.phone || 'N/A'}
                </Text>
                
                <Text size="sm" color="white" style={{ textAlign: 'start', paddingLeft: '20px' }}>
                    <Text component="span" color="blue">Role:</Text> {session?.user?.role || 'N/A'}
                </Text>
                
                <Text size="sm" color="white" style={{ textAlign: 'start', paddingLeft: '20px' }}>
                    <Text component="span" color="blue">Secret:</Text> {session?.user?.code || 'N/A'}
                </Text>
                </Paper>


              {/* One Time Report */}
              <Paper withBorder shadow="md" padding="md" radius="lg" style={{ backgroundColor: '#181449', flex: '1 1 calc(50% - 20px)', height: '180px',paddingTop: '20px' }}>
                <Title order={5} align="center" style={{ color: 'white' }}>One Time Report</Title>
                  <h2 className="text-lg md:text-xl font-semibold text-gray-700">
                    Hello, <span className="text-blue-600">{ session?.user?.name}</span>
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center gap-2">
                      <TextInput
                        label="From"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        type="date"
                        className="text-sm"
                        
                      />
                      <TextInput
                        label="To"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        type="date"
                        className="text-sm"
                      />
                    </div>
                  </div>
                
              </Paper>
            </Flex>
          </Flex>

          {/* Right Column: Notification Settings */}
          <Paper withBorder shadow="md" padding="md" radius="lg" style={{ backgroundColor: '#181449', flex: '1 1 calc(10% - 10px)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Title order={5} style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>Notifications</Title>
            {/* Notification Cards */}
            <Paper
              withBorder
              padding="sm"
              radius="md"
              style={{
                marginBottom: '40px', 
                backgroundColor: '#3B3664',
                width: '80%',
                height: '100px',
                textAlign: 'center',
                position: 'relative',
                paddingLeft: '20px',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Group position="apart" style={{ paddingRight: '20px' }}>
                <Text size="sm" color="blue">Email Notifications</Text>
                <IconMail size={18} color="white" />
              </Group>
              <Text size="xs" color="white" style={{ marginBottom: '8px' }}>Receive alerts on important updates via Your email.</Text>
              <Button
                size="xs"
                color="blue"
                variant="filled"
                style={{
                  backgroundColor: '#1E90FF',
                  border: '1px solid white',
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'green'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E90FF'}
              >
                Emails
              </Button>
            </Paper>

            <Paper
              withBorder
              padding="sm"
              radius="md"
              style={{
                marginBottom: '40px', 
                backgroundColor: '#3B3664',
                width: '80%',
                height: '100px',
                textAlign: 'center',
                position: 'relative',
                paddingLeft: '20px',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Group position="apart" style={{ paddingRight: '20px' }}>
                <Text size="sm" color="blue">Message Notifications</Text>
                <IconMessageCircle size={18} color="white" />
              </Group>
              <Text size="xs" color="white" style={{ marginBottom: '8px' }}>Get real-time alerts From your Admins.</Text>
              <Button
                size="xs"
                color="blue"
                variant="filled"
                style={{
                  backgroundColor: '#1E90FF',
                  border: '1px solid white',
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'green'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E90FF'}
              >
                Messages
              </Button>
            </Paper>

            <Paper
              withBorder
              padding="sm"
              radius="md"
              style={{
                backgroundColor: '#3B3664',
                width: '80%',
                height: '100px',
                textAlign: 'center',
                position: 'relative',
                paddingLeft: '20px',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Group position="apart" style={{ paddingRight: '20px' }}>
                <Text size="sm" color="blue">Repair Notifications</Text>
                <IconTools size={18} color="white" />
              </Group>
              <Text size="xs" color="white" style={{ marginBottom: '8px' }}>Stay updated on repair activities and schedules.</Text>
              <Button
                size="xs"
                color="blue"
                variant="filled"
                style={{
                  backgroundColor: '#1E90FF',
                  border: '1px solid white',
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'green'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1E90FF'}
              >
                Repairs
              </Button>
            </Paper>
          </Paper>


        </Flex>

        </Flex>
      </Flex>
    
    
  );
};

export default Tenant;
