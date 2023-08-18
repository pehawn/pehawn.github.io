import { graphql, useStaticQuery } from "gatsby";

export const useSiteMetadata = (): any => {
	const data = useStaticQuery(graphql`
		query {
			site {
				siteMetadata {
					title
					description
					keywords
					siteUrl
					twitterUsername
					image
				}
			}
		}
	`);

	return data.site.siteMetadata;
};
