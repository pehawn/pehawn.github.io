import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import { motion } from "framer-motion";
import * as React from "react";
import { AppContext } from "../context/AppContext";
import { PlayArrowOutlined, PauseOutlined } from "@mui/icons-material";
import { IAudio } from "../types/IAudio";
import * as Tone from "tone";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";

const SignaturePlayButton: React.FunctionComponent<any> = ({}): JSX.Element => {
	const env: string = process.env.GATSBY_ENV;

	const appContext = React.useContext(AppContext);

	const [isPaused, setIsPaused] = useDevHook<boolean>(true, "isPaused", ReactHook.State, env);

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

	const playTitleSong = (): void => {
		let tempAudio: IAudio = appContext.Tracks.find((track: IAudio) => track.Name === "INTROVERT");
		tempAudio.Reversed = false;
		tempAudio.Paused = false;
		appContext.UpdateSelectedAudio(tempAudio, false);
	};

	const renderPlayerIcon = (): JSX.Element => {
		if (isPaused) {
			return (
				<IconButton
					color="primary"
					disableRipple={true}
					style={{
						backgroundColor: "transparent",
						opacity: 0.7
					}}
					disabled={!Tone.loaded}
					onClick={() => {
						if (appContext.SelectedAudio) {
							Tone.Transport.start();
						} else {
							playTitleSong();
						}

						setIsPaused(false);
					}}
				>
					<PlayArrowOutlined style={{ fontSize: "5rem" }} />
				</IconButton>
			);
		} else {
			return (
				<IconButton
					color="primary"
					disableRipple={true}
					style={{
						backgroundColor: "transparent",
						opacity: 0.7
					}}
					onClick={() => {
						Tone.Transport.pause();
						setIsPaused(true);
					}}
				>
					<PauseOutlined style={{ fontSize: "3rem" }} />
				</IconButton>
			);
		}
	};

	return (
		<React.Fragment>
			<ThemeProvider theme={whiteTheme}>
				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 9 }}>
					{renderPlayerIcon()}
				</motion.div>
			</ThemeProvider>
		</React.Fragment>
	);
};

export default SignaturePlayButton;
