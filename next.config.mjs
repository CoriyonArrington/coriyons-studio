// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default if you have an 'app' directory.
  compiler: {
    // This turns on Emotion's optimized SWC transform for Chakra UI
    emotion: true,
  },
  experimental: {
    // Optimize Chakra imports as before
    optimizePackageImports: ["@chakra-ui/react"],
  },
  webpack(config, { dev, isServer }) {
    // Silently ignore the “Critical dependency” warning from @supabase/realtime-js
    config.ignoreWarnings = config.ignoreWarnings || [];
    config.ignoreWarnings.push({
      message: /Critical dependency: the request of a dependency is an expression/,
    });
    return config;
  },
};

export default nextConfig;
