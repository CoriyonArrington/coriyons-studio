// src/app/(resources)/blog/[slug]/page.tsx
// - Updated to display tags on the blog post detail page.
// - Added tags to metadata keywords.
// NO 'use client' - Server Component

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { Box, VStack, Image, UnorderedList, ListItem, OrderedList, Code, Divider, chakra, HStack, Tag as ChakraTag } from '@chakra-ui/react'; 
import {
    getPostBySlug,
    getAllPublishedPosts, 
    // type PostDetail, // PostDetail removed
    // type PostCardItem, // PostCardItem removed
    // type PostContentJson, // PostContentJson removed
    type Tag 
} from '@/src/lib/data/posts'; 
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';

interface ContentBlock {
  type: string;
  data: any;
  id?: string;
}

const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header':
      const level = block.data.level && block.data.level >= 1 && block.data.level <= 6
                    ? `h${block.data.level}`
                    : 'h2';
      return <Heading as={level as any} size={level === 'h1' ? 'xl' : level === 'h2' ? 'lg' : 'md'} my={4}>{block.data.text}</Heading>;
    case 'paragraph':
      return <Text my={4} lineHeight="tall">{block.data.text}</Text>;
    case 'list':
      const ListComponent = block.data.style === 'ordered' ? OrderedList : UnorderedList;
      return (
        <ListComponent spacing={2} my={4} pl={5}>
          {block.data.items.map((item: string, index: number) => (
            <ListItem key={index}>{item}</ListItem>
          ))}
        </ListComponent>
      );
    case 'image':
      return (
        <VStack my={6} alignItems="center">
          <Image src={block.data.file?.url || block.data.url} alt={block.data.caption || 'Blog image'} maxW="full" borderRadius="md" />
          {block.data.caption && <Text as="caption" fontSize="sm" color="muted.foreground" mt={2}>{block.data.caption}</Text>}
        </VStack>
      );
    case 'code':
      return <Code display="block" whiteSpace="pre-wrap" p={4} borderRadius="md" my={4}>{block.data.code}</Code>;
    case 'markdown':
      return (
        <Box className="prose" maxW="full" my={4}>
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                {block.data.text || block.data.markdown || ''}
            </ReactMarkdown>
        </Box>
      );
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported block type: ${block.type}`, block.data);
        return <Box as="pre" p={3} borderWidth="1px" my={2} borderRadius="md" fontSize="xs" overflowX="auto" bg="gray.50"><code>{JSON.stringify(block, null, 2)}</code></Box>;
      }
      return null;
  }
};

const MarkdownComponents = {
  h1: (props: any) => <Heading as="h1" size="xl" my={6} {...props} />,
  h2: (props: any) => <Heading as="h2" size="lg" my={5} {...props} />,
  h3: (props: any) => <Heading as="h3" size="md" my={4} {...props} />,
  p: (props: any) => <Text my={4} lineHeight="tall" {...props} />,
  ul: (props: any) => <UnorderedList spacing={2} my={4} pl={5} {...props} />,
  ol: (props: any) => <OrderedList spacing={2} my={4} pl={5} {...props} />,
  li: (props: any) => <ListItem {...props} />,
  a: (props: any) => <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} {...props} />,
  code: (props: any) => { const { children, ...rest } = props; return <Code p={1} fontSize="0.9em" {...rest}>{children}</Code>; },
  pre: (props: any) => <Box as="pre" p={3} borderWidth="1px" my={4} borderRadius="md" overflowX="auto" bg="gray.50">{props.children}</Box>
};

interface PostDetailPageProps {
  params: { slug: string };
}

function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (_e) { return dateString; } // e renamed to _e
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const slug = params.slug;
  const [post, allPostsForNav] = await Promise.all([
    getPostBySlug(slug), 
    getAllPublishedPosts(1000) 
  ]);

  if (!post) {
    notFound();
  }

  let previousPostLink: PrevNextNavLinkInfo | undefined;
  let nextPostLink: PrevNextNavLinkInfo | undefined;

  if (allPostsForNav && allPostsForNav.length > 0) {
    const currentIndex = allPostsForNav.findIndex(p => p.slug === post.slug);
    if (currentIndex !== -1) {
      if (currentIndex + 1 < allPostsForNav.length) { // Older posts are typically at higher indices if sorted by newest first
        const olderPost = allPostsForNav[currentIndex + 1];
        previousPostLink = { 
          slug: olderPost.slug,
          title: olderPost.title,
          categoryLabel: "Older Post"
        };
      }
      if (currentIndex > 0) {
        const newerPost = allPostsForNav[currentIndex - 1];
        nextPostLink = { 
          slug: newerPost.slug,
          title: newerPost.title,
          categoryLabel: "Newer Post"
        };
      }
    }
  }

  const { title, published_at, featured_image_url, content, tags } = post; 
  const blocks = content?.blocks;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={6} alignItems="stretch" maxW="container.md" mx="auto">
          <VStack spacing={2} alignItems="center" textAlign="center" mb={2}> 
            <Heading as="h1" size="2xl" color="foreground">{title}</Heading>
            {published_at && (<Text fontSize="sm" color="muted.foreground">Published on {formatDate(published_at)}</Text>)}
            {tags && tags.length > 0 && (
              <HStack spacing={2} wrap="wrap" justifyContent="center" mt={3}>
                {tags.map((tag: Tag) => (
                  <ChakraTag key={tag.id} size="sm" variant="subtle" colorScheme="purple">
                    {tag.name}
                  </ChakraTag>
                ))}
              </HStack>
            )}
          </VStack>

          {featured_image_url && (
            <Box borderRadius="lg" overflow="hidden" boxShadow="md" mb={6}>
              <Image src={featured_image_url} alt={`Featured image for ${title}`} objectFit="cover" w="full" maxH={{base: "300px", md: "450px"}} />
            </Box>
          )}
          <Divider my={4}/>

          {blocks && Array.isArray(blocks) && blocks.length > 0 ? (
            blocks.map((block: ContentBlock, index: number) => (
              <BlockRenderer key={block.id || `block-${index}`} block={block} />
            ))
          ) : (
            <Text mt={4}>Content not available or in an unexpected format.</Text>
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

export async function generateMetadata(
  { params }: PostDetailPageProps,
  _parent: ResolvingMetadata // parent renamed to _parent
): Promise<Metadata> {
  const slug = params.slug;
  const post = await getPostBySlug(slug); 
  if (!post) { return { title: 'Blog Post Not Found' }; }
  return {
    title: `${post.title} | Blog | Coriyon's Studio`,
    description: post.excerpt || 'Read this blog post from Coriyon’s Studio.',
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.og_image_url ? [{ url: post.og_image_url }] : (post.featured_image_url ? [{url: post.featured_image_url}] : []),
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
    keywords: post.tags?.map(tag => tag.name).join(', '), 
  };
}