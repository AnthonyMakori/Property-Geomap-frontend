const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "425px",
        lg_default: "1000px",
        lg: "1030px",
        "3xl": "1920px",
        "4xl": "3840px",
      },
      height: {
        /* https://stackoverflow.com/a/76120728 */
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
      },
      zIndex: {
        100: "100",
      },
      colors: {
        primary: "#376FD0",
        primaryDarker: "#2965cd",

        light: "#F7F9FC",
        lighter: "#fbfcfe",
        darkest: "#233044",
        dark: "#364B6A",
        darkish: "#3e567b",
        info: "#e5f6fd",
        error: "#C62828",
        success: "#1B5E20",
        successLighter: "#47ff6f",
        warning: "#E65100",
        grey: {
          50: "#C0C0C0",
          100: "#7D7B7B",
        },
        purple: "#9D6381",
        orange: "#F28123",
        green: "#314648",
        client: {
          light: "#EDECEC",
        },
        v3: {
          darkest: "#1f1d2b",
          dark: "#252836",
          primary: "#0685fa",
          success: "#17ab30",
          lightest: "#fff",
        },
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#376FD0",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#233044",
          "neutral-content": "#e5f6fd",
          "base-100": "#FFFFFF",
          "base-200": "#f3f6fc",
          "base-300": "#e7edf9",
          "base-content": "#233044",
          info: "#e5f6fd",
          success: "#1B5E20",
          warning: "#E65100",
          error: "#ff7474",
          "--btn-text-case": "normal",
        },
        dark: {
          primary: "#0685fa",
          secondary: "#F000B8",
          accent: "#37CDBE",
          neutral: "#233044",
          "neutral-content": "#e5f6fd",
          "base-100": "#252836",
          "base-200": "#252836",
          "base-300": "#1f1d2b",
          "base-content": "#FFFFFF",
          info: "#e5f6fd",
          success: "#1B5E20",
          warning: "#E65100",
          error: "#C62828",
          "--btn-text-case": "normal",
        },
      },
    ],
  },
};
