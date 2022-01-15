import {Box, Button, Group, Image, Paper, Text, Title, useMantineTheme} from "@mantine/core";
import Link from "next/link";
import {formatDate, getDescription, getEnvUrl} from "../lib/utils";
import {useMediaQuery} from "@mantine/hooks";
import {EyeOpenIcon} from "@modulz/radix-icons";
import PostCard from "./PostCard";

export default function MainCategoryCard({ firstPost }) {
    const theme = useMantineTheme();

    const superiorMedium = useMediaQuery(`(min-width: ${theme.breakpoints.md}px)`);
    const isSuperiorSmall = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`);

    return (
        <>
            {isSuperiorSmall ?
                <Paper mb="xl" shadow="sm" radius="md">
                    <Group position="apart" noWrap>
                        <Link href={`/post/${firstPost.attributes.slug}`} passHref>
                            <Box component="a">
                                <Image
                                    height={225}
                                    width={300}
                                    radius="md"
                                    alt={firstPost.attributes.cover.data.attributes.alternativeText}
                                    src={`${getEnvUrl()}${firstPost.attributes.cover.data.attributes.url}`}
                                    withPlaceholder
                                />
                            </Box>
                        </Link>

                        <Group direction="column" mr="sm">
                            <Link href={`/post/${firstPost.attributes.slug}`}>
                                <a style={{textDecoration: "none"}}>
                                    <Title order={2}>{firstPost.attributes.title}</Title>
                                </a>
                            </Link>
                            <Text mb="sm" lineClamp={3} sx={theme => ({
                                color: theme.colors.gray[7]
                            })}>
                                {getDescription(firstPost.attributes.content)}
                            </Text>
                            <Group position="apart" style={{width: "100%"}}>
                                <Text size="sm" sx={theme => ({color: theme.colors.gray[8]})}>
                                    Publié le {formatDate(firstPost.attributes.publishedAt)}
                                </Text>

                                {superiorMedium ?
                                    <Button component="a" href={`/post/${firstPost.attributes.slug}`} leftIcon={<EyeOpenIcon/>}>
                                        Voir l&apos;article
                                    </Button> :
                                    <Button component="a" href={`/post/${firstPost.attributes.slug}`} leftIcon={<EyeOpenIcon/>} styles={({
                                        leftIcon: {
                                            marginRight: 0,
                                        },
                                    })}/>
                                }
                            </Group>
                        </Group>
                    </Group>
                </Paper>
                :
                <PostCard post={firstPost}/>
            }
        </>
    )
}
