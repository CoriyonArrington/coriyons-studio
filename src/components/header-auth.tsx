// src/components/header-auth.tsx
"use client"; // Make this a Client Component

import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/src/utils/supabase/check-env-vars"; // Assuming this util is client-safe or its value is also passed as prop if needed
import Link from "next/link";
import { Badge, Button } from "@chakra-ui/react";
import type { User } from "@supabase/supabase-js"; // Import User type

interface AuthButtonProps {
  user: User | null;
}

export default function AuthButton({ user }: AuthButtonProps) { // Receive user as a prop
  // Data fetching (createClient, supabase.auth.getUser) is removed from here

  // Note: The `hasEnvVars` check:
  // If `hasEnvVars` relies on server-side environment variables not prefixed with NEXT_PUBLIC_,
  // its value might also need to be determined in a Server Component and passed down as a prop.
  // For now, assuming it works or its logic is handled. The main fix is for `next/headers`.

  if (!hasEnvVars) { // This check might need to be based on a prop if hasEnvVars is server-only
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              colorScheme="yellow"
              variant={"solid"}
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              as={Link}
              href="/sign-in"
              size="sm"
              variant={"outline"}
              isDisabled
              opacity={0.75}
              cursor="default"
              pointerEvents="none"
            >
              Sign in
            </Button>
            <Button
              as={Link}
              href="/sign-up"
              size="sm"
              variant={"solid"}
              colorScheme="blue"
              isDisabled
              opacity={0.75}
              cursor="default"
              pointerEvents="none"
            >
              Sign up
            </Button>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      {/* Using Chakra Text for consistency, though direct string is fine */}
      {/* <Text fontSize="sm">Hey, {user.email}!</Text> */}
      Hey, {user.email}! {/* Simpler, direct display */}
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"} colorScheme="gray" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button as={Link} href="/sign-in" size="sm" variant={"outline"} colorScheme="gray">
        Sign in
      </Button>
      <Button as={Link} href="/sign-up" size="sm" colorScheme="blue">
        Sign up
      </Button>
    </div>
  );
}