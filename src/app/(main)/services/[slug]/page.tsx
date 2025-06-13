import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import {
  Box,
  VStack,
  Image,
  Tag,
  ListItem,
  UnorderedList,
  Divider,
  Avatar,
  Card,
  CardBody,
  Heading,
  Text,
} from '@chakra-ui/react';
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
  getServiceBySlug,
  getAllServices,
} from '@/src/lib/data/services';
import type { HomepageTestimonial } from '@/src/lib/data/testimonials';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';

interface ServiceDetailPageProps {
  params: { slug: string };
}

// Local type for the 'content' JSON object
interface ServiceDetailsJson {
    price?: string;
    what_you_get?: string;
    turnaround?: string;
    capacity?: string;
    guarantee?: string;
    cta_text?: string;
    cta_link?: string;
    includes_summary?: string;
    perfect_for?: string;
    use_cases?: string[];
    savings_summary?: string;
    value_summary?: string;
}

const renderServiceListItems = (items: string[] | undefined, listHeading: string) => {
  if (!items || items.length === 0) return null;
  return (
    <Box mt={4}>
      <Heading as="h4" size="sm" mb={2} color="muted.foreground">{listHeading}</Heading>
      <UnorderedList spacing={1} pl={4}>
        {items.map((item, index) => (
          <ListItem key={index} fontSize="sm">{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = params;
  const [service, allServicesForNav] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices()
  ]);

  if (!service) {
    notFound();
  }

  let previousServiceLink: PrevNextNavLinkInfo | undefined;
  let nextServiceLink: PrevNextNavLinkInfo | undefined;

  if (allServicesForNav.length > 0) {
    const currentIndex = allServicesForNav.findIndex(s => s.slug === service.slug);
    if (currentIndex !== -1) {
      if (currentIndex > 0) {
        const prevService = allServicesForNav[currentIndex - 1];
        previousServiceLink = { slug: prevService.slug, title: prevService.title, categoryLabel: "Previous Service" };
      }
      if (currentIndex < allServicesForNav.length - 1) {
        const nextService = allServicesForNav[currentIndex + 1];
        nextServiceLink = { slug: nextService.slug, title: nextService.title, categoryLabel: "Next Service" };
      }
    }
  }

  const { title, description, offering_type, featured_image_url, content, relatedTestimonials } = service;
  const details = content as ServiceDetailsJson | null;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={10} alignItems="stretch" maxW="container.lg" mx="auto">
          {/* Main Service Details Section */}
          <VStack spacing={8} alignItems="stretch">
            <VStack spacing={2} alignItems="center" textAlign="center" mb={6}>
              <Heading as="h1" size="2xl" color="foreground">{title}</Heading>
              {offering_type && (
                <Tag size="lg" colorScheme={offering_type === 'BUNDLE' ? 'purple' : 'teal'} mt={2}>
                  {offering_type === 'BUNDLE' ? 'Service Bundle' : 'Individual Service'}
                </Tag>
              )}
            </VStack>

            {featured_image_url && (
              <Box borderRadius="lg" overflow="hidden" boxShadow="md" mb={8} maxH="400px">
                <Image src={featured_image_url} alt={`Featured image for ${title}`} objectFit="cover" w="full" h="full" />
              </Box>
            )}
            <Divider my={6} />

            {description && (
              <Box mb={6} p={6} borderWidth="1px" borderRadius="md" borderColor="border">
                <Heading as="h2" size="lg" mb={3}>Summary</Heading>
                <Text fontSize="lg" whiteSpace="pre-line">{description}</Text>
              </Box>
            )}
            
            {details && (
              <Box p={6} borderWidth="1px" borderRadius="md" borderColor="border">
                <Heading as="h2" size="lg" mb={4}>Service Details</Heading>
                <VStack spacing={5} alignItems="stretch">
                  {details.price && <Text><strong>Price:</strong> {details.price}</Text>}
                  {details.what_you_get && <Box><Heading as="h3" size="md" mt={3} mb={1}>What You Get:</Heading><Text whiteSpace="pre-line">{details.what_you_get}</Text></Box>}
                  {details.turnaround && <Box><Heading as="h3" size="md" mt={3} mb={1}>Typical Turnaround:</Heading><Text>{details.turnaround}</Text></Box>}
                  {details.capacity && <Box><Heading as="h3" size="md" mt={3} mb={1}>Capacity/Slots:</Heading><Text>{details.capacity}</Text></Box>}
                  {details.guarantee && <Box><Heading as="h3" size="md" mt={3} mb={1}>Our Guarantee:</Heading><Text whiteSpace="pre-line">{details.guarantee}</Text></Box>}
                  
                  {offering_type === 'BUNDLE' && (
                    <>
                      {details.includes_summary && <Box><Heading as="h3" size="md" mt={3} mb={1}>Includes:</Heading><Text whiteSpace="pre-line">{details.includes_summary}</Text></Box>}
                      {details.perfect_for && <Box><Heading as="h3" size="md" mt={3} mb={1}>Perfect For:</Heading><Text whiteSpace="pre-line">{details.perfect_for}</Text></Box>}
                      {renderServiceListItems(details.use_cases, "Common Use Cases")}
                      {details.savings_summary && <Text mt={3} color="green.600" fontWeight="medium">{details.savings_summary}</Text>}
                      {details.value_summary && <Text mt={1} color="green.500" fontWeight="medium">{details.value_summary}</Text>}
                    </>
                  )}

                  {(details.cta_text && details.cta_link) && (
                    <Box pt={6} textAlign="center">
                      <HeroCtaButton href={details.cta_link} size="lg" colorScheme="blue">
                        {details.cta_text}
                      </HeroCtaButton>
                    </Box>
                  )}
                </VStack>
              </Box>
            )}
          </VStack>

          {/* Related Testimonials Section */}
          {relatedTestimonials && relatedTestimonials.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                What Our Clients Say
              </Heading>
              <VStack spacing={8} alignItems="stretch">
                {relatedTestimonials.map((testimonial: HomepageTestimonial) => (
                  <Card key={testimonial.id} variant="outline" w="full" maxW="container.md" mx="auto" _hover={{ shadow: 'lg' }} transition="shadow 0.2s">
                    <CardBody>
                      {testimonial.avatar_url && (
                        <Avatar name={testimonial.name} src={testimonial.avatar_url} mb={4} size="lg" />
                      )}
                      <Text fontSize="xl" fontStyle="italic" color="foreground" mb={4}>
                        &quot;{testimonial.quote}&quot;
                      </Text>
                      <VStack alignItems="flex-end" spacing={0}>
                          <Text fontWeight="semibold" fontSize="md" color="foreground">
                            — {testimonial.name}
                          </Text>
                          {(testimonial.role || testimonial.company_name) && (
                              <Text fontSize="sm" color="muted.foreground">
                                  {testimonial.role}{testimonial.role && testimonial.company_name && ", "}{testimonial.company_name}
                              </Text>
                          )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </Box>
          )}
        </VStack>
      </Section>
      <PrevNextNavigation previousPage={previousServiceLink} nextPage={nextServiceLink} basePath="/services" />
    </Layout>
  );
}

export async function generateMetadata( { params }: ServiceDetailPageProps, _parent: ResolvingMetadata ): Promise<Metadata> {
  const slug = params.slug;
  const service = await getServiceBySlug(slug); 
  if (!service) { return { title: 'Service Not Found' }; }
  const metaDescription = service.description || `Details about our ${service.title} service.`;
  
  const openGraphData: Metadata['openGraph'] = {
    title: `${service.title} | Services`,
    description: metaDescription,
  };
  if (service.featured_image_url) {
    openGraphData.images = [{ url: service.featured_image_url }];
  }

  return {
    title: `${service.title} | Services | Coriyon's Studio`,
    description: metaDescription,
    openGraph: openGraphData,
  };
}