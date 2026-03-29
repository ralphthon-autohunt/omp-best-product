import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // BUILDER: Replace hex values with your brand colors
        primary: '#6366f1',    // {{PRIMARY_COLOR}}
        secondary: '#a5b4fc',  // {{SECONDARY_COLOR}}
      },
    },
  },
  plugins: [],
}
export default config
