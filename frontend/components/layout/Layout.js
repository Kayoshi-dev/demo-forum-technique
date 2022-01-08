import {
    Container,
    Title,
    Group,
    Text,
    Menu,
    useMantineTheme,
    Skeleton,
    MediaQuery,
    Burger,
    Collapse,
} from "@mantine/core";
import Link from 'next/link';
import { useState } from "react";
import useSWR from "swr";
import { useNotifications } from '@mantine/notifications';
import { useEffect } from "react";
import { ChevronDownIcon } from "@modulz/radix-icons";
import { createStyles } from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {getApiUrl} from "../../lib/utils";

const query = `
    {
        categories {
            data {
                attributes {
                    title
                    slug
                }
                id
            }
        }
    }
`;

const useStyles = createStyles((theme) => {
    return {
        menuTitle: {
            fontSize: "5rem",
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
                fontSize: "3.2rem"
            },
        }
    }
});

export default function CustomNavbar({ children }) {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const notifications = useNotifications();
    const { classes } = useStyles();
    const superiorMedium = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);

    // Automatically close the burger if the user gets somehow a larger screen (maybe by switching to the landscape format I dunno stop reading that omg)
    if(superiorMedium && opened) {
        setOpened(false);
    }

    // Had some problems to make it work with Apollo sowwy (´；ω；`)
    const fetcher = async () => {
        const response = await fetch(getApiUrl(), {
            body: JSON.stringify({query}),
            headers: { "Content-type": "application/json" },
            method: "POST"
        });
        const { data } = await response.json();
        return data;
    };

    const { data: categories, error } = useSWR(query, fetcher, { refreshInterval: 15000, revalidateOnFocus: false });

    useEffect(() => {
        if(error) {
            notifications.showNotification({
                title: "Une erreur est survenue !",
                message: "Erreur lors du chargement des catégories du blog",
                color: "red"
            });
        }
    }, [error]); // (゜´Д｀゜)

    return (
        <Container size="xl" sx={(theme) => ({
            paddingTop: theme.spacing.md
        })}>
            <Group position="apart" sx={{ marginBottom: theme.spacing.xl }}>
                <Link href="/" passHref>
                    <Title order={1} className={classes.menuTitle} sx={(theme) => ({
                        '&:hover': {
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            color: theme.colors.blue[6],
                        },
                        transition: 'all .2s'
                    })}>Mon blog</Title>
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <MediaQuery largerThan="md" styles={{ display: 'none' }}>
                        <Burger
                            opened={opened}
                            onClick={() => setOpened((o) => !o)}
                            size="md"
                            color={theme.colors.dark[6]}
                            mr="xl"
                        />
                    </MediaQuery>
                </div>

                <MediaQuery smallerThan="md" styles={{ display: 'none' }}>
                    <Group position="apart" spacing="xl">
                        <Link href="/" passHref>
                            <Text component="a" weight={500}>
                                Accueil
                            </Text>
                        </Link>

                        <Menu control={<Text style={{ cursor: "pointer" }} component="a" weight={500}>Catégorie <ChevronDownIcon /></Text>}>
                            <Menu.Label>Nos catégories</Menu.Label>
                            {!categories ?
                                <Skeleton height={8} radius="xl" /> :
                                categories.categories.data.map(category => {
                                    return <Menu.Item component="a" href={`/categorie/${category.attributes.slug}`} key={category.id} >{category.attributes.title}</Menu.Item>
                                })
                            }
                        </Menu>

                        <Link href="/" passHref>
                            <Text component="a" weight={500}>
                                A propos
                            </Text>
                        </Link>
                    </Group>
                </MediaQuery>
            </Group>

            <Collapse in={opened}>
                <Group direction="column" sx={(theme) => ({
                  marginBottom: theme.spacing.lg
                })}>
                    <Link href="/" passHref>
                        <Text component="a" weight={500}>
                            Accueil
                        </Text>
                    </Link>

                    <Menu control={<Text style={{ cursor: "pointer" }} component="a" weight={500}>Catégorie <ChevronDownIcon /></Text>}>
                        <Menu.Label>Nos catégories</Menu.Label>
                        {!categories ?
                            <Skeleton height={8} radius="xl" /> :
                            categories.categories.data.map(category => (
                                <Menu.Item key={category.id}>
                                    <Link href={`/categorie/${category.attributes.slug}`}>
                                        <a>{category.attributes.title}</a>
                                    </Link>
                                </Menu.Item>

                            ))
                        }
                    </Menu>

                    <Link href="/" passHref>
                        <Text component="a" weight={500}>
                            A propos
                        </Text>
                    </Link>
                </Group>
            </Collapse>

            {children}
        </Container>
    );
}
