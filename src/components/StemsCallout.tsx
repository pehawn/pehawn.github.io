import React from "react";
import { AppContext } from "../context/AppContext";
import { IStem } from "../types/IStem";
import { v4 as uuidv4 } from "uuid";
import { IconButton, Popover, Slider, Stack, Typography, styled } from "@mui/material";
import { IAudio } from "../types/IAudio";
import * as Tone from "tone";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import CloseIcon from "@mui/icons-material/Close";
import ReplayIcon from "@mui/icons-material/Replay";

interface IStemsCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

const uuid = uuidv4();

const StemsCallout: React.FunctionComponent<IStemsCallout> = (props): JSX.Element => {
	const { open, anchor, closeCallout } = props;
	const { Player, SelectedAudio, SetSelectedAudio, ResetVolumeLevels } = React.useContext(AppContext);

	const TinyText = styled(Typography)({
		fontSize: "0.75rem",
		opacity: 0.38,
		fontWeight: 500,
		letterSpacing: 0.2
	});

	const renderStemSliders = (): JSX.Element[] => {
		const renderStemVolumeButton = (stem: IStem): JSX.Element => {
			if (stem.Channel && !Player.current.player(stem.Name).mute) {
				return <VolumeUpIcon key={`volumeup${uuid}`}></VolumeUpIcon>;
			} else {
				return <VolumeOffIcon key={`volumeoff${uuid}`}></VolumeOffIcon>;
			}
		};

		const stemSliders: JSX.Element[] = SelectedAudio.Stems.map((stem) => {
			let currentStem: IStem = SelectedAudio.Stems.find((track) => track.Name === stem.Name);
			let currentStemIndex: number = SelectedAudio.Stems.indexOf(stem);

			return (
				<Stack
					height="15em"
					direction="column"
					sx={{
						m: 0.5
					}}
					alignItems="center"
					key={`${stem.Name}${uuid}`}
				>
					<TinyText key={`stemname${uuid}`}>{stem.Name}</TinyText>
					<IconButton
						color={"primary"}
						style={{
							backgroundColor: "transparent"
						}}
						onClick={() => {
							let audio: IAudio = { ...SelectedAudio };

							if (!Player.current.player(stem.Name).mute) {
								audio.Stems[currentStemIndex].Channel.mute = true;
								Player.current.player(stem.Name).mute = true;
							} else {
								audio.Stems[currentStemIndex].Channel.mute = false;
								Player.current.player(stem.Name).mute = false;
							}
							SetSelectedAudio(audio);
						}}
						key={`stemmute${uuid}`}
					>
						{renderStemVolumeButton(stem)}
					</IconButton>
					<Slider
						sx={{
							'& input[type="range"]': {
								WebkitAppearance: "slider-vertical"
							},
							"& .MuiSlider-thumb": {
								borderRadius: "30%",
								height: "5px",
								"&:hover, &.Mui-focusVisible, &.Mui-active": {
									boxShadow: "none"
								}
							}
						}}
						disabled={Player.current.player(stem.Name).mute && Player.current.player(stem.Name).volume.value !== 0}
						orientation="vertical"
						value={currentStem.Volume}
						onChange={(_, value) => {
							let audio: IAudio = { ...SelectedAudio };
							audio.Stems[currentStemIndex].Volume = value as number;
							Player.current.player(stem.Name).volume.value = value;
							SetSelectedAudio(audio);
						}}
						max={6}
						step={0.5}
						min={-30}
						aria-label="Temperature"
						valueLabelDisplay="off"
						key={`stemvolume${uuid}`}
					/>
				</Stack>
			);
		});

		return stemSliders;
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
								ResetVolumeLevels();
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
						>
							<CloseIcon></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Stack
					height="15em"
					spacing={1}
					direction="row"
					sx={{
						m: 2
					}}
					alignItems="center"
				>
					{renderStemSliders()}
				</Stack>
			</Popover>
		);
	}
};

export default StemsCallout;
