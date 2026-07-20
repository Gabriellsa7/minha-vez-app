/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        textPrimary: "#FFFFFF",
        textSecondary: "#006673",
        textThird: "#1EC2D8",
        textFourth: "#A8A8A8",
        textFifth: "#3E494B",
        textBlack: "#191C1D",
        textDanger: "#BA1A1A",
        button: {
          primary: "#3D8296",
          secondary: "#E7E8E9",
        },
        borderPrimary: "#E6E6E6",
        bgPrimary: "#F3F4F5",
        bgSecondary: "#007C8F",
        bgThird: "#FFFFFF",
        bgFourth: "#006673",
      },
    },
  },
  plugins: [],
};
