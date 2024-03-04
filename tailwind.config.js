/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: { "reverse-spin": "reverse-spin 1s linear infinite" },
      keyframes: { "reverse-spin": { from: { transform: "rotate(360deg)" } } },
      colors: {
        base: "var(--base)",
        'light-gray': "var(--light-gray)",
        'text-gray': "var(--text-gray)",
        'text-muted': "var(--text-muted)",
        'card-header': "var(--card-header)",
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
