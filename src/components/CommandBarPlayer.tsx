import { Box, IconButton, Slider, Stack, ThemeProvider, Typography, createTheme, styled, useTheme } from "@mui/material";
import React from "react";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import RadioIcon from "@mui/icons-material/Radio";
import { AppContext } from "../context/AppContext";
import * as Tone from "tone";
import TrainingModuleDialog from "./TrainingModuleDialog";
// @ts-ignore
import TrainingPlayerControls from "../assets/training/TrainingPlayerControls.mp4";
// @ts-ignore
import TrainingStems from "../assets/training/TrainingStems.mp4";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";

const PlayerControlsCallout = React.lazy(() => import("./PlayerControlsCallout"));
const StemsCallout = React.lazy(() => import("./StemsCallout"));

interface ICommandBarPlayer {
	isMobile: boolean;
}

const CommandBarPlayer: React.FunctionComponent<ICommandBarPlayer> = (props): JSX.Element => {
	const { isMobile } = props;

	const env: string = process.env.GATSBY_ENV;

	const { SelectedAudio, PlayerTimestamp, DisplayTrainingModules } = React.useContext(AppContext);

	const playerControlsRef = useDevHook(null, "playerControlsRef", ReactHook.Ref, env);
	const stemsRef = useDevHook(null, "stemsRef", ReactHook.Ref, env);
	const trainingStems = useDevHook(null, "trainingStems", ReactHook.Ref, env);
	const trainingPlayerControls = useDevHook(null, "trainingPlayerControls", ReactHook.Ref, env);

	const [showStemsDialog, setShowStemsDialog] = useDevHook<boolean>(false, "showStemsDialog", ReactHook.State, env);
	const [stemsAnchorEl, setStemsAnchorEl] = useDevHook(null, "stemsAnchor", ReactHook.State, env);
	const [showPlayerControlsDialog, setShowPlayerControlsDialog] = useDevHook<boolean>(false, "showPlayerControls", ReactHook.State, env);
	const [playerControlsAnchorEl, setPlayerControlsAnchorEl] = useDevHook(null, "playerControlsAnchor", ReactHook.State, env);
	const [trainingAnchorEl, setTrainingAnchorEl] = useDevHook(null, "trainingAnchor", ReactHook.State, env);

	const theme = useTheme();

	const darkGreyTheme = createTheme({
		palette: {
			primary: {
				main: "#9a9a9a"
			},
			secondary: {
				main: "#9a9a9a"
			}
		}
	});

	const TinyText = styled(Typography)({
		fontSize: "0.75rem",
		opacity: 0.38,
		fontWeight: 500,
		letterSpacing: 0.2
	});

	React.useEffect(() => {
		if (DisplayTrainingModules[2]) {
			setTrainingAnchorEl(trainingStems.current);
		} else if (DisplayTrainingModules[4]) {
			setTrainingAnchorEl(trainingPlayerControls.current);
		}
	}, [DisplayTrainingModules]);

	const formatDuration = (value: number): string => {
		const minute = Math.floor(value / 60);
		const secondLeft = Math.round(value - minute * 60);
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	};

	const renderTimingInfo = (): JSX.Element => {
		if (PlayerTimestamp <= SelectedAudio.Duration) {
			return (
				<React.Fragment>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							mt: isMobile ? 0 : -2,
							marginTop: isMobile ? "0px" : "-7px"
						}}
					>
						<TinyText>{(Tone.Transport.state === "started" || Tone.Transport.state === "paused") && formatDuration(PlayerTimestamp)}</TinyText>
						<TinyText>-{(Tone.Transport.state === "started" || Tone.Transport.state === "paused") && formatDuration(SelectedAudio.Duration - PlayerTimestamp)}</TinyText>
					</Box>
				</React.Fragment>
			);
		}
	};

	const renderPlayerTrainingStems = (): JSX.Element => {
		const open: boolean = DisplayTrainingModules[2] && trainingAnchorEl !== null;

		return (
			<span ref={trainingStems}>
				<TrainingModuleDialog
					finalStep={false}
					isOpen={open}
					closeDialog={() => {
						setTrainingAnchorEl(null);
					}}
					currentStep={3}
					headerText="3 of 6"
					trainingAnchorEl={isMobile ? null : trainingAnchorEl}
					trainingText="Isolate the audio's instruments using the stem sliders. Press the sound icon to mute the track. Press the recycle icon to reset the stem sliders to default."
					trainingVideo={TrainingStems}
				/>
			</span>
		);
	};

	const renderPlayerTrainingPlayerControls = (): JSX.Element => {
		const open: boolean = DisplayTrainingModules[4] && trainingAnchorEl !== null;

		return (
			<span ref={trainingPlayerControls}>
				<TrainingModuleDialog
					finalStep={false}
					isOpen={open}
					closeDialog={() => {
						setTrainingAnchorEl(null);
					}}
					currentStep={5}
					headerText="5 of 6"
					trainingAnchorEl={isMobile ? null : trainingAnchorEl}
					trainingText="Pause, stop, fast forward, or rewind the audio using the respective controls."
					trainingVideo={TrainingPlayerControls}
				/>
			</span>
		);
	};

	return (
		<React.Fragment>
			<Stack spacing={1.5} direction="row">
				{renderPlayerTrainingStems()}
				<span ref={stemsRef}>
					<ThemeProvider theme={darkGreyTheme}>
						<IconButton
							color={"primary"}
							style={{
								backgroundColor: "transparent"
							}}
							disabled={SelectedAudio.Stems.length === 0}
							{...(!isMobile && {
								onClick: () => {
									setShowStemsDialog(true);
									setStemsAnchorEl(stemsRef.current);
								}
							})}
							{...(isMobile && {
								onMouseOver: () => {
									setShowStemsDialog(true);
									setStemsAnchorEl(stemsRef.current);
								}
							})}
						>
							<SettingsInputCompositeIcon></SettingsInputCompositeIcon>
						</IconButton>
						<React.Suspense>
							{!DisplayTrainingModules.find((displayModule) => displayModule === true) && (
								<StemsCallout
									open={showStemsDialog}
									anchor={stemsAnchorEl}
									closeCallout={() => {
										setShowStemsDialog(false);
										setStemsAnchorEl(null);
									}}
								/>
							)}
						</React.Suspense>
					</ThemeProvider>
				</span>
				<div>
					<TinyText sx={{ textAlign: "center", letterSpacing: 10 }}>{SelectedAudio.Name}</TinyText>
					<Slider
						aria-label="time-indicator"
						size="small"
						value={PlayerTimestamp}
						min={0}
						step={1}
						max={SelectedAudio.Duration}
						sx={{
							color: theme.palette.mode === "dark" ? "#fff" : "#9a9a9a",
							height: 4,
							padding: "6px 0px",
							width: "250px",
							"@media (pointer: coarse)": {
								padding: !isMobile ? "5px" : "0px"
							},
							"& .MuiSlider-thumb": {
								width: 8,
								height: 8,
								transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
								"&:before": {
									boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)"
								},
								"&:hover, &.Mui-focusVisible": {
									boxShadow: `0px 0px 0px 8px ${theme.palette.mode === "dark" ? "rgb(255 255 255 / 16%)" : "rgb(0 0 0 / 16%)"}`
								},
								"&.Mui-active": {
									width: 20,
									height: 20
								}
							},
							"& .MuiSlider-rail": {
								opacity: 0.28
							}
						}}
					/>
					{renderTimingInfo()}
				</div>
				<span ref={playerControlsRef}>
					<ThemeProvider theme={darkGreyTheme}>
						<IconButton
							color={"primary"}
							style={{
								backgroundColor: "transparent"
							}}
							{...(!isMobile && {
								onClick: () => {
									setShowPlayerControlsDialog(true);
									setPlayerControlsAnchorEl(playerControlsRef.current);
								}
							})}
							{...(isMobile && {
								onMouseOver: () => {
									setShowPlayerControlsDialog(true);
									setPlayerControlsAnchorEl(playerControlsRef.current);
								}
							})}
						>
							<RadioIcon></RadioIcon>
						</IconButton>
						<React.Suspense>
							{!DisplayTrainingModules.find((displayModule) => displayModule === true) && (
								<PlayerControlsCallout
									open={showPlayerControlsDialog}
									anchor={playerControlsAnchorEl}
									closeCallout={() => {
										setShowPlayerControlsDialog(false);
										setPlayerControlsAnchorEl(null);
									}}
								/>
							)}
						</React.Suspense>
					</ThemeProvider>
				</span>
				{renderPlayerTrainingPlayerControls()}
			</Stack>
		</React.Fragment>
	);
};

export default CommandBarPlayer;