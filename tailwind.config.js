/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        spaceRegular: ['SpaceGrotesk-Regular'],
        spaceMedium: ['SpaceGrotesk-Medium'],
        spaceSemiBold: ['SpaceGrotesk-SemiBold'],
        spaceBold: ['SpaceGrotesk-Bold'],
      },
    },
  },
  plugins: [],
};
