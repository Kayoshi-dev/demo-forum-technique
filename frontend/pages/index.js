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
    Box,
    Portal, Menu, Divider
} from '@mantine/core';
import client from '../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";

export default function Home({ firstPost, posts, categories }) {
    const theme = useMantineTheme();

    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    // Code golf here I come
    // Remove titles by filtering the lines starting with a # (which is a title in Markdown)
    const getDescription = content => content.split(/\r?\n/).filter(arr => arr).filter(el => !el.startsWith('#')).slice(0, 1).toString();

    const formatDate = date => new Date(date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <Grid>
            <Col span={12} md={7} mb="xl">
                <Link href={`/post/${encodeURIComponent(firstPost.attributes.slug)}`} passHref>
                    <Box component="a" sx={{
                        '&:hover': {
                            cursor: 'pointer'
                        }
                    }}>
                        <Image src={`http://localhost:1337${firstPost.attributes.cover.data.attributes.url}`} radius="sm" height={350} alt={firstPost.attributes.cover.data.attributes.alternativeText} withPlaceholder />
                    </Box>
                </Link>
            </Col>

            <Col span={12} md={5}>
                <Link href={`/post/${encodeURIComponent(firstPost.attributes.slug)}`} passHref>
                    <Box component="a" sx={{
                        textDecoration: "none"
                    }}>
                        <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
                            <Text color="gray">Publié le {formatDate(firstPost.attributes.publishedAt)}</Text>
                            <Badge variant="filled" color="red">Nouveau</Badge>
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
            </Col>

            {posts.map(post =>
                <Col span={12} sm={6} md={4} key={post.id}>
                    <Card shadow="sm" padding="lg" component="a" href={`/post/${encodeURIComponent(post.attributes.slug)}`}>
                        <Card.Section>
                            <Image src={`http://localhost:1337${post.attributes.cover.data.attributes.url}`} height={160} alt={post.attributes.cover.data.attributes.alternativeText} withPlaceholder />
                        </Card.Section>

                        <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                            <Text color="#898a8d" weight={500}>{post.attributes.title}</Text>
                            {post.attributes.category.data &&
                                <Badge color={post.attributes.category.data.attributes.color}>{post.attributes.category.data.attributes.title}</Badge>
                            }
                        </Group>

                        <Text size="sm" style={{color: secondaryColor, lineHeight: 1.5}}>
                            Posté le {formatDate(post.attributes.publishedAt)}
                        </Text>

                        <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                            Voir l&apos;article
                        </Button>
                    </Card>
                </Col>
            )}
        </Grid>
    );
}

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
            query PostsQuery {
                categories {
                    data {
                        attributes {
                            title
                        }
                    }
                }
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
                            createdAt
                            updatedAt
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
        props: { firstPost: reverse.shift(), posts: reverse, categories: data.categories.data },
        revalidate: 60
    }
}
