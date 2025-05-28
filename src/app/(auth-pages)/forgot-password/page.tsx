// src/app/(auth-pages)/forgot-password/page.tsx
import { forgotPasswordAction } from "@/app/actions";
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
  Container,
} from "@chakra-ui/react";
import NextLink from "next/link"; // Corrected import for Next.js Link
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;

  return (
    <Container centerContent py={{ base: 8, md: 16 }} display="flex" flexDirection="column" flex="1">
      <VStack
        as="form"
        action={forgotPasswordAction}
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
            Reset Password
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Already have an account?{" "}
            <ChakraLink as={NextLink} href="/sign-in" color="blue.500" fontWeight="medium">
              Sign in
            </ChakraLink>
          </Text>
        </Box>

        <VStack spacing={4} w="full" mt={4}>
          <FormControl id="email-forgot" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormControl>

          <SubmitButton w="full" colorScheme="blue">
            Send Reset Link
          </SubmitButton>
          <FormMessage message={searchParams} mt={2} w="full" />
        </VStack>
      </VStack>
      <SmtpMessage />
    </Container>
  );
}