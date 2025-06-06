// ATTEMPT #11: FINAL FIX FOR CLIENT/SERVER ARCHITECTURE
// Change: Fetched footer data here in the parent Server Component and passed it as a prop to the SiteFooter component to prevent server-only code from being used in a client context.

import { montserrat, nunito_sans } from "@/src/lib/fonts";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Providers } from "./providers";
import SiteHeader from "@/src/components/common/site-header";
import SiteFooter from "@/src/components/common/site-footer";
import { Flex, Box } from "@chakra-ui/react";
import { ColorModeScript } from "@chakra-ui/react";
import chakraTheme from "@/src/lib/theme";
import "./globals.css";

import { createServerClient } from "@/src/utils/supabase/server";
import { getCategorizedFooterPages } from "@/src/lib/data/pages"; // <-- ADDED THIS IMPORT

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
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

  // Fetch the data for the footer here in the root layout (a Server Component)
  const footerPages = await getCategorizedFooterPages();

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${nunito_sans.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ColorModeScript
          initialColorMode={chakraTheme.config.initialColorMode}
        />
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Flex direction="column" minH="100vh">
              <SiteHeader user={user} />
              <Box as="main" flex="1" w="full">
                {children}
              </Box>
              {/* Pass the fetched data as a prop to the footer */}
              <SiteFooter footerPages={footerPages} />
            </Flex>
          </Providers>
        </NextThemesProvider>
      </body>
    </html>
  );
}