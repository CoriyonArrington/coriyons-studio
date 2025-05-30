// src/app/(auth-pages)/sign-up/page.tsx
import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/src/components/forms/form-message";
import { SubmitButton } from "@/src/components/forms/submit-button";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  Text,
  VStack,
  Container,
  Center,
} from "@chakra-ui/react";
import NextLink from "next/link"; // Corrected import for Next.js Link
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  if ("message" in searchParams && !("success" in searchParams) && !("error" in searchParams) && searchParams.message) {
    return (
      <Container centerContent py={{ base: 8, md: 16 }} flex="1">
        <Center h="full" w="full" maxW="md">
          <FormMessage message={searchParams} />
        </Center>
      </Container>
    );
  }

  return (
    <Container centerContent py={{ base: 8, md: 16 }} display="flex" flexDirection="column" flex="1">
      <VStack
        as="form"
        action={signUpAction}
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
            Create Account
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <ChakraLink as={NextLink} href="/sign-in" color="blue.500" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </Box>

        <VStack spacing={4} w="full" mt={4}>
          <FormControl id="email-signup" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormControl>

          <FormControl id="password-signup" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Your password (min. 6 characters)"
              minLength={6}
              autoComplete="new-password"
            />
          </FormControl>

          <SubmitButton pendingText="Signing up..." w="full" colorScheme="blue">
            Sign up
          </SubmitButton>
          {("success" in searchParams || "error" in searchParams || ("message" in searchParams && searchParams.message)) && (
             <FormMessage message={searchParams} mt={2} w="full" />
          )}
        </VStack>
      </VStack>
      <SmtpMessage />
    </Container>
  );
}