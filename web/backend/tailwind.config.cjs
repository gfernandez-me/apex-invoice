module.exports = {
	...require('@apex/config/tailwind.config.cjs'),
	// content: [
	//   // eslint-disable-next-line @typescript-eslint/no-var-requires
	//   path.join(
	//     path.dirname(require.resolve('@apex/shared-ui')),
	//     'components/**/*.{js,ts,jsx,tsx}'
	//   ),
	// ],
	corePlugins: {
		preflight: true,
	},
}
