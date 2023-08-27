import { IconButton, Popover, Slider, Stack, ThemeProvider, createTheme } from "@mui/material";
import React from "react";
import * as Tone from "tone";
import { AppContext } from "../context/AppContext";
import ReplayIcon from "@mui/icons-material/Replay";
import CloseIcon from "@mui/icons-material/Close";
import CableIcon from "@mui/icons-material/Cable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GradientIcon from "@mui/icons-material/Gradient";
import CellTowerIcon from "@mui/icons-material/CellTower";
import BuildIcon from "@mui/icons-material/Build";
import CampaignIcon from "@mui/icons-material/Campaign";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import RouterIcon from "@mui/icons-material/Router";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { IAudio } from "../types/IAudio";

interface IEffectsCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

const EffectsCallout: React.FunctionComponent<IEffectsCallout> = (props): JSX.Element => {
	const { open, anchor, closeCallout } = props;
	const { PlayerTimestamp, SetPlayerTimestamp, SelectedAudio, SetSelectedAudio, ResetToDefaults, DistortionLevel, HandleDistortionLevel, VisualTempoLevel, HandleTempoLevel, PitchLevel, HandlePitchLevel, FeedbackDelayLevel, HandleFeedbackDelayLevel, ChorusLevel, HandleChorusLevel, VibratoLevel, HandleVibratoLevel, LowPassFilterLevel, HandleLowPassFilterLevel, ReverbLevel, HandleReverbLevel, PhaserLevel, HandlePhaserLevel, TempoLevel, SetTempoLevel } = React.useContext(AppContext);

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

	const updateScheduleTimingEvent = (event: Event, value: number): void => {
		const updatedDuration: number = (TempoLevel / value) * SelectedAudio.Duration;
		const timestampRatio: number = PlayerTimestamp / SelectedAudio.Duration;
		let updatedTimestamp: number = Math.round(timestampRatio * updatedDuration);

		Tone.Transport.clear(SelectedAudio.CurrentTimestampEventId);
		Tone.Transport.seconds = updatedTimestamp;

		let currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
			() => {
				SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			updatedTimestamp,
			updatedDuration - updatedTimestamp
		);

		const tempAudio: IAudio = { ...SelectedAudio };
		tempAudio.CurrentTimestampEventId = currentTimestampEventId;
		tempAudio.Duration = updatedDuration;
		SetTempoLevel(value);
		SetPlayerTimestamp(updatedTimestamp);
		SetSelectedAudio(tempAudio);
	};

	return (
		<React.Fragment>
			<Popover
				open={open}
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right"
				}}
				sx={{
					"& .MuiPaper-root": {
						overflowY: "hidden",
						padding: ".5em .75em .5em .5em"
					}
				}}
			>
				<div
					style={{
						position: "relative",
						padding: "1em",
						verticalAlign: "center"
					}}
				>
					<div
						style={{
							position: "absolute",
							top: "0",
							right: "0"
						}}
					>
						<IconButton
							onClick={() => {
								ResetToDefaults();
							}}
							disabled={Tone.Transport.state !== "started"}
							style={{ paddingRight: "1px" }}
							color={"primary"}
						>
							<ReplayIcon></ReplayIcon>
						</IconButton>
						<IconButton
							onClick={() => {
								closeCallout();
							}}
							color={"primary"}
							style={{ backgroundColor: "transparent" }}
						>
							<CloseIcon></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<CableIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={DistortionLevel}
						onChange={HandleDistortionLevel}
						step={1}
						min={0}
						max={100}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<AccessTimeIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						step={0.01}
						min={0.01}
						max={3.4}
						value={VisualTempoLevel}
						onChange={HandleTempoLevel}
						onChangeCommitted={updateScheduleTimingEvent}
						track={false}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<GradientIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						step={1}
						min={-12}
						max={12}
						value={PitchLevel}
						onChange={HandlePitchLevel}
						track={false}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<CellTowerIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={FeedbackDelayLevel}
						onChange={HandleFeedbackDelayLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<BuildIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={ChorusLevel}
						onChange={HandleChorusLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<CampaignIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={VibratoLevel}
						onChange={HandleVibratoLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<SmokingRoomsIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={LowPassFilterLevel}
						onChange={HandleLowPassFilterLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<RouterIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={ReverbLevel}
						onChange={HandleReverbLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
				<Stack
					width="10em"
					spacing={2}
					direction="row"
					sx={{
						m: 0.5
					}}
					alignItems="center"
				>
					<ThemeProvider theme={darkGreyTheme}>
						<HeartBrokenIcon color={"primary"} />
					</ThemeProvider>
					<Slider
						disabled={Tone.Transport.state !== "started"}
						value={PhaserLevel}
						onChange={HandlePhaserLevel}
						valueLabelDisplay={"auto"}
						sx={{
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								width: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
					/>
				</Stack>
			</Popover>
		</React.Fragment>
	);
};

export default EffectsCallout;
