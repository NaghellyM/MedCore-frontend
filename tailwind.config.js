/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				'cuidarte-primary': '#8DBCC7',
				'cuidarte-secondary': '#A4CCD9',
				'cuidarte-tertiary': '#C4E1E6',
				'cuidarte-accent': '#647FBC',
			},
			fontFamily: {
				saira: ['Saira', 'sans-serif'],
				alumni: ['Alumni Sans Pinstripe', 'sans-serif'],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
