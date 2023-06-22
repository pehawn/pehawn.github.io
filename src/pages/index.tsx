import * as React from "react";
import type { HeadFC } from "gatsby";
import Layout from "../components/Layout";

const pageStyles = {
	padding: 0,
	fontFamily: "-apple-system, Roboto, sans-serif, serif"
};

const IndexPage: React.FunctionComponent<any> = (data): JSX.Element => {
	return (
		<main style={pageStyles}>
			<Layout></Layout>
		</main>
	);
};

export default IndexPage;

export const Head: HeadFC = () => <title>P H</title>;
