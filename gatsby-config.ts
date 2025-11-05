import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Hawnest`,
		description: `Singer/Songwriter based in Kansas City`,
		keywords: ["Hawnest", "Patrick Hawn", "Music", "Portfolio", "Singer", "Songwriter", "Kansas City", "Producer", "Software Developer", "Programmer"],
		siteUrl: `https://hawnest.com/`,
		twitterUsername: ``,
		image: ``
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Hawnest`,
				short_name: `Hawnest`,
				start_url: `/`,
				background_color: `#f7f0eb`,
				theme_color: `#a2466c`,
				// Enables "Add to Homescreen" prompt and disables browser UI (including back button)
				// see https://developers.google.com/web/fundamentals/web-app-manifest/#display
				display: `standalone`,
				icon: `src/images/REGGIE.png`, // This path is relative to the root of the site.
				include_favicon: true, // Include favicon
				cache_busting_mode: 'none',
				icon_options: {
					purpose: `any maskable`,
				},
				legacy: true,
			}
		},
		"gatsby-plugin-image",
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/assets/images/albums`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `epk`,
				path: `${__dirname}/src/assets/images/epk`
			}
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `presskit`,
				path: `${__dirname}/src/assets/images/presskit`
			}
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: `songs`,
				path: `${__dirname}/src/assets/songs`
			}
		},
		{
			resolve: "gatsby-source-filesystem",
			options: {
				name: `downloads`,
				path: `${__dirname}/src/assets/downloads`
			}
		},
		"gatsby-transformer-sharp",
		"gatsby-plugin-sharp",
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [
					{
						resolve: "gatsby-remark-audio",
						options: {
							preload: "auto",
							loop: false,
							controls: true,
							muted: false,
							autoplay: false
						}
					}
				]
			}
		},
		"gatsby-plugin-mdx"
	]
};

export default config;
