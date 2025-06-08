/*
 FINAL VERSION - Key Changes:
 - Fixed the "Parenthesized expression cannot be empty" syntax error.
 - The "Sign Up" button now uses the `useColorModeValue` hook to switch its variant.
 - It will be `solid` in light mode and `outline` in dark mode, ensuring it is
   always accessible and looks great on the header.
*/
'use client';

import React from 'react';
import { signOutAction as originalSignOutAction } from "@/src/app/actions";
import { hasEnvVars } from "@/src/utils/supabase/check-env-vars";
import NextLink from "next/link";
import { Badge, Button, Text, Link as ChakraLink, useColorModeValue } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
}

const getFirstName = (user: User | null): string | null => {
  if (!user) return null;
  const fullName =
    (user.user_metadata?.name as string) ||
    (user.user_metadata?.full_name as string);
  const firstName = user.user_metadata?.first_name as string;
  if (firstName) return firstName;
  if (fullName) return fullName.split(" ")[0];
  return null;
};

export default function AuthButton({ user }: AuthButtonProps) {
  const isTestAction = process.env.NODE_ENV === "test";
  const actionProp = isTestAction ? "/mocked-sign-out-action" : originalSignOutAction;
  const displayName = getFirstName(user);
  
  // Define the button variant based on the color mode for accessibility
  const signUpButtonVariant = useColorModeValue("solid", "outline");

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <div>
          <Badge colorScheme="yellow" variant={"solid"}>
            Please update .env.local file with anon key and url
          </Badge>
        </div>
        {/* Fallback buttons if env vars are missing */}
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <Text fontSize="sm">Hey, {displayName || user.email}!</Text>
      <form action={originalSignOutAction}>
        <Button 
          type="submit" 
          variant="outline" 
          colorScheme="primary" 
          size="md"
          _hover={{ bg: 'muted.DEFAULT' }}
        >
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <ChakraLink as={NextLink} href="/sign-in" role="link" _hover={{ textDecoration: "none" }}>
        <Button 
          size="md" 
          variant="outline" 
          colorScheme="primary" 
          _hover={{ bg: 'muted.DEFAULT', textDecoration: "none" }}
        >
          Sign in
        </Button>
      </ChakraLink>

      <ChakraLink as={NextLink} href="/sign-up" role="link" _hover={{ textDecoration: "none" }}>
        <Button 
          size="md" 
          variant={signUpButtonVariant}
          colorScheme="primary" 
          _hover={{ opacity: 0.9, textDecoration: "none" }}
        >
          Sign up
        </Button>
      </ChakraLink>
    </div>
  );
}