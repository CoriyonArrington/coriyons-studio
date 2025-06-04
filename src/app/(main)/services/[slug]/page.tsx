// src/app/(main)/services/[slug]/page.tsx
// - Added section to display Related Testimonials for the service.

import Layout from '@/src/components/common/layout';
import Section from '@/src/components/common/section';
import { Heading, Text } from '@/src/components/typography';
import { 
    Box, VStack, Image, Tag, /* SimpleGrid, */ ListItem, UnorderedList, Divider, /* HStack, */ 
    Avatar 
} from '@chakra-ui/react'; // SimpleGrid and HStack removed
import { 
    UICard, /* UICardHeader, */ UICardBody, /* UICardHeading, */ UICardText /*, UICardFooter */ 
} from '@/src/components/ui/card'; // UICardHeader, UICardHeading, UICardFooter removed
import HeroCtaButton from '@/src/components/common/hero-cta-button';
import {
    getServiceBySlug,
    getAllServices,
    // type ServiceData, // ServiceData removed
    // type ServiceContentData // ServiceContentData removed
} from '@/src/lib/data/services';
import type { HomepageTestimonial } from '@/src/lib/data/testimonials'; 
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import PrevNextNavigation, { type NavLinkInfo as PrevNextNavLinkInfo } from '@/src/components/common/prev-next-navigation';

interface ServiceDetailPageProps {
  params: { slug: string };
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

  if (allServicesForNav && allServicesForNav.length > 0) {
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
  const details = content;

  return (
    <Layout>
      <Section as="article" py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
        <VStack spacing={10} alignItems="stretch" maxW="container.lg" mx="auto"> 
          {/* Main Service Details Section */}
          <VStack spacing={8} alignItems="stretch">
            <VStack spacing={2} alignItems="center" textAlign="center" mb={6}>
              <Heading as="h1" size="2xl" color="foreground">{title}</Heading>
              {offering_type ? (
                <Tag size="lg" colorScheme={offering_type === 'BUNDLE' ? 'purple' : 'teal'} mt={2}>
                  {offering_type === 'BUNDLE' ? 'Service Bundle' : 'Individual Service'}
                </Tag>
              ) : null}
            </VStack>

            {featured_image_url ? (
              <Box borderRadius="lg" overflow="hidden" boxShadow="md" mb={8} maxH="400px">
                <Image src={featured_image_url} alt={`Featured image for ${title}`} objectFit="cover" w="full" h="full" />
              </Box>
            ) : null}
            <Divider my={6} />

            {description ? (
              <Box mb={6} p={6} borderWidth="1px" borderRadius="md" borderColor="border">
                <Heading as="h2" size="lg" mb={3}>Summary</Heading>
                <Text fontSize="lg" whiteSpace="pre-line">{description}</Text>
              </Box>
            ) : null}
            
            {details ? (
              <Box p={6} borderWidth="1px" borderRadius="md" borderColor="border">
                <Heading as="h2" size="lg" mb={4}>Service Details</Heading>
                <VStack spacing={5} alignItems="stretch">
                  {details.price ? <Text><strong>Price:</strong> {details.price}</Text> : null}
                  {details.what_you_get ? <Box><Heading as="h3" size="md" mt={3} mb={1}>What You Get:</Heading><Text whiteSpace="pre-line">{details.what_you_get}</Text></Box> : null}
                  {details.turnaround ? <Box><Heading as="h3" size="md" mt={3} mb={1}>Typical Turnaround:</Heading><Text>{details.turnaround}</Text></Box> : null}
                  {details.capacity ? <Box><Heading as="h3" size="md" mt={3} mb={1}>Capacity/Slots:</Heading><Text>{details.capacity}</Text></Box> : null}
                  {details.guarantee ? <Box><Heading as="h3" size="md" mt={3} mb={1}>Our Guarantee:</Heading><Text whiteSpace="pre-line">{details.guarantee}</Text></Box> : null}
                  
                  {offering_type === 'BUNDLE' ? (
                    <>
                      {details.includes_summary ? <Box><Heading as="h3" size="md" mt={3} mb={1}>Includes:</Heading><Text whiteSpace="pre-line">{details.includes_summary}</Text></Box> : null}
                      {details.perfect_for ? <Box><Heading as="h3" size="md" mt={3} mb={1}>Perfect For:</Heading><Text whiteSpace="pre-line">{details.perfect_for}</Text></Box> : null}
                      {renderServiceListItems(details.use_cases, "Common Use Cases")}
                      {details.savings_summary ? <Text mt={3} color="green.600" fontWeight="medium">{details.savings_summary}</Text> : null}
                      {details.value_summary ? <Text mt={1} color="green.500" fontWeight="medium">{details.value_summary}</Text> : null}
                    </>
                  ) : null}

                  {(details.cta_text && details.cta_link) ? (
                    <Box pt={6} textAlign="center">
                      <HeroCtaButton href={details.cta_link} size="lg" colorScheme="blue">
                        {details.cta_text}
                      </HeroCtaButton>
                    </Box>
                  ) : null}
                </VStack>
              </Box>
            ) : null}
          </VStack>

          {/* Related Testimonials Section - NEW */}
          {relatedTestimonials && relatedTestimonials.length > 0 && (
            <Box mt={12} pt={8} borderTopWidth="1px" borderColor="border">
              <Heading as="h2" size="xl" mb={10} textAlign="center">
                What Our Clients Say
              </Heading>
              <VStack spacing={8} alignItems="stretch">
                {relatedTestimonials.map((testimonial: HomepageTestimonial) => (
                  <UICard key={testimonial.id} variant="outlineFilled" w="full" maxW="container.md" mx="auto" _hover={{ shadow: 'lg' }} transition="shadow 0.2s">
                    <UICardBody>
                      {testimonial.avatar_url && (
                        <Avatar name={testimonial.name} src={testimonial.avatar_url} mb={4} size="lg" />
                      )}
                      <UICardText fontSize="xl" fontStyle="italic" color="foreground" mb={4}>
                        &quot;{testimonial.quote}&quot;
                      </UICardText>
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
                    </UICardBody>
                  </UICard>
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

export async function generateMetadata( { params }: ServiceDetailPageProps, _parent: ResolvingMetadata ): Promise<Metadata> { // parent renamed to _parent
  const slug = params.slug;
  const service = await getServiceBySlug(slug); 
  if (!service) { return { title: 'Service Not Found' }; }
  const metaDescription = service.description || `Details about our ${service.title} service.`;
  // Simplified openGraph - ensure all properties are optional or correctly typed.
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