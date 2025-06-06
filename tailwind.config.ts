import type { Config } from "tailwindcss";

// Full Tailwind configuration with support for semantic tokens,
// theme switching, responsive containers, and Radix UI animation utilities.
const config: Config = {
  darkMode: ["class"], // Enables class-based dark mode toggling (e.g., <html class="dark">)

  content: [
    "./pages/**/*.{ts,tsx}",        // Includes traditional page routes
    "./components/**/*.{ts,tsx}",   // Scans component folder for Tailwind usage
    "./app/**/*.{ts,tsx}",          // Supports App Router structure (Next.js 13+)
    "./src/**/*.{ts,tsx}",          // Optional support for monorepos or /src convention
  ],

  prefix: "", // Optional: add a prefix to all classes (e.g., tw-bg-primary)

  theme: {
    container: {
      center: true,             // Ensures `.container` utility is always centered
      padding: "2rem",          // Applies consistent horizontal padding
      screens: {
        "2xl": "1400px",        // Max width for 2xl container layout
      },
    },

    extend: {
      // 🎨 Color tokens using HSL + CSS Variables for dynamic theming
      colors: {
        // Used for borders, dividers
        border: "hsl(var(--border))", // Figma: tokenized stroke or subtle divider

        // Used for form fields and text inputs
        input: "hsl(var(--input))", // Figma: neutral fill for input states

        // Used for ring outlines in focus states
        ring: "hsl(var(--ring))", // Figma: focus ring or glow

        // Background layer
        background: "hsl(var(--background))", // Figma: page background

        // Default text color
        foreground: "hsl(var(--foreground))", // Figma: default text color

        // ✅ Primary brand color
        primary: {
          DEFAULT: "hsl(var(--primary))",               // Figma: #2FB67C → green
          foreground: "hsl(var(--primary-foreground))", // Figma: white text on green
        },

        // ⚙️ Secondary actions or alternative UI
        secondary: {
          DEFAULT: "hsl(var(--secondary))",               // Figma: complementary color
          foreground: "hsl(var(--secondary-foreground))", // Contrast on secondary
        },

        // ❌ Used for errors, warnings, and destructive actions
        destructive: {
          DEFAULT: "hsl(var(--destructive))",               // Figma: red
          foreground: "hsl(var(--destructive-foreground))", // Usually white or dark
        },

        // 🪄 Muted surfaces like subtle cards or backgrounds
        muted: {
          DEFAULT: "hsl(var(--muted))",               // Figma: light gray
          foreground: "hsl(var(--muted-foreground))", // Darker text on muted bg
        },

        // ✨ Accents, highlights, or brand-like embellishments
        accent: {
          DEFAULT: "hsl(var(--accent))",               // Figma: accent color (used sparingly)
          foreground: "hsl(var(--accent-foreground))", // Text/icon contrast on accent
        },

        // 📍Popover surfaces like tooltips, dropdowns
        popover: {
          DEFAULT: "hsl(var(--popover))",               // Figma: tooltip background
          foreground: "hsl(var(--popover-foreground))", // Figma: tooltip text
        },

        // 🧩 Card components and elevated UI surfaces
        card: {
          DEFAULT: "hsl(var(--card))",               // Figma: white or light surface
          foreground: "hsl(var(--card-foreground))", // Primary text on card
        },
      },

      // 🟢 Border radius system tied to CSS var (--radius) for scalable rounding
      borderRadius: {
        lg: "var(--radius)",              // Default: large roundness (e.g., buttons, cards)
        md: "calc(var(--radius) - 2px)",  // Medium rounding (e.g., inputs)
        sm: "calc(var(--radius) - 4px)",  // Small rounding (e.g., tags, badges)
      },

      // 🔁 Keyframe animations for Radix UI accordion component
      keyframes: {
        "accordion-down": {
          from: { height: "0" }, // Start collapsed
          to: { height: "var(--radix-accordion-content-height)" }, // Expand to full height
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" }, // Start open
          to: { height: "0" }, // Collapse to hidden
        },
      },

      // 🚀 Custom animation utilities to trigger above keyframes
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out", // Expand animation
        "accordion-up": "accordion-up 0.2s ease-out",     // Collapse animation
      },
    },
  },

  // 📦 Plugin to support animate utility classes (`animate-[keyframe]`)
  plugins: [require("tailwindcss-animate")],
};

export default config;
