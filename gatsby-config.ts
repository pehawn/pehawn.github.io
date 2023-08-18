import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `Patrick Hawn`,
		description: `Software Developer and Music Producer based in Kansas City`,
		keywords: ["Patrick Hawn", "Music", "Portfolio", "Kansas City", "Producer", "Software Developer", "Programmer"],
		siteUrl: `https://phawn.dev`,
		twitterUsername: ``,
		image: ``
	},
	// More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
	// If you use VSCode you can also use the GraphQL plugin
	// Learn more at: https://gatsby.dev/graphql-typegen
	graphqlTypegen: true,
	plugins: [
		"gatsby-plugin-image",
		"gatsby-plugin-sharp",
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
		"gatsby-plugin-mdx",
		"gatsby-transformer-sharp",
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
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: "src/images/audiocable.png"
			}
		}
	]
};

export default config;
