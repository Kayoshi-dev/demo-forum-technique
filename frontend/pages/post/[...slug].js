import client from '../../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {Title, Text, Container, Image} from "@mantine/core"
import Head from 'next/head';

export default function Post({ post }) {
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

export async function getServerSideProps(context) {
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
                    eq: context.query.slug[0]
                }
            }
        }
    });

    return {
        props: { post: data.posts.data[0] }
    }
}
