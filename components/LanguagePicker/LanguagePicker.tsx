import { useState } from "react";
import { Group, Image, Menu, UnstyledButton } from "@mantine/core";
import { IconChevronDown, IconPower, IconUser } from "@tabler/icons-react";
import useStyles from "./LanguagePicker.styles";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

interface MenuItem {
    label: string;
    image?: string;
    action?: () => void;
}

const data: MenuItem[] = [
    {
        label: "Profile",
        action: () => {}, // Placeholder for profile navigation
    },
    {
        label: "Logout",
        image: "/TechForge 1.PNG" ,
        action: () => {}, // Placeholder for logout action
    },
];

type LanguagePickerProps = {
    type: "collapsed" | "expanded";
};

const LanguagePicker = ({ type }: LanguagePickerProps) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles({ opened });

    const signUserOut = () => {
        signOut({ callbackUrl: "/" });
    };

    // Navigate to the user's profile page
    const navigateToProfile = () => {
        router.push("/dashboard/Profiles/landlordProfile");
    };

    const items = data.map((item) => (
        <Menu.Item
            icon={item.label === "Profile" ? <IconUser /> : <IconPower />}
            onClick={item.label === "Profile" ? navigateToProfile : signUserOut}
            key={item.label}
            aria-label={`Go to ${item.label}`}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu radius="sm" withinPortal width={200}>
            <Menu.Target>
                <UnstyledButton className={classes.control} aria-label="Language picker">
                    <Group spacing="xs">
                        
                        <Image src={data[1].image} width={35} height={35} radius="xl" alt="User profile image" />
                        {type === "expanded" && <span className={classes.label}>{data[1].label}</span>}
                    </Group>
                    {type === "expanded" && <IconChevronDown size="1rem" className={classes.icon} stroke={1.5} />}
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
};

export default LanguagePicker;
