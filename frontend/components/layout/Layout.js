import {
    Container,
    Title,
    Group,
    Text,
    Menu,
    useMantineTheme,
    Skeleton
} from "@mantine/core";
import Link from 'next/link';
import {useState} from "react";
import useSWR from "swr";
import { useNotifications } from '@mantine/notifications';
import {useEffect} from "react";

const query = `
    {
        categories {
            data {
                attributes {
                    title
                }
                id
            }
        }
    }
`;

export default function CustomNavbar({ children }) {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();
    const notifications = useNotifications();

    // Had some problems to make it work with Apollo sowwy (´；ω；`)
    const fetcher = async () => {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL, {
            body: JSON.stringify({query}),
            headers: { "Content-type": "application/json" },
            method: "POST"
        });
        const { data } = await response.json();
        return data;
    };

    const { data: categories, error } = useSWR(query, fetcher, { refreshInterval: 5000, revalidateOnFocus: false });

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
                        <Menu.Label>Nos catégories</Menu.Label>
                        {!categories ?
                            <Skeleton height={8} radius="xl" /> :
                            categories.categories.data.map(category => <Menu.Item key={category.id}>{category.attributes.title}</Menu.Item>)
                        }
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
