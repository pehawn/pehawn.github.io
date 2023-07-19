import { createTheme, Grid, IconButton, ThemeProvider } from "@mui/material";
import { Stack } from "@mui/system";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { AppContextProvider } from "../context/AppContext";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import CommandBar from "./CommandBar";
import { AnimatePresence, motion } from "framer-motion";
import Signature from "./Signature";
import SignaturePlayButton from "./SignaturePlayButton";
import CardList from "./CardList";

// Contains Top Action Bar With About Link In Left Hand Corner,
// Record (Voice Message Button) Right Hand Corner.  Background Color White.

// Children i.e. Color Swatches... Create Swatch Component With Title, Icon Buttons etc.

// Hue Slider in footer area... Footer area should be colored lightest of the swatches

const Layout: React.FunctionComponent<any> = ({ children }): JSX.Element => {
	const [showHomePage, setShowHomePage] = React.useState<boolean>(true);
	const [showSwatchesList, setShowSwatchesList] = React.useState<boolean>(false);
	const [scrollHeight, setScrollHeight] = React.useState<number>(100);

	const whiteTheme = createTheme({
		palette: {
			primary: {
				main: "#FFFFFF"
			},
			secondary: {
				main: "#FFFFFF"
			}
		}
	});

	// const data = useStaticQuery(graphql`
	// 	{
	// 		allMdx {
	// 			nodes {
	// 				frontmatter {
	// 					title
	// 					audio {
	// 						name
	// 						dir
	// 						publicURL
	// 						relativeDirectory
	// 					}
	// 					featuredImage {
	// 						childImageSharp {
	// 							gatsbyImageData(height: 800)
	// 						}
	// 					}
	// 					albumArtColor
	// 				}
	// 			}
	// 		}
	// 	}
	// `);

	const data = useStaticQuery(graphql`
		{
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
						albumArtColor
					}
				}
			}
		}
	`);

	const renderSwatchesList = (): JSX.Element => {
		if (showSwatchesList) {
			let totalHeight: string = scrollHeight + "svh";

			return (
				<div style={{ height: totalHeight }}>
					{children}
					<CommandBar />
					<CardList setScrollHeight={setScrollHeight} />
				</div>
			);
		}
	};

	const renderTitlePage = (): JSX.Element => {
		return (
			<React.Fragment>
				<AnimatePresence mode="popLayout">
					{showHomePage && (
						<motion.div layout animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0, y: -500 }} transition={{ duration: 0.3 }}>
							<div style={{ backgroundColor: "black", color: "white", fontSize: "90px", height: "100vh" }}>
								<Stack direction={"column"} height={"100vh"}>
									<Stack direction={"column"} alignItems={"center"} justifyContent={"center"} height={"100vh"}>
										<Signature />
										<Stack direction={"row"}>
											<ThemeProvider theme={whiteTheme}>
												<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 9 }}>
													<IconButton
														color="primary"
														disableRipple={true}
														style={{
															backgroundColor: "transparent",
															opacity: 0.7
														}}
														onClick={() => {
															setShowHomePage(false);
															setShowSwatchesList(true);
														}}
													>
														<KeyboardDoubleArrowDownIcon style={{ fontSize: "4rem", rotate: "180deg" }} />
													</IconButton>
												</motion.div>
											</ThemeProvider>
											<SignaturePlayButton />
										</Stack>
									</Stack>
								</Stack>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</React.Fragment>
		);
	};

	return (
		<React.Fragment>
			<AppContextProvider graphQlData={data}>
				<motion.div
					drag={showHomePage ? "y" : false}
					dragConstraints={{ bottom: 0, top: 0 }}
					onDragStart={(ev, info) => setShowSwatchesList(true)}
					onDragEnd={(ev, info) => {
						if (info.offset.y < 0 && Math.abs(info.offset.y) > window.screen.height / 3) {
							setShowHomePage(false);
						}
					}}
				>
					{renderTitlePage()}
					{renderSwatchesList()}
				</motion.div>
			</AppContextProvider>
		</React.Fragment>
	);
};

export default Layout;
