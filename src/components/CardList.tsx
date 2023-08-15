import { Box, Button, Card, CardContent, CardMedia, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, IconButton, Popover, Slide, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { AppContext } from "../context/AppContext";
import { IAudio } from "../types/IAudio";
import { styled, useTheme } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CasinoIcon from "@mui/icons-material/Casino";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import "@fontsource-variable/cinzel";
import { HexToHSL } from "./colorPicker/Helpers";
import { Helmet } from "react-helmet";
import { TransitionProps } from "@mui/material/transitions";
import * as Tone from "tone";
// @ts-ignore
import TrainingStartOptions from "../assets/training/TrainingStartOptions.mp4";
import TrainingModuleDialog from "./TrainingModuleDialog";

interface ICardList {
	setScrollHeight(scrollHeight: number): void;
}

const CardList: React.FunctionComponent<ICardList> = (props): JSX.Element => {
	const appContext = React.useContext(AppContext);

	const trainingStartAudio = React.useRef();

	const [trainingAnchorEl, setTrainingAnchorEl] = React.useState();

	const theme = useTheme();

	React.useEffect(() => {
		if (!appContext.DisplayTutorialDialog && appContext.SelectedAudio && appContext.DisplayTrainingModules.some((showModule) => showModule === true)) {
			Tone.Transport.pause();
		}
	}, [appContext.SelectedAudio]);

	React.useEffect(() => {
		if (appContext.DisplayTrainingModules[0]) {
			setTrainingAnchorEl(trainingStartAudio.current);
		}
	}, [appContext.DisplayTrainingModules]);

	React.useEffect(() => {
		const pixelScrollHeight: number = document.getElementById("cardList")?.scrollHeight;
		const vhScrollHeight: number = (100 * pixelScrollHeight) / window.innerHeight;
		props.setScrollHeight(vhScrollHeight);
	}, []);

	const TinyText = styled(Typography)({
		fontSize: ".8rem",
		opacity: 0.38,
		fontWeight: 250,
		letterSpacing: 0.2
	});

	let isMobile = false;

	if (typeof window !== "undefined") {
		isMobile = window.innerWidth <= 768;
	}

	// const Transition = React.forwardRef(function Transition(
	// 	props: TransitionProps & {
	// 		children: React.ReactElement<any, any>;
	// 	},
	// 	ref: React.Ref<unknown>
	// ) {
	// 	return <Slide direction="up" ref={ref} {...props} />;
	// });

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

	const updateAudio = (audio: IAudio, reversed: boolean, randomizeEffects: boolean): void => {
		if (!appContext.Player.current || appContext.Player.current.loaded) {
			let tempAudio: IAudio = { ...audio };
			tempAudio.Reversed = reversed;
			tempAudio.Paused = false;
			appContext.UpdateSelectedAudio(tempAudio, randomizeEffects);
		}
	};

	const renderPlayerTrainingStartAudio = (audio: IAudio): JSX.Element => {
		if (audio.Name === "INTROVERT") {
			const open: boolean = appContext.DisplayTrainingModules[0] && trainingAnchorEl;
			return (
				<span ref={trainingStartAudio}>
					<TrainingModuleDialog
						finalStep={false}
						isOpen={open}
						closeDialog={() => {
							setTrainingAnchorEl(null);
						}}
						currentStep={1}
						headerText="1 of 6"
						trainingAnchorEl={isMobile ? null : trainingAnchorEl}
						trainingText="On the various cards, select an option to play a song."
						trainingVideo={TrainingStartOptions}
					/>
				</span>
			);
		}
	};

	const renderAudio = (audio: IAudio): JSX.Element => {
		return (
			<React.Fragment>
				<Stack style={{ backgroundColor: "#FEFEFE", borderRadius: "10px", paddingLeft: "2px", paddingRight: "4px" }}>
					<Button
						style={{
							transform: "none",
							display: "inline-flex",
							alignItems: "center",
							position: "inherit",
							justifyContent: "center",
							border: "none",
							boxSizing: "border-box",
							verticalAlign: "middle",
							backgroundColor: "transparent",
							minWidth: "0px",
							padding: "6px 6px"
						}}
						disableRipple={true}
						disableTouchRipple={true}
						onClick={() => updateAudio(audio, false, false)}
					>
						<PlayArrowIcon
							sx={{
								color: appContext.SelectedAudio && appContext.SelectedAudio.Name === audio.Name && audio.CardColor ? audio.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9",
								borderRadius: "3px"
							}}
						></PlayArrowIcon>
					</Button>
					{renderPlayerTrainingStartAudio(audio)}
					<Button
						style={{
							transform: "none",
							display: "inline-flex",
							alignItems: "center",
							position: "inherit",
							justifyContent: "center",
							border: "none",
							boxSizing: "border-box",
							verticalAlign: "middle",
							backgroundColor: "transparent",
							minWidth: "0px",
							padding: "6px 6px"
						}}
						disableRipple={true}
						disableTouchRipple={true}
						onClick={() => updateAudio(audio, true, false)}
					>
						<RestartAltIcon
							sx={{
								color: appContext.SelectedAudio && appContext.SelectedAudio.Name === audio.Name && audio.CardColor ? audio.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9",
								borderRadius: "3px"
							}}
						></RestartAltIcon>
					</Button>
					<Button
						style={{
							display: "inline-flex",
							alignItems: "center",
							position: "inherit",
							justifyContent: "center",
							border: "none",
							boxSizing: "border-box",
							verticalAlign: "middle",
							backgroundColor: "transparent",
							minWidth: "0px",
							padding: "6px 6px"
						}}
						disableRipple={true}
						disableTouchRipple={true}
						onClick={() => updateAudio(audio, Math.random() > 0.5, true)}
					>
						<CasinoIcon
							sx={{
								color: appContext.SelectedAudio && appContext.SelectedAudio.Name === audio.Name && audio.CardColor ? audio.CardColor : "#bbbbbb",
								borderRadius: "3px",
								boxShadow: "0px 2px 2px #DBD9D9"
							}}
						></CasinoIcon>
					</Button>
				</Stack>
			</React.Fragment>
		);
	};

	const renderCards = (): JSX.Element[] => {
		let cards: JSX.Element[] = [];

		appContext.Tracks.forEach((track: IAudio) => {
			cards.push(
				<Card sx={{ display: "flex" }}>
					<Box sx={{ display: "flex", flexDirection: "column" }}>
						<CardContent sx={{ flex: "1 0 auto" }}>
							<Typography component="div" variant="h5">
								{track.Name}
							</Typography>
						</CardContent>
						<Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
							<IconButton aria-label="previous">{theme.direction === "rtl" ? <SkipNextIcon /> : <SkipPreviousIcon />}</IconButton>
							<IconButton aria-label="play/pause">
								<PlayArrowIcon sx={{ height: 38, width: 38 }} />
							</IconButton>
							<IconButton aria-label="next">{theme.direction === "rtl" ? <SkipPreviousIcon /> : <SkipNextIcon />}</IconButton>
						</Box>
					</Box>
				</Card>
			);
		});

		return cards;
	};

	const renderTitle = (track: IAudio): JSX.Element => {
		if (track.FullName != track.Name) {
			return (
				<Tooltip arrow={true} placement="top" title={track.FullName}>
					<div style={{ fontFamily: "Cinzel", fontSize: "1.8rem", opacity: 0.7, fontWeight: 0, letterSpacing: 10 }}>{track.Name}</div>
				</Tooltip>
			);
		} else {
			return <div style={{ fontFamily: "Cinzel", fontSize: "1.8rem", opacity: 0.7, fontWeight: 0, letterSpacing: 10 }}>{track.Name}</div>;
		}
	};

	const renderSwatches = (track: IAudio): JSX.Element => {
		const baseColor: string = appContext.SelectedAudio && appContext.SelectedAudio.Name === track.Name && track.CardColor ? track.CardColor : "#bbbbbb";
		const hslValues: number[] = HexToHSL(baseColor);
		let swatches: JSX.Element[] = [];
		const hueFactor: number = 2;
		const saturationFactor: number = hslValues[1] / 10;
		const lightnessFactor: number = hslValues[2] / 75;

		for (let i = 0; i < 5; i++) {
			const backgroundColor: string = ("hsl(" + (hslValues[0] + i * 4 * hueFactor) + ", " + (hslValues[1] + (Math.pow(i, 2) - 4) * saturationFactor) + "%, " + (hslValues[2] + (Math.pow(i, 2) - 4) * lightnessFactor) + "%)") as string;
			swatches.push(<div style={{ backgroundColor: backgroundColor, height: "30px" }} />);
		}

		return <Stack style={{ width: "100%" }}>{swatches}</Stack>;
	};

	const renderAlbumArt = (track: IAudio): JSX.Element => {
		if (track.AlbumArt) {
			return (
				<Box sx={{ display: "flex", flex: "2", alignItems: "center", justifyContent: "right" }}>
					<CardMedia component="img" height={110} sx={{ width: 151, borderRadius: 1, boxShadow: "-2px -2px 4px #bbbbbb" }} image={track.AlbumArt.images.fallback.src} />
				</Box>
			);
		}
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
						<Grid item key={track.Name} xs={1} sm={2} md={2}>
							<Card sx={{ display: "flex", height: "110px" }}>
								<Divider orientation="vertical" sx={{ borderWidth: "5px", backgroundColor: appContext.SelectedAudio && appContext.SelectedAudio.Name === track.Name && track.CardColor ? track.CardColor : "#bbbbbb" }}></Divider>
								<TinyText style={{ justifyContent: "center", writingMode: "vertical-lr", rotate: "180deg", display: "flex", alignItems: "left" }}>{track.Name}</TinyText>
								{renderSwatches(track)}
								<Box sx={{ justifyContent: "center", display: "flex", flex: "2", flexDirection: "column", alignItems: "center" }}>
									<Box sx={{ display: "flex", alignItems: "center" }}>{renderAudio(track)}</Box>
								</Box>
								{renderAlbumArt(track)}
							</Card>
						</Grid>
					))}
				</Grid>
			</div>
			{showTutorialDialog()}
		</React.Fragment>
	);
};

export default CardList;
