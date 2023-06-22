import { Box, Button, Card, CardContent, CardMedia, Divider, Grid, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { AppContext } from "../context/AppContext";
import { IAudio } from "../types/IAudio";
import { createStyles, styled, Theme, useTheme } from "@mui/material/styles";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CasinoIcon from "@mui/icons-material/Casino";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import "@fontsource-variable/cinzel";
import { HexToHSL } from "./colorPicker/Helpers";

const CardList: React.FunctionComponent<any> = ({}): JSX.Element => {
	const appContext = React.useContext(AppContext);

	const theme = useTheme();

	const TinyText = styled(Typography)({
		fontSize: ".8rem",
		opacity: 0.38,
		fontWeight: 250,
		letterSpacing: 0.2
	});

	const updateAudio = (audio: IAudio, reversed: boolean, randomizeEffects: boolean): void => {
		let tempAudio: IAudio = { ...audio };
		tempAudio.Reversed = reversed;
		tempAudio.Paused = false;
		appContext.UpdateSelectedAudio(tempAudio, randomizeEffects);
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
								color: audio.CardColor ? audio.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9"
							}}
						></PlayArrowIcon>
					</Button>
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
								color: audio.CardColor ? audio.CardColor : "#bbbbbb",
								boxShadow: "0px 2px 2px #DBD9D9"
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
								color: audio.CardColor ? audio.CardColor : "#bbbbbb",
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

	const renderSwatches = (cardColor: string): JSX.Element => {
		const baseColor: string = cardColor ? cardColor : "#bbbbbb";
		const hslValues: number[] = HexToHSL(baseColor);
		let swatches: JSX.Element[] = [];
		const hueFactor: number = 5;
		const saturationFactor: number = hslValues[1] / 10;
		const lightnessFactor: number = hslValues[2] / 75;

		for (let i = 0; i < 5; i++) {
			const backgroundColor: string = ("hsl(" + (hslValues[0] - i * hueFactor) + ", " + (hslValues[1] + (Math.pow(i, 2) - 4) * saturationFactor) + "%, " + (hslValues[2] + (Math.pow(i, 2) - 4) * lightnessFactor) + "%)") as string;
			swatches.push(<div style={{ backgroundColor: backgroundColor, height: "30px" }} />);
		}

		return <Stack style={{ width: "-webkit-fill-available" }}>{swatches}</Stack>;
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

	return (
		<div style={{ backgroundColor: "#eeeeee", flexGrow: 1, padding: theme.spacing(2) }}>
			<Grid container spacing={2} direction="row" columns={{ xs: 1, sm: 4, md: 8 }}>
				{appContext.Tracks.map((track: IAudio) => (
					<Grid item key={track.Name} xs={1} sm={2} md={2}>
						<Card sx={{ display: "flex", height: "110px" }}>
							<Divider orientation="vertical" sx={{ borderWidth: "5px", backgroundColor: track.CardColor ? track.CardColor : "#bbbbbb" }}></Divider>
							<TinyText style={{ justifyContent: "center", writingMode: "vertical-lr", rotate: "180deg", display: "flex", alignItems: "left" }}>{track.Name}</TinyText>
							{renderSwatches(track.CardColor)}
							<Box sx={{ justifyContent: "center", display: "flex", flex: "2", flexDirection: "column", alignItems: "center" }}>
								<Box sx={{ display: "flex", alignItems: "center" }}>{renderAudio(track)}</Box>
							</Box>
							{renderAlbumArt(track)}
						</Card>
					</Grid>
				))}
			</Grid>
		</div>
	);
};

export default CardList;
