import client from '../../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {Title, Text, Container, Image, Skeleton, Grid, Center, Group} from "@mantine/core"
import Head from 'next/head';
import { useRouter } from 'next/router';
import slugify from "slugify";

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

    // This regex identifies string starting by one or six # followed by a space
    const regexTitle = new RegExp('^#{1,6}\\s');

    /*
    * Return an Array of titles
    * If toSlug is true, returns an Array of slugified titles
     */
    const getTitles = (toSlug) => {
        const titles = post.attributes.content.split(/\r?\n/).filter(arr => arr).filter(el => new RegExp(regexTitle).test(el));
        if (toSlug) {
            return titles.map(title => slugify(title, { lower: true }));
        } else {
            return titles;
        }
    }

    // Returns an array of indexed titles
    const getTableOfContent = () => {
        return getTitles().map((title, i) => title.replace(regexTitle, `${i + 1}. `));
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
            <Grid sx={(theme) => ({
                marginLeft: theme.spacing.xl
            })}>
                <Grid.Col span={9}>
                    <ReactMarkdown transformImageUri={(src => {
                        return `http://localhost:1337${src}`;
                    })} components={{
                        // Pretty sure I can refactor this 😂
                        img: ({node, ...props}) => <Image {...props} />,
                        h1: ({node, ...props}) => <h1 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                        h2: ({node, ...props}) => <h2 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                        h3: ({node, ...props}) => <h3 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                        h4: ({node, ...props}) => <h4 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                        h5: ({node, ...props}) => <h5 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                        h6: ({node, ...props}) => <h6 id={slugify(node.children[0].value, { lower: true})} {...props} />,
                    }}>
                        {post.attributes.content}
                    </ReactMarkdown>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Center sx={(theme) => ({
                        marginTop: theme.spacing.xl
                    })}>
                        <Group direction="column">
                            {getTableOfContent().map((chapter, i) => <a href={`#${getTitles(true)[i]}`} key={i}>{chapter}</a>)}
                        </Group>
                    </Center>
                </Grid.Col>
            </Grid>
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
        revalidate: 60
    }
}
