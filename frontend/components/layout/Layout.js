import {Container, Title} from "@mantine/core";
import { useState } from "react";
import { useMantineTheme } from "@mantine/core";
import Link from 'next/link';

export default function CustomNavbar({ children }) {
    const [opened, setOpened] = useState(false);

    const theme = useMantineTheme();

    return (
        <Container size="xl" sx={(theme) => ({
            paddingTop: theme.spacing.xl
        })}>
            <Link href="/" passHref>
                <Title order={1} style={{ fontSize: "5rem" }} sx={(theme) => ({
                    '&:hover': {
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: theme.colors.blue[6],
                    },
                    paddingBottom: theme.spacing.xl,
                    display: 'inline-block',
                    transition: 'all .3s'
                })}>Mon blog</Title>
            </Link>
            {children}
        </Container>
    );
}
