import client from '../../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {Container, Title} from "@mantine/core"

export default function Post({ post }) {
    return (
        <Container size="xl">
            <Title>{post.attributes.title}</Title>
            <ReactMarkdown>
                {post.attributes.content}
            </ReactMarkdown>
        </Container>
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
