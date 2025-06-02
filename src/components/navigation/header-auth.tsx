// src/components/navigation/header-auth.tsx
// - Updated NextLink usage to modern pattern: removed legacyBehavior, passHref (where applicable),
//   and `as="a"` from child Button components when NextLink itself provides the anchor.
// - This aims to resolve nested <a> tag errors and legacyBehavior warnings.
"use client";

import React from 'react';
import { signOutAction as originalSignOutAction } from "@/src/app/actions";
import { hasEnvVars } from "@/src/utils/supabase/check-env-vars";
import NextLink from "next/link";
import { Badge, Button, Text } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js";

interface AuthButtonProps {
  user: User | null;
}

const getFirstName = (user: User | null): string | null => {
  if (!user) return null;
  const fullName = user.user_metadata?.name as string || user.user_metadata?.full_name as string;
  const firstName = user.user_metadata?.first_name as string;
  if (firstName) return firstName;
  if (fullName) return fullName.split(' ')[0];
  return null;
};

export default function AuthButton({ user }: AuthButtonProps) {
  const isTestAction = process.env.NODE_ENV === 'test';
  const actionProp = isTestAction ? '/mocked-sign-out-action' : originalSignOutAction;
  const displayName = getFirstName(user);

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
            <NextLink href="/sign-in">
              <Button size="md" variant={"outline"} isDisabled opacity={0.75} cursor="default" pointerEvents="none" _hover={{ textDecoration: 'none' }}>
                Sign in
              </Button>
            </NextLink>
            <NextLink href="/sign-up">
              <Button size="md" variant={"solid"} colorScheme="blue" isDisabled opacity={0.75} cursor="default" pointerEvents="none" _hover={{ textDecoration: 'none' }}>
                Sign up
              </Button>
            </NextLink>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <Text fontSize="sm">
        Hey, {displayName || user.email}!
      </Text>
      <form action={actionProp} method={typeof actionProp === 'function' ? undefined : "POST"}>
        <Button type="submit" variant="themedOutline" size="md">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <NextLink href="/sign-in">
        <Button size="md" variant="themedOutline" _hover={{ textDecoration: 'none' }}>
          Sign in
        </Button>
      </NextLink>
      <NextLink href="/sign-up">
        <Button size="md" variant="solid" colorScheme="blue" _hover={{ textDecoration: 'none' }}>
          Sign up
        </Button>
      </NextLink>
    </div>
  );
}