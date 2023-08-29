import React, { memo } from "react";
import { AppContext } from "../context/AppContext";
import * as Tone from "tone";
import { Button, Grid, IconButton, Popover } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";

interface ILooperCallout {
	open: boolean;
	anchor: any;
	closeCallout();
}

let LooperCallout: React.FunctionComponent<ILooperCallout> = (props): JSX.Element => {
	const { open, anchor, closeCallout } = props;

	const env: string = process.env.GATSBY_ENV;

	const { Player, PlayerTimestamp, SetPlayerTimestamp, TempoLevel, SelectedAudio } = React.useContext(AppContext);

	const [startLoopEnabled, setStartLoopEnabled] = useDevHook<boolean>(true, "startLoopEnabled", ReactHook.State, env);
	const [endLoopEnabled, setEndLoopEnabled] = useDevHook<boolean>(true, "endLoopEnabled", ReactHook.State, env);
	const [startLoopTime, setStartLoopTime] = useDevHook<number>(null, "startLoopTime", ReactHook.State, env);
	const [endLoopTime, setEndLoopTime] = useDevHook<number>(null, "endLoopTime", ReactHook.State, env);

	React.useEffect(() => {
		if (!startLoopEnabled && !endLoopEnabled) {
			loadLoop();
		}
	}, [startLoopEnabled, endLoopEnabled]);

	const loadLoop = async (): Promise<void> => {
		Tone.Transport.cancel();

		if (SelectedAudio.Stems.length > 0) {
			SelectedAudio.Stems.forEach((stem) => {
				Player.current.player(stem.Name).unsync();
				Player.current.player(stem.Name).dispose();
			});

			const initialURLs = SelectedAudio.Stems.reduce((acc, stem) => {
				const name: string = stem["Name"];
				acc[name] = stem["Path"];
				return acc;
			}, {});

			Player.current = new Tone.Players({
				urls: initialURLs,
				onload: async () => {
					await Promise.all(
						SelectedAudio.Stems.map(async (stem) => {
							const stemMuted: boolean = stem.Channel.muted;
							const tempChannel = new Tone.Channel().toDestination();
							stem.Channel = tempChannel;
							Player.current.player(stem.Name).connect(tempChannel);
							Player.current.player(stem.Name).reverse = SelectedAudio.Reversed;
							Player.current.player(stem.Name).playbackRate = TempoLevel;
							Player.current.player(stem.Name).volume.value = stem.Volume;
							Player.current.player(stem.Name).mute = stemMuted;
							Player.current.player(stem.Name).sync();
							Player.current.player(stem.Name).start(0);
						})
					);

					Tone.Transport.loop = true;
					Tone.Transport.loopStart = startLoopTime;
					Tone.Transport.loopEnd = endLoopTime;
					Tone.Transport.start();
				}
			}).toDestination();
		} else {
			Player.current.unsync();
			Player.current = new Tone.Player();

			await Player.current.load(SelectedAudio.Path);

			Player.current.reverse = SelectedAudio.Reversed;
			Player.current.playbackRate = TempoLevel;
			Player.current.toDestination().sync().start(0);

			Tone.Transport.loop = true;
			Tone.Transport.loopStart = startLoopTime;
			Tone.Transport.loopEnd = endLoopTime;
			Tone.Transport.start();
		}
	};

	const cancelLoop = (): void => {
		Tone.Transport.loop = false;
		Tone.Transport.seconds = endLoopTime;

		const currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
			() => {
				SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			endLoopTime,
			SelectedAudio.Duration - endLoopTime
		);

		Tone.Transport.start();

		setEndLoopTime(null);
		setStartLoopTime(null);
		setStartLoopEnabled(true);
		setEndLoopEnabled(true);
	};

	const downloadLoop = async (): Promise<void> => {
		const recorder = new Tone.Recorder({
			mimeType: "audio/webm"
		});

		Player.current.connect(recorder);
		recorder.start();

		await setTimeout(async () => {
			const tempBlob: Blob = await recorder.stop();
			const url = URL.createObjectURL(tempBlob);
			const anchor = document.createElement("a");
			anchor.download = "recording.webm";
			anchor.href = url;
			anchor.click();
		}, 4000);
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
							left: "0"
						}}
					>
						<IconButton
							color={"primary"}
							disabled={startLoopEnabled || endLoopEnabled}
							onClick={() => {
								cancelLoop();
							}}
						>
							<RemoveCircleOutlineIcon></RemoveCircleOutlineIcon>
						</IconButton>
						<IconButton
							color={"primary"}
							disabled={true}
							onClick={() => {
								downloadLoop();
							}}
						>
							<FileDownloadIcon></FileDownloadIcon>
						</IconButton>
					</div>
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
							style={{ backgroundColor: "transparent" }}
						>
							<CloseIcon></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Grid container spacing={1} padding={1}>
					<Grid item>
						<Button
							variant="contained"
							disabled={!startLoopEnabled || Tone.Transport.state !== "started"}
							onClick={() => {
								Tone.Transport.loopStart = PlayerTimestamp;
								setStartLoopTime(PlayerTimestamp);
								setStartLoopEnabled(false);
							}}
							style={{ minWidth: "6em" }}
						>
							Start
						</Button>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							disabled={!endLoopEnabled || Tone.Transport.state !== "started"}
							onClick={() => {
								Tone.Transport.loopEnd = PlayerTimestamp;
								setEndLoopTime(PlayerTimestamp);
								setEndLoopEnabled(false);
							}}
							style={{ minWidth: "6em" }}
						>
							End
						</Button>
					</Grid>
				</Grid>
			</Popover>
		</React.Fragment>
	);
};

LooperCallout = memo(LooperCallout);

export default LooperCallout;
