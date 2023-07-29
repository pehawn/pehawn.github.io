import * as React from "react";
import type { HeadFC } from "gatsby";
import Layout from "../components/Layout";

const pageStyles = {
	padding: 0,
	fontFamily: "-apple-system, Roboto, sans-serif, serif"
};

const IndexPage: React.FunctionComponent<any> = (data): JSX.Element => {
	if (typeof document !== undefined) {
		const bodyElement = document.querySelector("body");
		bodyElement.style.background = "#d8d8d8";
		bodyElement.style.transition = "background 2s ease-in";
	}

	return (
		<main style={pageStyles}>
			<Layout></Layout>
		</main>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <title>PH</title>;
