import React from "react";
import useSiteMetadata from "../hooks/UseSiteMetadata";

interface ISEOProps {
	title?: string;
	description?: string;
	pathName?: string;
	children?: any;
}

export const SEO: React.FunctionComponent<ISEOProps> = (props): JSX.Element => {
	const { title: defaultTitle, description: defaultDescription, keywords, image, siteUrl, twitterUsername, genres, sameAs } = useSiteMetadata();

	const seo = {
		title: props.title || defaultTitle,
		description: props.description || defaultDescription,
		keywords: keywords.join(", "),
		image: `${siteUrl}/${image}`,
		url: `${siteUrl}${props.pathName || ``}`,
		twitterUsername,
	};

	const musicGroupSchema = {
		"@context": "https://schema.org",
		"@type": "MusicGroup",
		name: defaultTitle,
		url: siteUrl,
		image: `${siteUrl}/${image}`,
		description: defaultDescription,
		genre: genres,
		sameAs: sameAs
	};

	return (
		<>
			<title>{seo.title}</title>
			<meta name="description" content={seo.description} />
			<meta name="keywords" content={seo.keywords} />
			<meta name="image" content={seo.image} />
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={seo.title} />
			<meta name="twitter:url" content={seo.url} />
			<meta name="twitter:description" content={seo.description} />
			<meta name="twitter:image" content={seo.image} />
			<meta name="twitter:creator" content={seo.twitterUsername} />
			<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='0.9em' font-size='90'>👤</text></svg>" />

			{/* Auto-injected JSON-LD Schema used for web crawlers to support Google Knowledge */}
			<script type="application/ld+json">
				{JSON.stringify(musicGroupSchema)}
			</script>
			{props.children}
		</>
	);
};
