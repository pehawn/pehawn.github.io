import { graphql, useStaticQuery } from "gatsby";

const useSiteMetadata = (): any => {
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
					genres
					sameAs
				}
			}
		}
	`);

	return data.site.siteMetadata;
};

export default useSiteMetadata;
