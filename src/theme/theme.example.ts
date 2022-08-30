const fonts = {
  // heading: 'Raleway',
};

const colors = {
  transparent: "transparent",
  brand: {
    900: "#365088", // blue
    800: "#211B2B", // black
    700: "#EDF5F6", // light blue
    600: "#57BCCC", // blue
    500: "#DAEDE5", // BackgroundWhite
  },
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const components = {
  Text: {
    baseStyle: {},
  },
  Heading: {
    baseStyle: {},
    sizes: {},
    variants: {
      white: {
        color: "white",
      },
    },
  },
  Code: {
    variants: {
      "mnemonic-word": {
        fontWeight: "bold",
        boxShadow: "1px 2px 4px lightgray",
        borderRadius: 5,
        padding: 2,
        margin: 2,
      },
      "mnemonic-word-selected": {
        fontWeight: "bold",
        boxShadow: "1px 2px 4px lightgray",
        borderRadius: 5,
        padding: 2,
        margin: 2,
        backgroundColor: "brand.700",
        color: "white",
      },
    },
  },
  Box: {
    variants: {
      menu: {
        fontWeight: "bold",
      },
      p: ({ colorMode }: any) => {
        return {
          bg: "brand.700",
        };
      },
    },
  },
  Table: {
    // customize table style
  },
};

export { colors, components, fonts, config };
