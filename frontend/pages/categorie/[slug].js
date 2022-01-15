import Head from "next/head";
import {Title, Image, Group, Text, Grid, useMantineTheme, createStyles, Skeleton, Container} from "@mantine/core";
import {gql} from "@apollo/client";
import client from "../../apollo-client";
import {formatDate, getEnvUrl} from "../../lib/utils";
import PostCard from "../../components/PostCard";
import Link from "next/link";
import MainCategoryCard from "../../components/MainCategoryCard";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";

// Hide the end of title if it's too long
const useStyles = createStyles((theme, _params, getRef) => {
    return {
        ellipsis: {
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",

            [`@media (min-width: ${theme.breakpoints.md}px) and (max-width: ${theme.breakpoints.lg}px)`]: {
                width: "240px"
            },
        },
    };
});

export default function Categorie({ firstPost, data }) {
    const { classes } = useStyles();
    const router = useRouter();

    if (router.isFallback) {
        return (
            <>
                <Skeleton height={45} width={500} mt={6} radius="md" />
                <Skeleton height={350} mt={6} radius="sm" />

                <Container>
                    <Skeleton height={40} width={450} mt={20} radius="xl" />
                    {[...Array(20)].map((_, i) => {
                        return (
                            <Skeleton key={i} height={12} mt={14} radius="xl" />
                        )
                    })}

                    <Skeleton height={12} mt={12} width="70%" radius="xl" />
                </Container>
            </>
        )
    }


    const MainCategoryCard = dynamic(
        () => import('../../components/MainCategoryCard'),
        {
            ssr: false
        }
    )

    return (
        <>
            <Head>
                <title>Catégorie</title>
                {/*<meta property="og:title" content={post.attributes.title} />*/}
                {/*<meta property="og:type" content="article" />*/}
                {/*<meta property="og:image" content={`http://localhost:1337${post.attributes.cover.data.attributes.url}`} />*/}
                {/*<meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />*/}
            </Head>

            <Title order={2} sx={(theme) => ({ fontSize: "3rem", marginBottom: theme.spacing.xl })}>{data.attributes.title}</Title>

            <Grid gutter="xl">
                <Grid.Col span={12} md={8}>
                    <MainCategoryCard firstPost={firstPost}/>

                    <Grid gutter="xl">
                        {data.attributes.posts.data.map(post =>
                            <Grid.Col span={12} sm={6} key={post.id}>
                                <PostCard key={post.id} post={post} />
                            </Grid.Col>
                        )}
                    </Grid>
                </Grid.Col>
                <Grid.Col span={12} md={4}>
                    <Title order={3} mb="md">Autres catégories</Title>
                        {data.attributes.posts.data.map(post =>
                            <Group key={post.id} mb="md" sx={theme => ({
                                padding: theme.spacing.sm,
                                borderRadius: theme.radius.md,
                                transition: "all .2s ease-in-out",
                                '&:hover': {
                                    backgroundColor: "white",
                                    boxShadow: theme.shadows.sm
                                }
                            })}>
                                <Link href={`/post/${post.attributes.slug}`} passHref>
                                    <Image
                                        component="a"
                                        height={75}
                                        width={75}
                                        radius="md"
                                        src={`${getEnvUrl()}${post.attributes.cover.data.attributes.url}`}
                                        withPlaceholder
                                    />
                                </Link>

                                <Link href={`/post/${post.attributes.slug}`}>
                                    <a style={{ textDecoration: "none" }}>
                                        <Text weight={500} className={classes.ellipsis}>{post.attributes.title}</Text>
                                        <Text sx={theme => ({color: theme.colors.gray[8]})} size="sm">{formatDate(post.attributes.publishedAt)}</Text>
                                    </a>
                                </Link>
                            </Group>
                        )}
                </Grid.Col>
            </Grid>
        </>
    )
}

export async function getStaticPaths() {
    const query = gql`
        query getCategories($pagination: PaginationArg) {
            categories(pagination: $pagination) {
                data {
                    attributes {
                        slug
                    }
                }
            }
        }
    `;

    const { data } = await client.query({
        query,
        variables: {
            pagination: {
                limit: 5
            },
        }
    });

    const paths = data.categories.data.map(obj => {
        return {
            params: {
                slug: `${obj.attributes.slug}`
            }
        }
    });

    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    // Gonna move this in an appropriate file really quick
    const query = gql`
        query Query($filters: CategoryFiltersInput) {
            categories(filters: $filters) {
                data {
                    attributes {
                        title
                        color
                        posts {
                            data {
                                id
                                attributes {
                                    title
                                    slug
                                    content
                                    publishedAt
                                    cover {
                                        data {
                                            attributes {
                                                url
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    const { data } = await client.query({
        query,
        variables: {
            filters: {
                slug: {
                    eq: params.slug
                }
            },
            sort: "publishedAt:DESC"
        }
    });

    const firstPost = data.categories.data[0].attributes.posts.data.shift();

    return {
        props: { firstPost, data: data.categories.data[0] },
        revalidate: 60
    }
}
