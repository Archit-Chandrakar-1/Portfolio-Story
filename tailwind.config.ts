import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#F7F6F2",
                surface: "#FFFFFF",
                border: "#E8E6DF",
                navy: {
                    DEFAULT: "#12122A",
                    light: "#2D2D52",
                    dark: "#0A0A18",
                },
                lime: {
                    DEFAULT: "#D4E84A",
                    light: "#E3F368",
                    dark: "#BACE35",
                },
                mint: {
                    DEFAULT: "#B8D8E8",
                    light: "#D0E9F4",
                    dark: "#8FBFD6",
                },
                text: {
                    primary: "#12122A",
                    secondary: "#5A5A78",
                    muted: "#9B9BAA",
                },
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                display: ["Outfit", "sans-serif"],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "glow-lime": "radial-gradient(circle at center, rgba(212,232,74,0.2) 0%, transparent 70%)",
                "glow-mint": "radial-gradient(circle at center, rgba(184,216,232,0.25) 0%, transparent 70%)",
            },
            boxShadow: {
                "card": "0 2px 20px rgba(18,18,42,0.06), 0 1px 4px rgba(18,18,42,0.04)",
                "card-hover": "0 12px 40px rgba(18,18,42,0.12), 0 4px 12px rgba(18,18,42,0.06)",
                "lime": "0 4px 24px rgba(212,232,74,0.35)",
            },
            animation: {
                "gradient-shift": "gradientShift 8s ease infinite",
                "float": "float 6s ease-in-out infinite",
                "shimmer": "shimmer 2.5s linear infinite",
                "blob": "blob 10s infinite",
            },
            keyframes: {
                gradientShift: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-16px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -20px) scale(1.08)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
