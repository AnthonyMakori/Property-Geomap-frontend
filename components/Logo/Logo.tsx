import React from 'react';
import useStyles from "./Logo.styles";
import {Group, Text, UnstyledButton, UnstyledButtonProps} from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

type LogoProps = {
    href?: string
} & UnstyledButtonProps

const Logo = ({href, ...others}: LogoProps) => {
    const {classes} = useStyles();

    return (
        <UnstyledButton className={classes.logo} component={Link} href={href || "/"} {...others}>
            <Group spacing="xs">
                <Image src="/favicon.png" height={34} width={34} alt="Ilovalue logo"/>
                <Text>Ilovalue</Text>
            </Group>
        </UnstyledButton>
    );
};

export default Logo;
