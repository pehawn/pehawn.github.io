import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
	siteMetadata: {
		title: `portfolio`,
		siteUrl: `https://www.yourdomain.tld`
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
				path: `${__dirname}/songs`
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
				icon: "src/images/3d.png"
			}
		}
	]
};

export default config;
