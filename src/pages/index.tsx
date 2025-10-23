import React from "react";
import type { HeadFC } from "gatsby";
import { SEO } from "../components/SEO";
import "../../styles.css";
import { graphql, useStaticQuery } from "gatsby";
import Home from "../components/Home";
import "../../styles.css";
import { AppContextProvider } from "../context/AppContext";

const pageStyles = {
	padding: 0,
	fontFamily: "-apple-system, Roboto, sans-serif, serif"
};

const IndexPage: React.FunctionComponent<any> = (): JSX.Element => {
	if (typeof document !== "undefined") {
		const bodyElement = document.querySelector("body");
		bodyElement.style.background = "#d8d8d8";
		bodyElement.style.transition = "background 2s ease-in";
	}

	const data = useStaticQuery(graphql`
			{
				allFile(filter: { sourceInstanceName: { eq: "images" } }) {
      				nodes {
						name
						childImageSharp {
							gatsbyImageData(width: 400, placeholder: BLURRED)
						}
					}
				}

				allMdx {
					nodes {
						frontmatter {
							title
							audio {
								name
								dir
								publicURL
								relativeDirectory
							}
							album
							order
							date
							duration
							albumType
						}
					}
				}
			}
		`);

	return (
		<AppContextProvider graphQlData={data}>
			<Home></Home>
		</AppContextProvider>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <SEO />;
