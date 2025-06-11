// src/app/(resources)/blog/[slug]/page.tsx
import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  Box,
  VStack,
  Image,
  UnorderedList,
  ListItem,
  OrderedList,
  Divider,
  HStack,
  Tag as ChakraTag,
  type HeadingProps,
  Heading,
  Text,
} from '@chakra-ui/react';
import {
  getPostBySlug,
  getAllPublishedPosts,
  type Tag} from '@/src/lib/data/posts';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PrevNextNavigation, {
  type NavLinkInfo,
} from '@/src/components/common/prev-next-navigation';

// --- TYPES ---
type ContentBlockData = {
  text?: string;
  level?: number;
  items?: string[];
  style?: 'ordered' | 'unordered';
};

type ContentBlock = {
  id?: string;
  type: string;
  data: ContentBlockData;
};

function isContentBlock(block: unknown): block is ContentBlock {
  return (
    !!block &&
    typeof block === 'object' &&
    'type' in block &&
    'data' in block
  );
}

interface PostNavigationItem {
  slug: string;
  title: string;
}

// --- COMPONENTS ---
const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const { data, type } = block;

  switch (type) {
    case 'header': {
      const level =
        data.level && data.level >= 1 && data.level <= 6 ? data.level : 2;
      const headingAs = `h${String(
        level
      )}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      let determinedSize: HeadingProps['size'];
      if (level === 1) determinedSize = 'xl';
      else if (level === 2) determinedSize = 'lg';
      else determinedSize = 'md';
      return (
        <Heading as={headingAs} size={determinedSize} my={4}>
          {data.text || ''}
        </Heading>
      );
    }
    case 'paragraph': {
      return (
        <Text my={4} lineHeight="tall">
          {data.text || ''}
        </Text>
      );
    }
    case 'list': {
      const ListComponent =
        data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={2} my={4} pl={5}>
          {Array.isArray(data.items) &&
            data.items.map((item: string, index: number) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
        </ListComponent>
      );
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        return (
          <Box
            as="pre"
            p={3}
            borderWidth="1px"
            my={2}
            borderRadius="md"
            fontSize="xs"
            overflowX="auto"
            bg="gray.100"
            color="gray.800"
          >
            <code>{JSON.stringify(block, null, 2)}</code>
          </Box>
        );
      }
      return null;
  }
};

// --- PAGE ---
interface PostDetailPageProps {
  params: { slug: string };
}

function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function PostDetailPage({
  params,
}: PostDetailPageProps) {
  const slug = params.slug;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPostsForNavData = await getAllPublishedPosts(1000);
  const allPostsForNav: PostNavigationItem[] = allPostsForNavData.map((p) => ({
    slug: p.slug,
    title: p.title,
  }));

  let previousPostLink: NavLinkInfo | undefined;
  let nextPostLink: NavLinkInfo | undefined;

  const currentIndex = allPostsForNav.findIndex((p) => p.slug === post.slug);
  if (currentIndex !== -1) {
    if (currentIndex + 1 < allPostsForNav.length) {
      const olderPost = allPostsForNav[currentIndex + 1];
      previousPostLink = {
        slug: olderPost.slug,
        title: olderPost.title,
        categoryLabel: 'Older Post',
      };
    }
    if (currentIndex > 0) {
      const newerPost = allPostsForNav[currentIndex - 1];
      nextPostLink = {
        slug: newerPost.slug,
        title: newerPost.title,
        categoryLabel: 'Newer Post',
      };
    }
  }

  const { title, published_at, featured_image_url, content, tags } = post;
  const blocksToRender = content?.blocks;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={6} alignItems="stretch" maxW="container.md" mx="auto">
          <VStack
            spacing={2}
            alignItems="center"
            textAlign="center"
            mb={2}
          >
            <Heading as="h1" size="2xl" color="foreground">
              {title}
            </Heading>
            {published_at && (
              <Text fontSize="sm" color="muted.foreground">
                Published on {formatDate(published_at)}
              </Text>
            )}
            {tags.length > 0 && (
              <HStack
                spacing={2}
                wrap="wrap"
                justifyContent="center"
                mt={3}
              >
                {tags.map((tag: Tag) => (
                  <ChakraTag
                    key={tag.id}
                    size="sm"
                    variant="subtle"
                    colorScheme="purple"
                  >
                    {tag.name}
                  </ChakraTag>
                ))}
              </HStack>
            )}
          </VStack>
          {featured_image_url && (
            <Box
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              mb={6}
            >
              <Image
                src={featured_image_url}
                alt={`Featured image for ${title}`}
                objectFit="cover"
                w="full"
                maxH={{ base: '300px', md: '450px' }}
              />
            </Box>
          )}
          <Divider my={4} />
          {Array.isArray(blocksToRender) && blocksToRender.length > 0 ? (
            blocksToRender
              .filter(isContentBlock)
              .map((blockItem) => (
                <BlockRenderer
                  key={blockItem.id ?? blockItem.type}
                  block={blockItem}
                />
              ))
          ) : (
            <Text mt={4}>
              Content not available or in an unexpected format.
            </Text>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation
        previousPage={previousPostLink}
        nextPage={nextPostLink}
        basePath="/blog"
      />
    </Layout>
  );
}

// --- METADATA ---
export async function generateMetadata(
  { params }: PostDetailPageProps,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const postForMeta = await getPostBySlug(slug);

  if (!postForMeta) {
    return {
      title: 'Blog Post Not Found',
      description:
        'The blog post you are looking for could not be found.',
    };
  }
  const postKeywords = postForMeta.tags.map((tag) => tag.name).join(', ');
  return {
    title: `${postForMeta.title} | Blog | Coriyon's Studio`,
    description:
      postForMeta.excerpt || 'Read this blog post from Coriyon’s Studio.',
    openGraph: {
      title: postForMeta.title,
      description: postForMeta.excerpt || undefined,
      images: postForMeta.og_image_url
        ? [{ url: postForMeta.og_image_url }]
        : postForMeta.featured_image_url
        ? [{ url: postForMeta.featured_image_url }]
        : [],
      type: 'article',
      publishedTime: postForMeta.published_at || undefined,
    },
    keywords: postKeywords || undefined,
  };
}
