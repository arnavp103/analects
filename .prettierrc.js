/** @type {import("@types/prettier").Options} */
export const printWidth = 100;
export const semi = true;
export const singleQuote = false;
export const tabWidth = 4;
export const useTabs = true;
export const plugins = [
	"prettier-plugin-astro",
	"prettier-plugin-tailwindcss" /* Must come last */,
];
export const overrides = [
	{
		files: "*.astro",
		options: {
			parser: "astro",
		},
	},
];
