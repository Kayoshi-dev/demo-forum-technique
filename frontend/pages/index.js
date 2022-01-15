import Link from 'next/link';
import {
    Card,
    Image,
    Text,
    Badge,
    Button,
    Group,
    Grid,
    Col,
    useMantineTheme,
    Title,
    Box, Space
} from '@mantine/core';
import client from '../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {formatDate, getDescription, getEnvUrl} from "../lib/utils";
import { CalendarIcon } from "@modulz/radix-icons";
import PostCard from "../components/PostCard";

export default function Home({ firstPost, posts }) {
    const theme = useMantineTheme();

    return (
        <>
            <Grid sx={() => ({ marginBottom: "50px" })}>
                <Grid.Col span={12} md={7} mb="xl">
                    <Link href={`/post/${encodeURIComponent(firstPost.attributes.slug)}`} passHref>
                        <Box component="a" sx={{
                            '&:hover': {
                                cursor: 'pointer'
                            }
                        }}>
                            <Image src={`${getEnvUrl()}${firstPost.attributes.cover.data.attributes.url}`} radius="md" height={350} alt={firstPost.attributes.cover.data.attributes.alternativeText} sx={{ boxShadow: theme.shadows.sm }} withPlaceholder />
                        </Box>
                    </Link>
                </Grid.Col>

                <Grid.Col span={12} md={5}>
                    <Link href={`/post/${encodeURIComponent(firstPost.attributes.slug)}`} passHref>
                        <Box component="a" sx={{
                            textDecoration: "none"
                        }}>
                            <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
                                <Text color="gray">Publié le {formatDate(firstPost.attributes.publishedAt)}</Text>
                                <Group spacing="sm">
                                    {firstPost.attributes.category.data &&
                                        <Badge color={firstPost.attributes.category.data.attributes.color}>{firstPost.attributes.category.data.attributes.title}</Badge>
                                    }
                                    <Badge variant="filled" color="red">Nouveau</Badge>
                                </Group>
                            </Group>
                            <Title style={{ fontSize: "3rem" }} sx={(theme) => ({
                                paddingBottom: theme.spacing.lg,
                                display: 'inline-block',
                                '&:hover': {
                                    textDecoration: "underline"
                                }
                            })}>{firstPost.attributes.title}</Title>
                        </Box>
                    </Link>
                    <ReactMarkdown components={{
                        p: ({node, ...props}) => <Text size="md" lineClamp={7} {...props} />
                    }}>
                        {getDescription(firstPost.attributes.content)}
                    </ReactMarkdown>
                </Grid.Col>
            </Grid>

            <Grid gutter="xl">
                {posts.map(post =>
                    <Grid.Col span={12} sm={6} key={post.id}>
                        <PostCard post={post} />
                    </Grid.Col>
                )}
            </Grid>
        </>
    );
}

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
            query PostsQuery {
                posts {
                    data {
                        id
                        attributes {
                            title
                            content
                            cover {
                                data {
                                    attributes {
                                        url
                                    }
                                }
                            }
                            slug
                            category {
                                data {
                                    attributes {
                                        title
                                        color
                                    }
                                }
                            }
                            publishedAt
                        }
                    }
                }
            }
        `
    });

    // I'm sorry for the next lines, I should sort on the GraphQL query, but I'm unsure on how to do that
    const reverse = data.posts.data.reverse();

    return {
        props: { firstPost: reverse.shift(), posts: reverse },
        revalidate: 60
    }
}
