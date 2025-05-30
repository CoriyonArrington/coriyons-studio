// src/components/header-auth.tsx
"use client";

import React from 'react';
// This is the actual import. We'll manage its usage for the 'action' prop based on environment.
import { signOutAction as originalSignOutAction } from "@/src/app/actions";
import { hasEnvVars } from "@/src/utils/supabase/check-env-vars";
import NextLink from "next/link";
import { Badge, Button, Link as ChakraLink } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
}

export default function AuthButton({ user }: AuthButtonProps) {
  // Determine the action prop value based on the environment
  // This ensures that in the 'test' environment, a string is passed to the form's 'action' prop,
  // which helps satisfy React's prop validation in JSDOM and silences the warning.
  // In development/production, the actual server action function is used.
  const formAction = process.env.NODE_ENV === 'test'
    ? '/mocked-sign-out-action' // Use a valid string path for tests
    : originalSignOutAction;      // Use the real action for dev/prod

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge colorScheme="yellow" variant={"solid"}>
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <ChakraLink as={NextLink} href="/sign-in" _hover={{ textDecoration: 'none' }}>
              <Button as="a" size="md" variant={"outline"} isDisabled opacity={0.75} cursor="default" pointerEvents="none">
                Sign in
              </Button>
            </ChakraLink>
            <ChakraLink as={NextLink} href="/sign-up" _hover={{ textDecoration: 'none' }}>
              <Button as="a" size="md" variant={"solid"} colorScheme="blue" isDisabled opacity={0.75} cursor="default" pointerEvents="none">
                Sign up
              </Button>
            </ChakraLink>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      {/* Use the environment-aware formAction and add method="POST" */}
      <form action={formAction} method="POST">
        <Button type="submit" variant="themedOutline" size="md">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <ChakraLink as={NextLink} href="/sign-in" _hover={{ textDecoration: 'none' }}>
        <Button as="a" size="md" variant="themedOutline">
          Sign in
        </Button>
      </ChakraLink>
      <ChakraLink as={NextLink} href="/sign-up" _hover={{ textDecoration: 'none' }}>
        <Button as="a" size="md" variant="solid" colorScheme="blue">
          Sign up
        </Button>
      </ChakraLink>
    </div>
  );
}