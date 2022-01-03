import {
    Container,
    Title,
    Group, Text, Menu, Divider, MediaQuery, Burger, useMantineTheme
} from "@mantine/core";
import Link from 'next/link';
import {useState} from "react";
import client from "../../apollo-client";
import {gql} from "@apollo/client";

export default function CustomNavbar({ children }) {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();

    return (
        <Container size="xl" sx={(theme) => ({
            paddingTop: theme.spacing.md
        })}>
            <Group position="apart">
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

                <Group position="apart" spacing="xl">
                    <Link href="/" passHref>
                        <Text component="a" weight={500}>
                            Accueil
                        </Text>
                    </Link>

                    <Menu control={<Text style={{ cursor: "pointer" }} component="a" weight={500}>Catégorie</Text>}>
                        {/*{categories.map(category => <Menu.Item key={category.id}>{category.attributes.title}</Menu.Item>)}*/}
                        <Menu.Item
                            rightSection={<Text size="xs" color="dimmed">⌘K</Text>}
                        >
                            Search
                        </Menu.Item>

                        <Divider />

                        <Menu.Label>Danger zone</Menu.Label>
                        <Menu.Item>Transfer my data</Menu.Item>
                        <Menu.Item color="red">Delete my account</Menu.Item>
                    </Menu>

                    <Link href="/" passHref>
                        <Text component="a" weight={500}>
                            A propos
                        </Text>
                    </Link>
                </Group>
            </Group>

            {children}
        </Container>
    );
}
