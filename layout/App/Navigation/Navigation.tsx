import {ActionIcon, Box, Code, Flex, Group, Navbar, NavbarProps, ScrollArea, Text, UnstyledButton} from '@mantine/core';
import {
    IconAdjustmentsFilled,
    IconLayoutGrid,
    IconX,
    IconBuildingSkyscraper,
    IconCashBanknote,
    IconUserPlus,
    IconPin,
    IconMapPin,
    IconCurrentLocation,
    IconSettings,
} from '@tabler/icons-react';
import useStyles from "./Navigation.styles";
import {Logo, UserProfileButton} from "@/components";
import {
    PATH_AUTH,
    PATH_DASHBOARD,
    PATH_ASKARIS_REVENUE,
    PATH_INVOICES,
    PATH_MANAGE_OWNERS,
    // PATH_ZONES,
    PATH_PAGES,
} from "@/routes";
import UserProfileData from ".././../../mocks/UserProfile.json";
import {LinksGroup} from "@/layout/App/Navigation/Links/Links";
import {useMediaQuery} from "@mantine/hooks";

const mockdata = [
    {
        title: 'Menu',
        links: [
            {
                label: 'Dashboard',
                icon: IconLayoutGrid,
                link: PATH_DASHBOARD.default
            },
            {
                label: 'Properties',
                icon: IconBuildingSkyscraper,
                links: [
                    // {label: 'Businesses', link: PATH_ASKARIS_REVENUE.businesses},
                    // {label: 'Parking', link: PATH_ASKARIS_REVENUE.parking},
                    // {label: 'Land Rates', link: PATH_ASKARIS_REVENUE.landrates},
                    {label: 'Buildings', link: PATH_ASKARIS_REVENUE.rentals},
                    {label: 'Units', link: PATH_ASKARIS_REVENUE.add},
                ]
            },
            {
                label: 'Manage Invoices',
                icon: IconCashBanknote,
                link: PATH_INVOICES.invoices.all
            },
            {
                label: 'Manage Landloards',
                icon: IconUserPlus,
                link: PATH_MANAGE_OWNERS.all
            },
            {
                label: 'Manage Tenants',
                icon: IconUserPlus,
                link: PATH_MANAGE_OWNERS.all
            },
            {
                label: 'Manage Zones',
                icon: IconPin,
                link: PATH_DASHBOARD.default
            },
            {
                label: 'Manage Locations',
                icon: IconMapPin,
                link: PATH_DASHBOARD.default
            },
            {
                label: 'Manage Streets',
                icon: IconCurrentLocation,
                link: PATH_DASHBOARD.default
            },
            {
                label: 'My Profile',
                icon: IconSettings,
                link: PATH_DASHBOARD.default
            },
           
        ]
    },
];

type NavigationProps = { onClose: () => void } & Omit<NavbarProps, 'children'>

const Navigation = ({onClose, ...others}: NavigationProps) => {
    const {classes, theme} = useStyles()
    const tablet_match = useMediaQuery('(max-width: 168px)');

    const links = mockdata.map(m =>
        <Box pl={0} mb="md" key={m.title}>
            <Text tt="uppercase" size="xs" pl="md" fw={500} mb="sm" c="gray.2">{m.title}</Text>
            {m.links.map((item) => <LinksGroup {...item} key={item.label}/>)}
        </Box>
    )

    return (
        <Navbar width={{sm: 100, md: 200}} px="md" className={classes.navbar} {...others}>
            <Navbar.Section className={classes.header}>
                <Flex justify="space-between" align="center" gap="sm">
                    <Group position="apart" sx={{flex: tablet_match ? 'auto' : 1}}>
                        <Logo sx={{color: theme.white}}/>
                    </Group>
                    {tablet_match &&
                        <ActionIcon onClick={onClose} variant="transparent">
                            <IconX color="white"/>
                        </ActionIcon>
                    }
                </Flex>
            </Navbar.Section>

            <Navbar.Section grow className={classes.links} component={ScrollArea}>
                <div className={classes.linksInner}>{links}</div>
            </Navbar.Section>

            {/* <Navbar.Section className={classes.footer}>
                <UserProfileButton
                    email={UserProfileData.email}
                    image={UserProfileData.avatar}
                    name={UserProfileData.name}
                    sx={{color: theme.white}}
                />
            </Navbar.Section> */}
        </Navbar>
    );
};

export default Navigation;
