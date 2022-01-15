import {Badge, Card, Group, Image, Space, Text, useMantineTheme} from "@mantine/core";
import Link from "next/link";
import {formatDate, getDescription, getEnvUrl} from "../lib/utils";
import {CalendarIcon} from "@modulz/radix-icons";

export default function PostCard({ post }) {
    const theme = useMantineTheme();

    const secondaryColor = theme.colorScheme === 'dark'
        ? theme.colors.dark[1]
        : theme.colors.gray[7];

    return (
        <Card padding="lg" style={{ backgroundColor: "transparent" }} radius="md">
            <Card.Section>
                <Link href={`/post/${encodeURIComponent(post.attributes.slug)}`}>
                    <a>
                        <Image src={`${getEnvUrl()}${post.attributes.cover.data.attributes.url}`} height={250} alt={post.attributes.cover.data.attributes.alternativeText} radius="md" sx={theme => ({
                            transition: "all .2s ease-in-out",
                            '&:hover': {
                                boxShadow: theme.shadows.xl
                            }
                        })} withPlaceholder />
                    </a>
                </Link>
            </Card.Section>

            <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
                <Link href={`/post/${encodeURIComponent(post.attributes.slug)}`}>
                    <a style={{ textDecoration: "none" }}>
                        <Text weight={600} size="lg">{post.attributes.title}</Text>
                    </a>
                </Link>
                {post.attributes.category?.data &&
                    <Badge color={post.attributes.category.data.attributes.color}>{post.attributes.category.data.attributes.title}</Badge>
                }
            </Group>

            <Text size="sm" style={{color: secondaryColor, lineHeight: 1.5}} lineClamp={2}>
                {getDescription(post.attributes.content)}
            </Text>

            <Space />

            <Text size="sm" sx={theme => ({color: theme.colors.gray[8]})}>
                <CalendarIcon /> Posté le {formatDate(post.attributes.publishedAt)}
            </Text>
        </Card>
    )
}
