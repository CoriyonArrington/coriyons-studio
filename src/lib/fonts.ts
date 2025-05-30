// src/lib/fonts.ts
import localFont from 'next/font/local';

// Define Montserrat
export const montserrat = localFont({
  src: [
    {
      path: '../assets/fonts/Montserrat/Montserrat-VariableFont_wght.ttf',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-montserrat', // CSS variable for the font family
  display: 'swap',
});

// Define Nunito Sans
export const nunito_sans = localFont({
  src: [
    {
      path: '../assets/fonts/Nunito-Sans/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Nunito-Sans/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf',
      style: 'italic',
    }
  ],
  variable: '--font-nunito-sans', // CSS variable for the font family
  display: 'swap',
});