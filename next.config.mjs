/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default if you have an 'app' directory.
  // The 'experimental.appDir' option is no longer needed.
  compiler: {
    // This turns on Emotion's optimized SWC transform for Chakra UI
    emotion: true,
  },
  experimental: { // Added this section as per Chakra UI docs
    optimizePackageImports: ["@chakra-ui/react"],
  },
  // You can add other Next.js configurations here if needed
  // For example:
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'example.com',
  //     },
  //   ],
  // },
};

export default nextConfig;