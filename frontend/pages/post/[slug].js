import client from '../../apollo-client';
import { gql } from '@apollo/client';
import ReactMarkdown from "react-markdown";
import {
    Title,
    Text,
    Container,
    Image,
    Skeleton,
    Group,
    Badge,
    Anchor,
    Button,
    useMantineTheme,
    List,
    Affix,
    Menu,
    Transition
} from "@mantine/core"
import Head from 'next/head';
import { useRouter } from 'next/router';
import slugify from "slugify";
import { Link2Icon, TwitterLogoIcon, ReaderIcon } from '@modulz/radix-icons';
import {useClipboard, useMediaQuery, useWindowScroll} from "@mantine/hooks";
import Link from "next/link"
import {getDescription, getEnvUrl} from "../../lib/utils";

export default function Post({ post }) {
    const router = useRouter();
    const clipboard = useClipboard({ timeout: 500 });
    const theme = useMantineTheme();
    const superiorMedium = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);
    const [scroll] = useWindowScroll();


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
        return getTitles().map((title) => title.replace(regexTitle, ''));
    }

    return (
        <>
            <Head>
                <title>{post.attributes.title}</title>
                <meta property="og:title" content={post.attributes.title} key="title" />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={`${getEnvUrl()}${post.attributes.cover.data.attributes.url}`} />
                <meta property="og:description" content={getDescription(post.attributes.content)} key="og:description" />
                <meta name="description" content={getDescription(post.attributes.content)} key="description" />
                {/*<meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />*/}
            </Head>

            <Group spacing="sm">
                <Text sx={theme => ({
                    color: theme.colors.gray[6],
                    fontWeight: 'bold'
                })}>Le {new Date(post.attributes.publishedAt).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                {post.attributes.category.data &&
                    <Badge color={post.attributes.category.data.attributes.color}>{post.attributes.category.data.attributes.title}</Badge>
                }
            </Group>
            <Title style={{
                fontSize: '2.8rem'
            }} sx={theme => ({
                paddingBottom: theme.spacing.sm
            })}>{post.attributes.title}</Title>
            <Image height={350} src={`${getEnvUrl()}${post.attributes.cover.data.attributes.url}`} alt={post.attributes.cover.data.attributes.alternativeText} sx={(theme) => ({ paddingBottom: theme.spacing.sm })} withPlaceholder />

            <Group position="right" sx={(theme) => ({
                marginBottom: theme.spacing.md
            })}>
                <Group spacing="sm">
                    <Button leftIcon={<Link2Icon />} onClick={() => clipboard.copy(window.location.href)} sx={(theme) => ({
                        backgroundColor: "#f7f8fc",
                        borderColor: theme.colors.dark[6],
                        color: theme.colors.dark[6],

                        '&:hover': {
                            backgroundColor: theme.colors.gray[2]
                        }
                    })}>
                        Copier le lien
                    </Button>

                    {superiorMedium ?
                        <Button leftIcon={<TwitterLogoIcon />} onClick={() => window.open(`https://twitter.com/intent/tweet?text=Jetez%20un%20coup%20d%27oeil%20a%20cet%20article%20%3A&url=${encodeURIComponent(window.location.href)}`)}>
                            Partager sur Twitter
                        </Button> :
                        <Button leftIcon={<TwitterLogoIcon />} styles={({
                            leftIcon: {
                                marginRight: 0,
                            },
                        })} onClick={() => window.open(`https://twitter.com/intent/tweet?text=Jetez%20un%20coup%20d%27oeil%20a%20cet%20article%20%3A&url=${encodeURIComponent(window.location.href)}`)} />
                    }
                </Group>
            </Group>

            <Container>
                <Title order={2}>Sommaire</Title>
                <List type="ordered">
                    {getTableOfContent().map((chapter, i) => <List.Item key={i}><Anchor href={`#${getTitles(true)[i]}`} sx={(theme) => ({
                        color: theme.colors.dark[6],
                        fontWeight: 600,
                        textDecoration: "none",

                        '&:hover': {
                            textDecoration: "underline"
                        }
                    })}>{chapter}</Anchor></List.Item>)}
                </List>
                <ReactMarkdown transformImageUri={(src => {
                    return `${getEnvUrl()}${src}`;
                })} components={{
                    // Pretty sure I can refactor this 😂
                    img: ({node, ...props}) => <Image {...props} />,
                    h1: ({node, ...props}) => <h1 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                    h2: ({node, ...props}) => <h2 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                    h3: ({node, ...props}) => <h3 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                    h4: ({node, ...props}) => <h4 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                    h5: ({node, ...props}) => <h5 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                    h6: ({node, ...props}) => <h6 id={slugify(node.children[0].value, { lower: true })} {...props} />,
                }}>
                    {post.attributes.content}
                </ReactMarkdown>
            </Container>

            <Affix position={{ bottom: 20, right: 20 }}>
                <Transition transition="slide-up" mounted={scroll.y > 700}>
                    {(transitionStyles) => (
                        <Menu style={transitionStyles} control={<Button type="button" leftIcon={<ReaderIcon />}>Sommaire</Button>}>
                            <Menu.Label>{post.attributes.title}</Menu.Label>
                            {/* Strange Behavior happening here with Anchor and a tag, but it works with Link, don't ask me why */}
                            {getTableOfContent().map((chapter, i) => <Menu.Item key={i}><Link href={`#${getTitles(true)[i]}`}><a style={{ color: "black", textDecoration: "none" }}>{chapter}</a></Link></Menu.Item>)}
                        </Menu>
                    )}
                </Transition>
            </Affix>
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
                        category {
                            data {
                                attributes {
                                    title
                                    color
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
