import {
    ActionIcon, ActionIconProps,
    Button,
    Container,
    Divider,
    Flex,
    Group, Stack,
    Text,
    Title
} from '@mantine/core';
import useStyles from "./FooterNav.styles";
import {Logo} from "@/components";
import {
    IconBrandFacebook,
    IconBrandGithub,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandTwitter,
    IconWorld
} from "@tabler/icons-react";
import {useMediaQuery} from "@mantine/hooks";
import {PATH_DOCS} from "@/routes";

const ICON_SIZE = 18

const ACTION_ICON_PROPS: ActionIconProps = {
    size: "lg",
    color: "blue.3",
    variant: "transparent"
}

const FooterNav = () => {
    const {classes, theme} = useStyles();
    const mobile_match = useMediaQuery('(max-width: 425px)');

    return (
        <footer className={classes.footer}>
        </footer>
    );
}

export default FooterNav
