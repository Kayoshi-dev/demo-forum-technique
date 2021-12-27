import Head from 'next/head'
import { Card, Image, Text, Badge, Button, Group, Grid, Col, Container, useMantineTheme } from '@mantine/core';
import client from '../apollo-client';
import { gql } from '@apollo/client';

export default function Home({ posts }) {
    const theme = useMantineTheme();

    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    return (
        <Container size="xl">
            <h1>Mon blog</h1>
            <Grid>
                {posts.map(post =>
                    <Col span={4} key={post.id}>
                        <Card shadow="sm" padding="lg" component="a" href={`/post/${post.attributes.slug}`}>
                            <Card.Section>
                                <Image src={`http://localhost:1337${post.attributes.cover.data.attributes.url}`} height={160} alt="Alternative text"/>
                            </Card.Section>

                            <Group position="apart" style={{marginBottom: 5, marginTop: theme.spacing.sm}}>
                                <Text weight={500}>{post.attributes.title}</Text>
                                <Badge color="pink" variant="light">
                                    Nouveau!
                                </Badge>
                            </Group>

                            <Text size="sm" style={{color: secondaryColor, lineHeight: 1.5}}>
                                With Fjord Tours you can explore more of the magical fjord landscapes with tours and
                                activities on and around the fjords of Norway
                            </Text>

                            <Button variant="light" color="blue" fullWidth style={{marginTop: 14}}>
                                Book classic tour now
                            </Button>
                        </Card>
                    </Col>
                )}
            </Grid>
        </Container>
    );
}

export async function getStaticProps() {
    const { data } = await client.query({
        query: gql`
            query ExampleQuery {
              posts {
                data {
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
                    createdAt
                    updatedAt
                    publishedAt
                  }
                  id
                }
              }
            }
        `
    });

    return {
        props: { posts: data.posts.data },
        revalidate: 60
    }
}
