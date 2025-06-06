// src/app/(resources)/blog/[slug]/page.tsx

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import {
    Box,
    VStack,
    Image,
    UnorderedList,
    ListItem,
    OrderedList,
    Code as ChakraCodeComponent,
    Divider,
    chakra,
    HStack,
    Tag as ChakraTag,
    type HeadingProps,
    type ListItemProps,
    type LinkProps as ChakraLinkProps,
    type BoxProps
    // ChakraCodeProps removed as it was unused
} from '@chakra-ui/react';
import type { ComponentProps } from 'react'; // For deriving Chakra prop types

type UnorderedListProps = ComponentProps<typeof UnorderedList>;
type OrderedListProps = ComponentProps<typeof OrderedList>;

import {
    getPostBySlug,
    getAllPublishedPosts,
    type Tag,
    type PostDetail as RawPostDetail // Using actual PostDetail type from posts.ts
    // PostContentJson import removed as it was for context, not direct use
} from '@/src/lib/data/posts';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import ReactMarkdown, { type Components, type PluggableList } from 'react-markdown'; // Added PluggableList for remarkGfm
import remarkGfm from 'remark-gfm';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';
import type { Element } from 'hast';


// --- START TYPE DEFINITIONS (Specific to this page's rendering logic) ---

interface HeaderBlockData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}
interface ParagraphBlockData {  text: string; }
interface ListBlockData { style: 'ordered' | 'unordered'; items: string[]; }
interface ImageBlockDataFile { url?: string; }
interface ImageBlockData { file?: ImageBlockDataFile; url?: string; caption?: string; }
interface CodeBlockData { code: string; }
interface MarkdownBlockData { text?: string; markdown?: string; }
interface UnknownBlockData { [key: string]: unknown; }

interface BaseContentBlock<T extends string, D> {
  id?: string;
  type: T;
  data: D;
}
type ContentBlock =
  | BaseContentBlock<'header', HeaderBlockData>
  | BaseContentBlock<'paragraph', ParagraphBlockData>
  | BaseContentBlock<'list', ListBlockData>
  | BaseContentBlock<'image', ImageBlockData>
  | BaseContentBlock<'code', CodeBlockData>
  | BaseContentBlock<'markdown', MarkdownBlockData>
  | BaseContentBlock<string, UnknownBlockData>;

// Represents the structure of items within rawPost.content.blocks
interface RawCmsBlockContent {
    id?: unknown;
    type?: unknown;
    data?: any; // This is the 'any' from PostContentJson
    [key: string]: any; // To accommodate any other fields from CMS blocks
}

interface ProcessedPostContent { blocks?: ContentBlock[] | null; }
interface PostDetailResolved {
  slug: string;
  title: string;
  published_at?: string | null;
  featured_image_url?: string | null;
  content?: ProcessedPostContent | null;
  tags?: Tag[] | null;
  excerpt?: string | null;
  og_image_url?: string | null;
  author_id?: string | null;
}
interface PostNavigationItem { slug: string; title: string; }

// --- END TYPE DEFINITIONS ---

const BlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'header': {
      const data = block.data as HeaderBlockData;
      const text = typeof data.text === 'string' ? data.text : '';
      const level = typeof data.level === 'number' && data.level >= 1 && data.level <= 6 ? data.level : 2;
      const headingAs = `h${String(level)}` as 'h1'|'h2'|'h3'|'h4'|'h5'|'h6';
      let determinedSize: HeadingProps['size'];
      if (level === 1) determinedSize = 'xl'; else if (level === 2) determinedSize = 'lg'; else determinedSize = 'md';
      return <Heading as={headingAs} size={determinedSize} my={4}>{text}</Heading>;
    }
    case 'paragraph': {
      const data = block.data as ParagraphBlockData;
      const text = typeof data.text === 'string' ? data.text : '';
      return <Text my={4} lineHeight="tall">{text}</Text>;
    }
    case 'list': {
      const data = block.data as ListBlockData;
      const items = Array.isArray(data.items) ? data.items.filter(item => typeof item === 'string') : [];
      const ListChakraComponent = (typeof data.style === 'string' && data.style === 'ordered') ? OrderedList : UnorderedList;
      return (
        <ListChakraComponent spacing={2} my={4} pl={5}>
          {items.map((item: string, index: number) => (<ListItem key={index}>{item}</ListItem>))}
        </ListChakraComponent>
      );
    }
    case 'image': {
      const data = block.data as ImageBlockData;
      const fileUrl = (typeof data.file === 'object' && data.file && typeof data.file.url === 'string') ? data.file.url : undefined;
      const directUrl = typeof data.url === 'string' ? data.url : undefined;
      const imageUrl = fileUrl || directUrl;
      const caption = typeof data.caption === 'string' ? data.caption : undefined;
      if (!imageUrl) { /* ... error handling ... */ return null; }
      return (
        <VStack my={6} alignItems="center">
          <Image src={imageUrl} alt={caption || 'Blog image'} maxW="full" borderRadius="md" />
          {caption && <Text as="caption" fontSize="sm" color="muted.foreground" mt={2}>{caption}</Text>}
        </VStack>
      );
    }
    case 'code': {
      const data = block.data as CodeBlockData;
      const codeContent = typeof data.code === 'string' ? data.code : '';
      return <ChakraCodeComponent display="block" whiteSpace="pre-wrap" p={4} borderRadius="md" my={4}>{codeContent}</ChakraCodeComponent>;
    }
    case 'markdown': {
      const data = block.data as MarkdownBlockData;
      const textContent = typeof data.text === 'string' ? data.text : '';
      const markdownFieldContent = typeof data.markdown === 'string' ? data.markdown : '';
      const finalMarkdownContent = textContent || markdownFieldContent; // Fallback to empty string handled by ReactMarkdown
      return (
        <Box className="prose" maxW="full" my={4}>
            <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm] as PluggableList}>
                {finalMarkdownContent}
            </ReactMarkdown>
        </Box>
      );
    }
    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unsupported block type: ${block.type}`, block.data);
        return <Box as="pre" p={3} borderWidth="1px" my={2} borderRadius="md" fontSize="xs" overflowX="auto" bg="gray.100" color="gray.800"><code>{JSON.stringify(block, null, 2)}</code></Box>;
      }
      return null;
  }
};

// No custom CodeComponentPassedProps needed. Types will be inferred from react-markdown's Components type.
const MarkdownComponents: Components = {
  h1: ({ children, node, ...rest }) => <Heading as="h1" size="xl" my={6} {...rest}>{children}</Heading>,
  h2: ({ children, node, ...rest }) => <Heading as="h2" size="lg" my={5} {...rest}>{children}</Heading>,
  h3: ({ children, node, ...rest }) => <Heading as="h3" size="md" my={4} {...rest}>{children}</Heading>,
  p: ({ children, node, ...rest }) => <Text my={4} lineHeight="tall" {...rest}>{children}</Text>,
  ul: ({ children, node, ...rest }) => <UnorderedList spacing={2} my={4} pl={5} {...(rest as Omit<UnorderedListProps, 'children'>)}>{children}</UnorderedList>,
  ol: ({ children, node, ...rest }) => <OrderedList spacing={2} my={4} pl={5} {...(rest as Omit<OrderedListProps, 'children'>)}>{children}</OrderedList>,
  li: ({ children, node, ...rest }) => <ListItem {...(rest as Omit<ListItemProps, 'children'>)}>{children}</ListItem>,
  a: ({ children, node, href, ...rest }) => <chakra.a color="blue.500" _hover={{ textDecoration: 'underline' }} href={href} {...(rest as Omit<ChakraLinkProps, 'children' | 'href'>)}>{children}</chakra.a>,
  code: ({ node, inline, className, children, ...htmlProps }) => { // Props inferred from Components
    // node, inline, className, children are from react-markdown
    // htmlProps contains other valid HTML attributes for a <code> element
    return <ChakraCodeComponent p={1} fontSize="0.9em" className={className} {...htmlProps}>{children}</ChakraCodeComponent>;
  },
  pre: ({ children, node, ...rest }) => <Box as="pre" p={3} borderWidth="1px" my={4} borderRadius="md" overflowX="auto" bg="gray.50" {...(rest as Omit<BoxProps, 'children'>)}>{children}</Box>
};

interface PostDetailPageProps { params: { slug: string }; }

function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  try {
    if (isNaN(new Date(dateString).valueOf())) { return dateString; }
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (_e) { return dateString; }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const slug = params.slug;
  const rawPost: RawPostDetail | null = await getPostBySlug(slug);

  if (!rawPost) { notFound(); }

  let processedBlocks: ContentBlock[] | null = null;
  if (rawPost.content?.blocks && Array.isArray(rawPost.content.blocks)) {
    processedBlocks = rawPost.content.blocks.map((b: RawCmsBlockContent): ContentBlock => ({
        id: typeof b.id === 'string' ? b.id : undefined,
        type: typeof b.type === 'string' ? b.type : 'unknown_block_type', // Provide a default string
        data: b.data, // Pass 'any' data; BlockRenderer will assert and handle
    } as ContentBlock)); // Assert overall structure to ContentBlock
  }

  const post: PostDetailResolved = {
    slug: rawPost.slug, title: rawPost.title, published_at: rawPost.published_at,
    featured_image_url: rawPost.featured_image_url,
    content: rawPost.content ? { blocks: processedBlocks } : null,
    tags: rawPost.tags || [], excerpt: rawPost.excerpt, og_image_url: rawPost.og_image_url,
    author_id: rawPost.author_id,
  };

  const allPostsForNavData = await getAllPublishedPosts(1000);
  const allPostsForNav: PostNavigationItem[] = allPostsForNavData.map(p => ({ slug: p.slug, title: p.title }));

  let previousPostLink: PrevNextNavLinkInfo | undefined;
  let nextPostLink: PrevNextNavLinkInfo | undefined;
  if (allPostsForNav.length > 0) {
    const currentIndex = allPostsForNav.findIndex(p => p.slug === post.slug);
    if (currentIndex !== -1) {
      if (currentIndex + 1 < allPostsForNav.length) {
        const olderPost = allPostsForNav[currentIndex + 1];
        previousPostLink = { slug: olderPost.slug, title: olderPost.title, categoryLabel: "Older Post" };
      }
      if (currentIndex > 0) {
        const newerPost = allPostsForNav[currentIndex - 1];
        nextPostLink = { slug: newerPost.slug, title: newerPost.title, categoryLabel: "Newer Post" };
      }
    }
  }

  const { title, published_at, featured_image_url, content: processedContent, tags } = post;
  const blocksToRender = processedContent?.blocks;

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
                  <ChakraTag key={tag.id} size="sm" variant="subtle" colorScheme="purple">{tag.name}</ChakraTag>
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
          {Array.isArray(blocksToRender) && blocksToRender.length > 0 ? (
            blocksToRender.map((blockItem: ContentBlock, index: number) => (
              <BlockRenderer key={blockItem.id || `block-${index.toString()}`} block={blockItem} />
            ))
          ) : (<Text mt={4}>Content not available or in an unexpected format.</Text>)}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousPostLink} nextPage={nextPostLink} basePath="/blog" />
    </Layout>
  );
}

export async function generateMetadata( { params }: PostDetailPageProps, _parent: ResolvingMetadata ): Promise<Metadata> {
  const slug = params.slug;
  const postForMeta = await getPostBySlug(slug); // No assertion needed here

  if (!postForMeta) {
    return { title: 'Blog Post Not Found', description: 'The blog post you are looking for could not be found.' };
  }
  const postKeywords = postForMeta.tags?.map(tag => tag.name).filter(name => !!name).join(', ');
  return {
    title: `${postForMeta.title} | Blog | Coriyon's Studio`,
    description: postForMeta.excerpt || 'Read this blog post from Coriyon’s Studio.',
    openGraph: {
      title: postForMeta.title,
      description: postForMeta.excerpt || undefined,
      images: postForMeta.og_image_url ? [{ url: postForMeta.og_image_url }] : (postForMeta.featured_image_url ? [{url: postForMeta.featured_image_url}] : []),
      type: 'article',
      publishedTime: postForMeta.published_at || undefined,
    },
    keywords: postKeywords || undefined,
  };
}