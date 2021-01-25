module.exports = {
  purge: ["./pages/**/*.tsx"],
  darkMode: false,
  theme: {
    extend: {
      screens: {
        "2xs": "370px",
        xs: "480px",
      },
      maxWidth: {
        xs: "480px",
      },
    },
  },
  variants: {},
  plugins: [],
}
