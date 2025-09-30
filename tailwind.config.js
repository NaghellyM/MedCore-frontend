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
				'cuidarte-accent': '#627DBC',
			},
			fontFamily: {
				fjalla: ['Fjalla One', 'sans-serif'],
				saira: ['Saira', 'sans-serif'],
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
