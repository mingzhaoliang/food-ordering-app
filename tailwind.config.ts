import type { Config } from "tailwindcss";

const sizing = {
  88: "22rem",
  104: "26rem",
  112: "28rem",
  120: "30rem",
  124: "32rem",
  128: "34rem",
};

const config: Config = {
  darkMode: ["class"],
  content: ["./src/app/**/*.{ts,tsx,mdx}", "./src/components/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-medium": "spin 15s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      width: {
        ...sizing,
      },
      height: {
        ...sizing,
      },
      minHeight: {
        ...sizing,
      },
      maxHeight: {
        ...sizing,
      },
      minWidth: {
        ...sizing,
      },
      maxWidth: {
        ...sizing,
      },
      gridTemplateAreas: {
        card: ["thumbnail thumbnail", "title title", "description description", "price button"],
        "card-vertical": ["thumbnail thumbnail thumbnail", "title price button"],
        "card-horizontal": [
          "thumbnail title price",
          "thumbnail description description",
          "thumbnail tags tags",
          "thumbnail button button",
        ],
      },
      gridTemplateColumns: {
        "card-vertical": "auto min-content min-content",
        "card-horizontal": "auto 1fr auto",
      },
      gridTemplateRows: {
        card: "repeat(4, auto)",
        "card-vertical": "minmax(0, 4fr) min-content",
        "card-horizontal": "2fr 2fr 1fr 1fr",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@savvywombat/tailwindcss-grid-areas")],
};
export default config;
