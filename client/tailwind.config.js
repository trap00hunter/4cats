/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display: bubbly, rounded — carries all the mascot energy
        display: ["Fredoka", "ui-rounded", "sans-serif"],
        // Body: clean geo-grotesk for readable data (temps, humidity, etc.)
        body: ["Plus Jakarta Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Ink used for outlines/text on the neo-brutalist cards
        ink: {
          DEFAULT: "#1B1B2F",
          soft: "#3A3A55",
        },
        paper: "#FFFBF3",

        // ---- Fore-cat weather states (matrix from the spec) ----
        chill: {
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          shadow: "#0E7490",
          text: "#155E75",
        },
        presko: {
          50: "#ECFDF5",
          100: "#D1FAE5",
          200: "#BBF7D0",
          shadow: "#15803D",
          text: "#166534",
        },
        sunny: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          shadow: "#B45309",
          text: "#92400E",
        },
        meowinit: {
          50: "#FFF1EE",
          100: "#FFE0D6",
          200: "#FECDD3",
          shadow: "#C2410C",
          text: "#9A3412",
        },
        habagat: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#C7D2FE",
          shadow: "#3730A3",
          text: "#312E81",
        },
        bagyo: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          shadow: "#5B21B6",
          text: "#4C1D95",
        },
        midnight: {
          50: "#1E1B4B",
          100: "#171445",
          200: "#0F0C29",
          shadow: "#000000",
          text: "#E0E7FF",
        },

        // Brand accents used across chrome (header, footer, buttons)
        paw: {
          orange: "#FF8A3D",
          yellow: "#FFC93D",
          pink: "#FF6FA5",
          teal: "#2DD4BF",
        },
      },
      boxShadow: {
        // Signature "cartoon pop" shadow — flat, offset, no blur
        pop: "4px 4px 0px 0px #1B1B2F",
        "pop-sm": "2px 2px 0px 0px #1B1B2F",
        "pop-lg": "8px 8px 0px 0px #1B1B2F",
        "pop-hover": "6px 6px 0px 0px #1B1B2F",
        "pop-press": "1px 1px 0px 0px #1B1B2F",
        "pop-white": "4px 4px 0px 0px #FFFBF3",
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
      borderRadius: {
        blob: "42% 58% 61% 39% / 45% 41% 59% 55%",
        bean: "60% 40% 55% 45% / 50% 55% 45% 50%",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "tail-swish": {
          "0%, 100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
        "paw-tap": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "pop-in": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        blink: {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        "drift-cloud": {
          "0%": { transform: "translateX(-6%)" },
          "100%": { transform: "translateX(6%)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        wiggle: "wiggle 2.4s ease-in-out infinite",
        "tail-swish": "tail-swish 1.8s ease-in-out infinite",
        "paw-tap": "paw-tap 1.2s ease-in-out infinite",
        "pop-in": "pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        blink: "blink 5s ease-in-out infinite",
        "drift-cloud": "drift-cloud 12s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [],
};