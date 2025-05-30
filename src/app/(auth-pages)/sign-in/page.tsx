// src/app/(auth-pages)/sign-in/page.tsx
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/src/components/form-message";
import { SubmitButton } from "@/src/components/submit-button";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Text,
  VStack,
  HStack,
  Container,
} from "@chakra-ui/react";
import NextLink from "next/link"; // Corrected import for Next.js Link

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <Container centerContent py={{ base: 8, md: 16 }} display="flex" flexDirection="column" flex="1">
      <VStack
        as="form"
        action={signInAction}
        spacing={6}
        w="full"
        maxW="sm"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
      >
        <Box textAlign="center" w="full">
          <Heading as="h1" size="lg" mb={2}>
            Sign In
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Don&apos;t have an account?{" "}
            <ChakraLink as={NextLink} href="/sign-up" color="blue.500" fontWeight="medium">
              Sign up
            </ChakraLink>
          </Text>
        </Box>

        <VStack spacing={4} w="full" mt={4}>
          <FormControl id="email-signin" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormControl>

          <FormControl id="password-signin" isRequired>
            <HStack justifyContent="space-between" w="full">
              <FormLabel mb="0">Password</FormLabel>
              <ChakraLink
                as={NextLink}
                href="/forgot-password"
                fontSize="xs"
                color="blue.500"
                textAlign="right"
              >
                Forgot Password?
              </ChakraLink>
            </HStack>
            <Input
              name="password"
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </FormControl>

          <SubmitButton pendingText="Signing In..." w="full" colorScheme="blue">
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} mt={2} w="full" />
        </VStack>
      </VStack>
    </Container>
  );
}