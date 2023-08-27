import { Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Popover, Slide, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { AppContext } from "../context/AppContext";
import { IAudio } from "../types/IAudio";
import { useTheme } from "@mui/material/styles";
import "@fontsource-variable/cinzel";
import { Helmet } from "react-helmet";
import AudioCard from "./AudioCard";

interface IAudioCardList {
	setScrollHeight(scrollHeight: number): void;
}

const CardList: React.FunctionComponent<IAudioCardList> = (props): JSX.Element => {
	const appContext = React.useContext(AppContext);

	const theme = useTheme();

	React.useEffect(() => {
		const pixelScrollHeight: number = document.getElementById("cardList")?.scrollHeight;
		const vhScrollHeight: number = (100 * pixelScrollHeight) / window.innerHeight;
		props.setScrollHeight(vhScrollHeight);
	}, []);

	const renderTrainingModules = async (): Promise<void> => {
		localStorage.setItem("ShowTutorial", JSON.stringify(false));

		let titleSong: IAudio = appContext.Tracks.find((track: IAudio) => track.Name === "INTROVERT");
		titleSong.Reversed = false;

		await appContext.UpdateSelectedAudio(titleSong, false);

		appContext.SetDisplayTutorialDialog(false);
		let displayTrainingModules: boolean[] = appContext.DisplayTrainingModules.slice();
		displayTrainingModules[0] = true;
		appContext.SetDisplayTrainingModules(displayTrainingModules);
	};

	const closeWelcomeDialog = (): void => {
		localStorage.setItem("ShowTutorial", JSON.stringify(false));
		appContext.SetDisplayTutorialDialog(false);
	};

	const showTutorialDialog = (): JSX.Element => {
		if (appContext.DisplayTutorialDialog) {
			return (
				<ClickAwayListener onClickAway={() => appContext.SetDisplayTutorialDialog(appContext.DisplayTutorialDialog)}>
					<Dialog transitionDuration={{ enter: 500, exit: 500 }} open={appContext.DisplayTutorialDialog} keepMounted onClose={() => appContext.SetDisplayTutorialDialog(false)} aria-describedby="alert-dialog-slide-description">
						<DialogContent style={{ paddingBottom: "5px" }}>
							<DialogContentText style={{ fontSize: ".95rem", opacity: 0.65, fontWeight: 450 }}>Before jumping in, do you want a quick walkthrough on how to leverage the audio player?</DialogContentText>
						</DialogContent>
						<DialogActions style={{ paddingLeft: "16px", justifyContent: "flex-start", paddingBottom: "20px" }}>
							<Button
								style={{ fontSize: ".7rem", fontWeight: 600, letterSpacing: 0.2 }}
								onClick={() => {
									renderTrainingModules();
								}}
							>
								Beam Me Up, Scotty
							</Button>
							<Button
								style={{ color: "red", fontSize: ".7rem", fontWeight: 600, letterSpacing: 0.2 }}
								onClick={() => {
									closeWelcomeDialog();
								}}
							>
								Roads? Where we're going, we don't need roads
							</Button>
						</DialogActions>
					</Dialog>
				</ClickAwayListener>
			);
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<meta name="theme-color" content="#eeeeee" />
			</Helmet>
			<div id="cardList" style={{ flexGrow: 1, padding: theme.spacing(2) }}>
				<Grid container spacing={2} direction="row" columns={{ xs: 1, sm: 4, md: 8 }}>
					{appContext.Tracks.map((track: IAudio) => (
						<AudioCard key={track.Name} audio={track} />
					))}
				</Grid>
			</div>
			{showTutorialDialog()}
		</React.Fragment>
	);
};

export default CardList;
