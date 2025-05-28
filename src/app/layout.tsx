// src/app/layout.tsx
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Providers } from "./providers";
import SiteHeader from "@/src/components/layout/site-header"; // Ensure kebab-case path
import SiteFooter from "@/src/components/layout/site-footer"; // Ensure kebab-case path
import { Flex, Box } from "@chakra-ui/react";
import "./globals.css";

import { createClient } from "@/src/utils/supabase/server";
// Removed: import type { User } from "@supabase/supabase-js"; // Unused in this file

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Your Awesome Project",
  description: "Description of your awesome project.",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient(); // Correctly await the client instance
  const {
    data: { user },
  } = await supabase.auth.getUser(); // Now supabase is the resolved client

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Flex direction="column" minH="100vh">
              <SiteHeader user={user} /> {/* SiteHeader will type its own 'user' prop */}
              <Box
                as="main"
                flex="1"
                w="full"
              >
                {children}
              </Box>
              <SiteFooter />
            </Flex>
          </Providers>
        </NextThemesProvider>
      </body>
    </html>
  );
}