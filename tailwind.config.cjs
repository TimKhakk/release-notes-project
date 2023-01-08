/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        svelte: {
          DEFAULT: '#ff3e00',
          blue: '#06c',
        }
      }
    },
  },
  plugins: [],
}
