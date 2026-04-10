/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        walmart: {
          primary: '#0071CE',
          secondary: '#FFC220',
          dark: '#004C91',
          light: '#F2F8FD',
          text: '#2E2F32',
          muted: '#6D6E71',
          success: '#2A8703',
          error: '#DE1C24',
        },
        amazon: {
          primary: '#232F3E',
          secondary: '#FF9900',
          dark: '#131921',
          light: '#EAEDED',
          text: '#0F1111',
          muted: '#565959',
          link: '#007185',
          success: '#067D62',
          error: '#CC0C39',
          border: '#D5D9D9',
        },
        dpd: {
          primary: '#DC0032',
          secondary: '#414042',
          dark: '#A00025',
          light: '#F5F5F5',
          text: '#414042',
          muted: '#6D6E71',
          success: '#4CAF50',
          error: '#DC0032',
        },
        dhl: {
          primary: '#FFCC00',
          secondary: '#D40511',
          dark: '#CC9900',
          light: '#FFFBEB',
          text: '#333333',
          muted: '#666666',
          success: '#69B826',
          error: '#D40511',
        },
      },
      fontFamily: {
        walmart: ['Bogle', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        amazon: ['Amazon Ember', 'Arial', 'sans-serif'],
        dpd: ['PlutoSans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        dhl: ['Delivery', 'Verdana', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
