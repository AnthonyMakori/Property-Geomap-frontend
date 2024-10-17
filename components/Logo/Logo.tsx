import React from 'react';
import useStyles from "./Logo.styles";
import { Group, Text, UnstyledButton, UnstyledButtonProps } from "@mantine/core";
import Link from "next/link";
import Image from "next/image";

type LogoProps = {
    href?: string;
} & UnstyledButtonProps;

const Logo = ({ href, ...others }: LogoProps) => {
    const { classes } = useStyles();

    return (
        <UnstyledButton
            className={classes.logo}
            component={Link}
            href={href || "/"}
            aria-label="Go to homepage"
            {...others}
        >
            <Group spacing="xs">
            <Image
                                        src="/TechForge 1.PNG"
                                        alt="Options"
                                        height={54}
                                        width={54}
                                        style={{ width: 54, height: 54, borderRadius: '120px', cursor: 'pointer' }} 
                                    />
                <Text>TechStack</Text>
            </Group>
        </UnstyledButton>
    );
};

export default Logo;
