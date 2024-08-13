/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html', // This includes all HTML files in the root directory
    './src/**/*.js', // If you have any JS files in a src directory (optional)
    './app.js', // Include this specific JavaScript file
    './styles.css' // Include the main CSS file if you use Tailwind classes in it
  ],
  theme: {
    extend: {
      // Add customizations or overrides to the default theme
    },
  },
  darkMode: 'media', // You can set this to 'class' or remove it if not using dark mode
  plugins: [
    // Add any third-party plugins here
  ],
}


