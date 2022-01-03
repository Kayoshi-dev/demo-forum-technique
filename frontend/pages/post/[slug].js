import client from '../../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {Title, Text, Container, Image, Skeleton} from "@mantine/core"
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Post({ post }) {
    const router = useRouter()

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

    return (
        <>
            <Head>
                <title>{post.attributes.title}</title>
                <meta property="og:title" content={post.attributes.title} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={`http://localhost:1337${post.attributes.cover.data.attributes.url}`} />
                {/*<meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />*/}
            </Head>

            <Text sx={theme => ({
                color: theme.colors.gray[6],
                fontWeight: 'bold'
            })}>Le {new Date(post.attributes.publishedAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            <Title style={{
                fontSize: '2.8rem'
            }} sx={theme => ({
                paddingBottom: theme.spacing.sm
            })}>{post.attributes.title}</Title>
            <Image height={350} src={`http://localhost:1337${post.attributes.cover.data.attributes.url}`} alt={post.attributes.cover.data.attributes.alternativeText} withPlaceholder />
            <Container>
                <ReactMarkdown transformImageUri={(src => {
                    return `http://localhost:1337${src}`;
                })} components={{
                    img: ({node, ...props}) => <Image {...props} />
                }}>
                    {post.attributes.content}
                </ReactMarkdown>
            </Container>
        </>
    )
}

export async function getStaticPaths() {
    const query = gql`
        query getLastSlugs($pagination: PaginationArg) {
          posts(pagination: $pagination) {
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
                limit: 3
            }
        }
    });

    const paths = data.posts.data.map(obj => {
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

export async function getStaticProps(context) {
    const query = gql`
        query Posts($filters: PostFiltersInput) {
            posts(filters: $filters) {
                data {
                    attributes {
                        title
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
    `

    const { data } = await client.query({
        query,
        variables: {
            filters: {
                slug: {
                    eq: context.params.slug
                }
            }
        }
    });

    return {
        props: { post: data.posts.data[0] },
        revalidate: 10
    }
}
