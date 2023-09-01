import React from "react";
import { v4 as uuidv4 } from "uuid";
import { IAudio } from "../types/IAudio";
import { HexToHSL } from "./colorPicker/Helpers";
import { AppContext } from "../context/AppContext";
import { Box, Button, Card, CardMedia, Divider, Grid, Stack, Typography, styled } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CasinoIcon from "@mui/icons-material/Casino";
import * as Tone from "tone";
// @ts-ignore
import TrainingStartOptions from "../assets/training/TrainingStartOptions.mp4";
import TrainingModuleDialog from "./TrainingModuleDialog";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";

interface ICardList {
	audio: IAudio;
}

const uuid = uuidv4();

const AudioCard: React.FunctionComponent<ICardList> = ({ audio }): JSX.Element => {
	let isMobile = false;
	const env: string = process.env.GATSBY_ENV;

	if (typeof window !== "undefined") {
		isMobile = window.innerWidth <= 768;
	}

	const TinyText = styled(Typography)({
		fontSize: ".8rem",
		opacity: 0.38,
		fontWeight: 250,
		letterSpacing: 0.2
	});

	const { SelectedAudio, Player, UpdateSelectedAudio, DisplayTrainingModules, DisplayTutorialDialog } = React.useContext(AppContext);

	const trainingStartAudio = useDevHook(null, "trainingStartAudioRef", ReactHook.Ref, env);

	const [trainingAnchorEl, setTrainingAnchorEl] = useDevHook(null, "trainingAnchor", ReactHook.State, env);

	React.useEffect(() => {
		if (!DisplayTutorialDialog && SelectedAudio && DisplayTrainingModules.some((showModule) => showModule === true)) {
			Tone.Transport.pause();
		}
	}, [SelectedAudio]);

	React.useEffect(() => {
		if (DisplayTrainingModules[0]) {
			setTrainingAnchorEl(trainingStartAudio.current);
		}
	}, [DisplayTrainingModules]);

	const updateAudio = (audio: IAudio, reversed: boolean, randomizeEffects: boolean): void => {
		if (!Player.current || Player.current.loaded) {
			let tempAudio: IAudio = { ...audio };
			tempAudio.Reversed = reversed;
			tempAudio.Paused = false;
			UpdateSelectedAudio(tempAudio, randomizeEffects);
		}
	};

	const renderPlayerTrainingStartAudio = (audio: IAudio): JSX.Element => {
		if (audio.Name === "INTROVERT") {
			const open: boolean = DisplayTrainingModules[0] && trainingAnchorEl !== null;
			return (
				<span key={`trainingmodule${uuid}`} ref={trainingStartAudio}>
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
						uuid={uuid}
					/>
				</span>
			);
		}
	};

	const renderGradient = (song: IAudio): JSX.Element => {
		const baseColor: string = SelectedAudio && SelectedAudio.Name === song.Name && song.CardColor ? song.CardColor : "#bbbbbb";
		const hslValues: number[] = HexToHSL(baseColor);
		let swatches: JSX.Element[] = [];
		const hueFactor: number = 2;
		const saturationFactor: number = hslValues[1] / 10;
		const lightnessFactor: number = hslValues[2] / 75;

		for (let i = 0; i < 5; i++) {
			const backgroundColor: string = ("hsl(" + (hslValues[0] + i * 4 * hueFactor) + ", " + (hslValues[1] + (Math.pow(i, 2) - 4) * saturationFactor) + "%, " + (hslValues[2] + (Math.pow(i, 2) - 4) * lightnessFactor) + "%)") as string;
			swatches.push(<div key={`swatch${i}${uuid}`} style={{ backgroundColor: backgroundColor, height: "30px" }} />);
		}

		return (
			<Stack key={`swatchstack${uuid}`} style={{ width: "100%" }}>
				{swatches}
			</Stack>
		);
	};

	const renderAudio = (song: IAudio): JSX.Element => {
		return (
			<React.Fragment>
				<Stack key={`buttonstack${uuid}`} style={{ backgroundColor: "#FEFEFE", borderRadius: "10px", paddingLeft: "2px", paddingRight: "4px" }}>
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
						onClick={() => updateAudio(song, false, false)}
						key={`playbutton${uuid}`}
					>
						<PlayArrowIcon
							sx={{
								color: SelectedAudio && SelectedAudio.Name === song.Name && song.CardColor ? song.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9",
								borderRadius: "3px"
							}}
							key={`playicon${uuid}`}
						></PlayArrowIcon>
					</Button>
					{renderPlayerTrainingStartAudio(song)}
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
						onClick={() => updateAudio(song, true, false)}
						key={`reversebutton${uuid}`}
					>
						<RestartAltIcon
							sx={{
								color: SelectedAudio && SelectedAudio.Name === song.Name && song.CardColor ? song.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9",
								borderRadius: "3px"
							}}
							key={`reverseicon${uuid}`}
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
						onClick={() => updateAudio(song, Math.random() > 0.5, true)}
						key={`randombutton${uuid}`}
					>
						<CasinoIcon
							sx={{
								color: SelectedAudio && SelectedAudio.Name === song.Name && song.CardColor ? song.CardColor : "#bbbbbb",
								borderRadius: "3px",
								boxShadow: "0px 2px 2px #DBD9D9"
							}}
							key={`randomicon${uuid}`}
						></CasinoIcon>
					</Button>
				</Stack>
			</React.Fragment>
		);
	};

	const renderAlbumArt = (song: IAudio): JSX.Element => {
		if (song.AlbumArt) {
			return (
				<Box key={`albumartbox${uuid}`} sx={{ display: "flex", flex: "2", alignItems: "center", justifyContent: "right" }}>
					<CardMedia key={`albumart${uuid}`} component="img" height={110} sx={{ width: 151, borderRadius: 1, boxShadow: "-2px -2px 4px #bbbbbb" }} image={song.AlbumArt.images.fallback.src} />
				</Box>
			);
		}
	};

	return (
		<React.Fragment>
			<Grid item key={`grid${uuid}`} xs={1} sm={2} md={2}>
				<Card key={`card${uuid}`} sx={{ display: "flex", height: "110px" }}>
					<Divider key={`divider${uuid}`} orientation="vertical" sx={{ borderWidth: "5px", backgroundColor: SelectedAudio && SelectedAudio.Name === audio.Name && audio.CardColor ? audio.CardColor : "#bbbbbb" }}></Divider>
					<TinyText key={`tt${uuid}`} style={{ justifyContent: "center", writingMode: "vertical-lr", rotate: "180deg", display: "flex", alignItems: "left" }}>
						{audio.Name}
					</TinyText>
					{renderGradient(audio)}
					<Box key={`outerbox${uuid}`} sx={{ justifyContent: "center", display: "flex", flex: "2", flexDirection: "column", alignItems: "center" }}>
						<Box key={`innerbox${uuid}`} sx={{ display: "flex", alignItems: "center" }}>
							{renderAudio(audio)}
						</Box>
					</Box>
					{renderAlbumArt(audio)}
				</Card>
			</Grid>
		</React.Fragment>
	);
};

export default AudioCard;
