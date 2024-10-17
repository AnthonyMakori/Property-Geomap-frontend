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
    IconMessage2,
    IconSettings,
    IconUserCog,
    IconMessageCircle2,
    IconAperture,
    IconBasketFilled,
    IconReport,
    IconMap,
} from '@tabler/icons-react';
import useStyles from "./Navigation.styles";
import {Logo, UserProfileButton} from "@/components";
import {
    PATH_AUTH,
    PATH_DASHBOARD,
    PATH_ASKARIS_REVENUE,
    PATH_INVOICES,
    PATH_MANAGE_OWNERS,
    PATH_MANAGE_TENANTS,
    PATH_MANAGE_STREETS,
    PATH_MANAGE_LOCATIONS,
    PATH_MANAGE_ZONES,
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
                    // {label: 'Units', link: PATH_ASKARIS_REVENUE.add},
                    {label: 'Leases', link: "/leases"},                   
                ]
            },
            {
                label: 'Manage Lands',
                icon: IconMap,
                links: [
                    {label: 'Dashboard', link: '/lands/dashboard'},
                    {label: 'Lands/Plots', link: '/lands'},
                    {label: 'Land Sales', link: '/lands/sales'},                  
                ]
            },
            {
                label: 'Accounts',
                icon: IconCashBanknote,
                links: [
                    {label: 'Invoices', link: '/invoices'},
                    {label: 'Expenses', link: '/expenses'},
                    {label: 'Payments', link: '/payments'},
                    {label: 'Bank Payments', link: '/payments/bank'},
                ]
            },
            {
                label: 'Maintenance',
                icon: IconAperture,
                links: [
                    
                    {label: 'Repairs', link: '/repairs'},
                ]
            },
            {
                label: 'Purchases',
                icon: IconBasketFilled,
                links: [
                    
                    {label: 'Purchase', link: '/purchases'},
                ]
            },
            {
                label: 'Messages',
                icon: IconMessageCircle2,
                links: [
                    {label: 'Sent Box', link: '/communications'},
                ]
            },
            {
                label: 'All Users',
                icon: IconUserCog,
                links: [
                    {label: 'Staff', link: '/partners/staff'},
                    {label: 'Clients', link: PATH_MANAGE_TENANTS.all},
                    {label: 'Landlords', link: PATH_MANAGE_OWNERS.all},
                    {label: 'Suppliers', link: '/partners/suppliers'},
                ]
            },
            {
                label: 'Reports',
                icon: IconReport,
                links: [
                    {label: 'Building Reports', link: '/reports/buildings'},
                    {label: 'Deposit Refunds', link: '/reports/deposit-refunds'},
                    {label: 'Vacant Units', link: '/reports/vacant'},
                    {label: 'Occupied Units', link: '/reports/occupied'},
                    {label: 'Income Statement', link: '/reports/income'},
                    {label: 'Expenses', link: '/reports/expenses'},
                    {label: 'Tax Report', link: '/reports/taxes'},
                    // {label: 'Tenants Aging Report', link: '/invoices/aging'},
                    // {label: 'Landlord Aging Report', link: '/invoices/landlord-aging'},
                    {label: 'Land Aging Report', link: '/invoices/land-aging'},
                    {label: 'Profit & Loss', link: '/reports/profit-loss'},
                    // {label: 'Stk Push Logs', link: '/reports/stk-logs'},
                    {label: 'Trial Balance', link: '/reports/trial-balance'},
                    {label: 'Balance Sheet', link: '/reports/balance-sheet'},
                    {label: 'Landlord Statement', link: PATH_MANAGE_OWNERS.all},
                    {label: 'Agent Commissions', link: '/reports/commissions'},
                ]
            },
            {
                label: 'Settings',
                icon: IconSettings,
                links: [
                    {label: 'Access Control', link: "/settings/access-control"},
                    {label: 'Taxes', link: '/settings/taxes'},
                    {label: 'Assets', link: '/settings/assets'},
                    {label: 'Income', link: '/settings/income'},
                    {label: 'Liabilities', link: '/settings/liabilities'},
                    {label: 'Unit Types', link: "/settings/unit-types"},
                    {label: 'Zones', link: PATH_MANAGE_ZONES.all},
                    {label: 'Streets', link: PATH_MANAGE_STREETS.all},
                    {label: 'System Settings', link: '/settings/system'},
                ]
            },
           
        ]
    },
];

type NavigationProps = { onClose: () => void } & Omit<NavbarProps, 'children'>

const Navigation = ({onClose, ...others}: NavigationProps) => {
    const {classes, theme} = useStyles()
    const tablet_match = useMediaQuery('(max-width: 768px)');

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
