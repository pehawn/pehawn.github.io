import * as React from "react";
import { AppContext } from "../context/AppContext";
import ColorSlider from "./ColorSlider";
import { IAudio } from "../types/IAudio";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CasinoIcon from "@mui/icons-material/Casino";
import "@fontsource/archivo";
import { AnimatePresence, motion } from "framer-motion";
import { ISwatch } from "../types/ISwatch";

const SwatchesList: React.FunctionComponent<any> = ({}): JSX.Element => {
	const appContext = React.useContext(AppContext);

	const [selectedHueValue, setSelectedHueValue] = React.useState<number>();
	const [selectedSaturationValue, setSelectedSaturationValue] = React.useState<number>();
	const [selectedLightnessValue, setSelectedLightnessValue] = React.useState<number>();
	const [saturationFactor, setSaturationFactor] = React.useState<number>();
	const [lightnessFactor, setLightnessFactor] = React.useState<number>();
	const [hueFactor, setHueFactor] = React.useState<number>();
	const [iconColor, setIconColor] = React.useState<string>("darkgrey");

	React.useEffect(() => {
		if (appContext.SelectedSwatch) {
			const tempSatFactor: number = appContext.SelectedSwatch.SaturationValue / 10;
			const tempLightnessFactor: number = appContext.SelectedSwatch.LightnessValue / 55;

			setSelectedHueValue(appContext.SelectedSwatch.HueValue);
			setSelectedSaturationValue(appContext.SelectedSwatch.SaturationValue);
			setSelectedLightnessValue(appContext.SelectedSwatch.LightnessValue);
			setLightnessFactor(tempLightnessFactor);
			setSaturationFactor(tempSatFactor);
			setHueFactor(5);
			setIconColor(appContext.SelectedSwatch.HexValue);
		}
	}, [appContext.SelectedSwatch]);

	const updateAudio = (reversed: boolean, index: number, randomizeEffects: boolean): void => {
		let tempAudio: IAudio = appContext.SelectedSwatch.Tracks[index];
		tempAudio.Reversed = reversed;
		tempAudio.Paused = false;
		appContext.UpdateSelectedAudio(tempAudio, randomizeEffects);
	};

	const renderAudio = (index: number): JSX.Element => {
		if (appContext.SelectedSwatch && appContext.SelectedSwatch.Tracks[index]) {
			const audio: IAudio = appContext.SelectedSwatch.Tracks[index];

			return (
				<React.Fragment>
					<div
						style={{
							position: "relative",
							padding: "1em",
							verticalAlign: "center"
						}}
					>
						<div
							style={{
								fontFamily: "Archivo",
								color: "white",
								textShadow: "2px 2px 4px #4A4949",
								position: "absolute",
								fontSize: "25px",
								paddingTop: ".6em",
								paddingLeft: ".6em"
							}}
						>
							{audio.Name}
						</div>
						<AnimatePresence>
							{audio.IsHover && (
								<motion.div
									initial={{ x: 1000, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									exit={{ x: 1000, opacity: 0 }}
									transition={{ duration: 0.25 }}
									style={{
										position: "absolute",
										right: "0",
										fontSize: "25px",
										paddingTop: ".2em",
										paddingRight: ".6em"
									}}
								>
									<div style={{ backgroundColor: "#FEFEFE", borderRadius: "10px" }}>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											style={{
												display: "inline-flex",
												alignItems: "center",
												position: "relative",
												justifyContent: "center",
												border: "none",
												boxSizing: "border-box",
												verticalAlign: "middle",
												backgroundColor: "transparent",
												padding: "8px"
											}}
											onClick={() => updateAudio(Math.random() > 0.5, index, true)}
										>
											<CasinoIcon
												sx={{
													color: iconColor,
													boxShadow: "2px 2px 4px #DBD9D9"
												}}
											></CasinoIcon>
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											style={{
												transform: "none",
												display: "inline-flex",
												alignItems: "center",
												position: "relative",
												justifyContent: "center",
												border: "none",
												boxSizing: "border-box",
												verticalAlign: "middle",
												backgroundColor: "transparent",
												padding: "8px"
											}}
											onClick={() => updateAudio(true, index, false)}
										>
											<RestartAltIcon
												sx={{
													color: iconColor,
													boxShadow: "2px 2px 4px #DBD9D9"
												}}
											></RestartAltIcon>
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											style={{
												transform: "none",
												display: "inline-flex",
												alignItems: "center",
												position: "relative",
												justifyContent: "center",
												border: "none",
												boxSizing: "border-box",
												verticalAlign: "middle",
												backgroundColor: "transparent",
												padding: "8px"
											}}
											onClick={() => updateAudio(false, index, false)}
										>
											<PlayArrowIcon
												sx={{
													color: iconColor,
													boxShadow: "2px 2px 4px #DBD9D9"
												}}
											></PlayArrowIcon>
										</motion.button>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</React.Fragment>
			);
		}
	};

	const renderSwatches = (): JSX.Element[] => {
		let tempSwatches: JSX.Element[] = [];

		for (let i = 0; i < 8; i++) {
			if (i === 7) {
				tempSwatches.push(
					<div style={{ boxShadow: "inset 0px 4px 5px .1px #E1E1E1" }}>
						<ColorSlider />
					</div>
				);
			} else {
				const backgroundColor: string = i === 6 ? (("hsl(" + (selectedHueValue - i * hueFactor) + ", " + (selectedSaturationValue + (Math.pow(i, 2) - 4) * saturationFactor) + "%, " + (selectedLightnessValue + (Math.pow(i, 2) - 4) * lightnessFactor) + "%)") as string) : (("hsl(" + (selectedHueValue - i * hueFactor) + ", " + (selectedSaturationValue + Math.pow(i, 2) * saturationFactor) + "%, " + (selectedLightnessValue + Math.pow(i, 2) * lightnessFactor) + "%)") as string);

				tempSwatches.push(
					<AnimatePresence onExitComplete={() => appContext.SetUpdateSwatch(true)}>
						{appContext.UpdateSwatch && (
							<motion.div animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.75 }}>
								<div
									style={{
										backgroundColor: backgroundColor,
										height: "4.9em"
									}}
									onMouseOver={() => {
										if (appContext.SelectedSwatch.Tracks[i]) {
											const selectedSwatch: ISwatch = { ...appContext.SelectedSwatch };
											const hoveredTrack: IAudio = appContext.SelectedSwatch.Tracks[i];
											hoveredTrack.IsHover = true;
											selectedSwatch.Tracks[i] = hoveredTrack;
											appContext.SetSelectedSwatch(selectedSwatch);
										}
									}}
									onMouseLeave={() => {
										if (appContext.SelectedSwatch.Tracks[i]) {
											const selectedSwatch: ISwatch = { ...appContext.SelectedSwatch };
											const hoveredTrack: IAudio = appContext.SelectedSwatch.Tracks[i];
											hoveredTrack.IsHover = false;
											selectedSwatch.Tracks[i] = hoveredTrack;
											appContext.SetSelectedSwatch(selectedSwatch);
										}
									}}
								>
									{renderAudio(i)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				);
			}
		}

		return tempSwatches;
	};

	const renderAnimation = (): JSX.Element => {
		return <React.Fragment>{renderSwatches()}</React.Fragment>;
	};

	return <React.Fragment>{renderAnimation()}</React.Fragment>;
};

export default SwatchesList;
