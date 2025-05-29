// src/app/layout.tsx
import { montserrat, nunito_sans } from '@/src/lib/fonts'; // Import your custom fonts
import { ThemeProvider as NextThemesProvider } from "next-themes"; //
import { Providers } from "./providers"; //
import SiteHeader from "@/src/components/layout/site-header"; //
import SiteFooter from "@/src/components/layout/site-footer"; //
import { Flex, Box } from "@chakra-ui/react"; //
import "./globals.css"; //

import { createClient } from "@/src/utils/supabase/server"; //

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000"; //

export const metadata = {
  metadataBase: new URL(defaultUrl), //
  title: "Your Awesome Project", //
  description: "Description of your awesome project.", //
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient(); //
  const {
    data: { user },
  } = await supabase.auth.getUser(); //

  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${nunito_sans.variable}`} // Apply your custom font variables
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground"> {/* */}
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > {/* */}
          <Providers> {/* */}
            <Flex direction="column" minH="100vh"> {/* */}
              <SiteHeader user={user} /> {/* */}
              <Box
                as="main"
                flex="1"
                w="full"
              > {/* */}
                {children}
              </Box>
              <SiteFooter /> {/* */}
            </Flex>
          </Providers>
        </NextThemesProvider>
      </body>
    </html>
  );
}