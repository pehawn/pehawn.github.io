import React from "react";
import { AppContext } from "../context/AppContext";
import * as Tone from "tone";
import { IconButton, Popover, Stack } from "@mui/material";
import { IAudio } from "../types/IAudio";
import { PauseRounded, PlayArrowRounded } from "@mui/icons-material";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import CloseIcon from "@mui/icons-material/Close";

interface IPlayerControlsCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

const PlayerControlsCallout: React.FunctionComponent<IPlayerControlsCallout> = (props): JSX.Element => {
	const { open, anchor, closeCallout } = props;
	const { Player, PlayerTimestamp, SetPlayerTimestamp, SelectedAudio, SetSelectedAudio } = React.useContext(AppContext);

	const [isPaused, setIsPaused] = React.useState<boolean>(false);

	const jumpToPosition = (seconds: number): void => {
		Tone.Transport.clear(SelectedAudio.CurrentTimestampEventId);
		const updatedTimestamp: number = PlayerTimestamp + seconds;
		Tone.Transport.seconds = updatedTimestamp;

		let currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
			() => {
				SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			updatedTimestamp,
			SelectedAudio.Duration - updatedTimestamp
		);

		const tempAudio: IAudio = { ...SelectedAudio };
		tempAudio.CurrentTimestampEventId = currentTimestampEventId;
		SetPlayerTimestamp(updatedTimestamp);
		SetSelectedAudio(tempAudio);
	};

	const renderPlayPauseControl = (): JSX.Element => {
		if (!isPaused && Tone.Transport.state !== "paused") {
			return (
				<IconButton
					disabled={PlayerTimestamp >= SelectedAudio.Duration - 1}
					color={"primary"}
					onClick={() => {
						Tone.Transport.pause();
						setIsPaused(true);
					}}
				>
					<PauseRounded></PauseRounded>
				</IconButton>
			);
		} else {
			return (
				<IconButton
					disabled={PlayerTimestamp >= SelectedAudio.Duration - 1}
					color={"primary"}
					onClick={() => {
						Tone.Transport.start();
						setIsPaused(false);
					}}
				>
					<PlayArrowRounded></PlayArrowRounded>
				</IconButton>
			);
		}
	};

	const renderPlayerControls = (): JSX.Element => {
		return (
			<React.Fragment>
				<IconButton
					disabled={PlayerTimestamp <= 10}
					color={"primary"}
					onClick={() => {
						jumpToPosition(-10);
					}}
				>
					<Replay10RoundedIcon></Replay10RoundedIcon>
				</IconButton>
				<IconButton
					color={"primary"}
					onClick={() => {
						Tone.Transport.stop();
						if (SelectedAudio.CurrentTimestampEventId) {
							Tone.Transport.clear(SelectedAudio.CurrentTimestampEventId);
						}

						if (Tone.Transport.state === "paused") {
							Tone.Transport.start();
						}

						if (SelectedAudio.Stems.length > 0) {
							SelectedAudio.Stems.forEach((stem) => {
								Player.current.player(stem.Name).unsync();
								Player.current.player(stem.Name).dispose();
							});
						} else {
							Player.current.unsync();
							Player.current.dispose();
						}
						SetSelectedAudio(null);

						// Reset page background color
						const bodyElement = document.querySelector("body");
						bodyElement.style.background = "#d8d8d8";

						closeCallout();
					}}
				>
					<StopRoundedIcon></StopRoundedIcon>
				</IconButton>
				{renderPlayPauseControl()}
				<IconButton
					disabled={PlayerTimestamp + 10 > SelectedAudio.Duration}
					color={"primary"}
					onClick={() => {
						jumpToPosition(10);
					}}
				>
					<Forward10RoundedIcon></Forward10RoundedIcon>
				</IconButton>
			</React.Fragment>
		);
	};

	if (Player.current.loaded) {
		return (
			<Popover
				open={open}
				anchorEl={anchor}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center"
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
								closeCallout();
							}}
							color={"primary"}
						>
							<CloseIcon></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Stack height="3em" direction="row" alignItems="center">
					{renderPlayerControls()}
				</Stack>
			</Popover>
		);
	}
};

export default PlayerControlsCallout;
