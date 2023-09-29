import {useState} from "react";
import {Group, Image, Menu, UnstyledButton,} from "@mantine/core";
import {IconChevronDown, IconPower} from "@tabler/icons-react";
import useStyles from "./LanguagePicker.styles";
import { useRouter } from "next/router";

const data = [
    {
        label: "Logout",
        image:
            "/1.png",
    },
];



type LanguagePickerProps = {
    type: "collapsed" | "expanded"
}

const LanguagePicker = ({type}: LanguagePickerProps) => {
    const router = useRouter();
    const [opened, setOpened] = useState(false);
    const {classes} = useStyles({opened});
    const [selected, setSelected] = useState(data[0]);

    const logout = () => {
        router.push('/auth/signin');
    }

    
    const items = data.map((item) => (
        <Menu.Item
            icon={<IconPower />}
            onClick={logout}
            key={item.label}
        >
            {item.label}
        </Menu.Item>
    ));

    return (
        <Menu
            radius="sm"
            withinPortal
            width={200}
        >
            <Menu.Target>
                <UnstyledButton className={classes.control}>
                    <Group spacing="xs">
                        <Image src={selected.image} width={32} height={32} radius="xl" alt="flag"/> 
                        {type === "expanded" && <span className={classes.label}>{selected.label}</span>}
                    </Group>
                    {type === "expanded" && <IconChevronDown size="1rem" className={classes.icon} stroke={1.5}/>}
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    );
}

export default LanguagePicker
