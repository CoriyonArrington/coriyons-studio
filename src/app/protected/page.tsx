// src/app/protected/page.tsx
"use client"; // <--- Add this line to make it a Client Component

import { createClient } from "@/src/utils/supabase/client"; // Use client-side Supabase client
import { InfoIcon as LucideInfoIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // For client-side redirect
import { useEffect, useState } from "react"; // For client-side data fetching and state
import type { User } from "@supabase/supabase-js";

// Import Chakra UI components
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Heading,
  VStack,
  Text,
  Container,
  Spinner, // For loading state
  // Code, // Not used in the primary version
} from "@chakra-ui/react";

export default function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient(); // Create client-side instance
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push('/sign-in'); // Redirect to sign-in if not authenticated
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <Container centerContent py={10} flex="1">
        <Spinner size="xl" />
        <Text mt={4}>Loading protected content...</Text>
      </Container>
    );
  }

  if (!user) {
    // This typically won't be reached if redirect works, but good for robustness
    return null; 
  }

  return (
    <Container maxW="container.lg" py={{ base: 6, md: 10 }} flex="1" w="full">
      <VStack spacing={8} align="stretch">
        <Alert status="info" borderRadius="md" variant="subtle">
          <AlertIcon as={LucideInfoIcon} />
          <AlertDescription fontSize="sm">
            This is a protected page that you can only see as an authenticated user.
          </AlertDescription>
        </Alert>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Your User Details
          </Heading>
          <Box
            as="pre"
            p={4}
            borderWidth="1px"
            borderRadius="md"
            bg="gray.50"
            _dark={{ bg: "gray.700" }}
            maxH="200px"
            overflow="auto"
            fontSize="xs"
            fontFamily="mono"
          >
            {JSON.stringify(user, null, 2)}
          </Box>
        </Box>

        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Further Information
          </Heading>
          <Text>
            Welcome, {user.email}! More content will be available here soon.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
}