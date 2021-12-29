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
                            Posté le {new Date(post.attributes.publishedAt).toISOString()}
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
