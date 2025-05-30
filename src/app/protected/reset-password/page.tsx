// src/app/protected/reset-password/page.tsx
import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/src/components/form-message"; // Assumes this is now Chakra-aligned
import { SubmitButton } from "@/src/components/submit-button";     // Assumes this now uses Chakra Button

// Import Chakra UI components
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>; // Keeping prop signature as provided
}) {
  const searchParams = await props.searchParams;

  return (
    <Container centerContent py={{ base: 8, md: 16 }} display="flex" flexDirection="column" flex="1">
      <VStack
        as="form" // Use VStack as the form element for Chakra layout
        action={resetPasswordAction}
        spacing={6} // Consistent spacing between major elements
        w="full"
        maxW="md" // Adjusted maxW for a typical form width
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
      >
        <Box textAlign="center" w="full">
          <Heading as="h1" size="lg" mb={1}>
            Reset Password
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Please enter your new password below.
          </Text>
        </Box>

        <VStack spacing={4} w="full" mt={4}> {/* Spacing for form fields */}
          <FormControl id="password-reset" isRequired> {/* Unique ID */}
            <FormLabel>New password</FormLabel>
            <Input
              type="password"
              name="password"
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </FormControl>

          <FormControl id="confirmPassword-reset" isRequired> {/* Unique ID */}
            <FormLabel>Confirm new password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </FormControl>

          <SubmitButton w="full" colorScheme="blue"> {/* SubmitButton uses Chakra Button */}
            Reset Password
          </SubmitButton>
          <FormMessage message={searchParams} mt={2} w="full" /> {/* FormMessage is Chakra-aligned */}
        </VStack>
      </VStack>
    </Container>
  );
}