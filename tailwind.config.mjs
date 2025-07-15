/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			screens: {
        sm: '75vw',
        md: '728px',
        lg: '984px',
      },
      padding: {
        DEFAULT: '0.75rem',
        lg: '1.25rem',
      },
    },
		extend: {
			fontFamily: {
				bitter: ['Bitter', 'sans-serif'],
				ubuntu: ['Ubuntu', 'sans-serif'],
			},
			fontSize: {
        '2xs': '.5rem',
        '3xs': '.325rem',
      },
		},
	},
	plugins: [],
}
