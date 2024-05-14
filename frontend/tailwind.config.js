/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");
const defaultTheme = require("tailwindcss/defaultTheme");

const primaryLight = {
  100: "#E4FBF9",
  200: "#CAF7F6",
  300: "#A8E2E7",
  400: "#88C5CF",
  500: "#609EAF",
  600: "#467F96",
  700: "#30617D",
  800: "#1E4665",
  900: "#123253",
  DEFAULT: "#609EAF",
};

const primaryDark = {
  100: "#EAFCF9",
  200: "#D5FAF7",
  300: "#BBF2F1",
  400: "#A5E1E5",
  500: "#85C9D4",
  600: "#61A3B6",
  700: "#437F98",
  800: "#2A5C7A",
  900: "#194365",
  DEFAULT: "#85C9D4",
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,css}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      main: ["Quicksand", "sans-serif"],
      header1: ["Gilroy", "Roboto", "sans-serif"],
      header2: ["Inter", "sans-serif"],
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            primary: primaryDark,
            focus: primaryDark,
            secondary: {
              100: "#FEF9E0",
              200: "#FEF1C2",
              300: "#FDE7A3",
              400: "#FBDD8C",
              500: "#FACD66",
              600: "#D7A74A",
              700: "#B38433",
              800: "#906420",
              900: "#774C13",
              DEFAULT: "#FACD66",
            },

            content1: "#33373B",
            content2: "#1D2123",
            content3: "#151819",

            default: {
              100: "#33373B",
              200: "#3b4044",
              300: "#54595f",
            },

            background: "#1D2123",
            foreground: {
              900: "#f2f2f2",
              800: "#d9d9d9",
              700: "#bfbfbf",
              600: "#a6a6a6",
              500: "#8c8c8c",
              400: "#737373",
              300: "#595959",
              200: "#404040",
              100: "#262626",
            },
          },
        },
        light: {
          colors: {
            primary: primaryLight,
            focus: primaryLight,
            secondary: {
              100: "#FEF6D1",
              200: "#FEEBA4",
              300: "#FDDD76",
              400: "#FCCF54",
              500: "#FBB81C",
              600: "#D79714",
              700: "#B4780E",
              800: "#915B08",
              900: "#784705",
              DEFAULT: "#FBB81C",
            },
          },
        },
      },
    }),
  ],
};
