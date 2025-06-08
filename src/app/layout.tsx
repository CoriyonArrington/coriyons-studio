/*
 FINAL, DEFINITIVE VERSION - Key Changes:
 - This layout now uses the single, centralized <Providers> component to handle all theme logic.
 - The separate <NextThemesProvider> and <ColorModeScript> have been removed from this file,
   as their logic is now correctly handled within <Providers>, fixing the hydration error.
*/
import { montserrat, nunito_sans } from "@/src/lib/fonts";
import { Providers } from "./providers";
import SiteHeader from "@/src/components/common/site-header";
import SiteFooter from "@/src/components/common/site-footer";
import { Flex, Box } from "@chakra-ui/react";
import "./globals.css";

import { createServerClient } from "@/src/utils/supabase/server";
import { getCategorizedFooterPages } from "@/src/lib/data/pages";
import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Your Awesome Project",
  description: "Description of your awesome project.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const footerPages = await getCategorizedFooterPages();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${nunito_sans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Flex direction="column" minH="100vh">
            <SiteHeader user={user} />
            <Box as="main" flex="1" w="full">
              {children}
            </Box>
            <SiteFooter footerPages={footerPages} />
          </Flex>
        </Providers>
      </body>
    </html>
  );
}