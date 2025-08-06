/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true, // centers the container (adds mx-auto)
      
      screens: {
        xl: "1440px", // max width for xl breakpoint
      },
    },
    extend: {
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        'custom-login-gradient': 'linear-gradient(119deg, rgb(0,0,0) 5%, rgb(89,55,224) 50%, rgb(0,0,0) 94%)',
      },
      colors: {
        gray: "#a9a9a9",
        Blue: "#5937E0 ",
        Black: "#000000",
        White: "#ffffff",
      },
    },
  },
  plugins: [],
}
