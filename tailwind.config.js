/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { "reverse-spin": "reverse-spin 1s linear infinite" },
      keyframes: { "reverse-spin": { from: { transform: "rotate(360deg)" } } },
      colors: {
        neutral: {
          primary: "var(--neutral-primary)",
          secondary: "var(--neutral-secondary)",
          muted: "var(--neutral-muted)",
        },
      },
    },
  },
  plugins: [],
};
