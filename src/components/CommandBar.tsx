import * as React from "react";
import { Box, Button, CircularProgress, ClickAwayListener, Grid, IconButton, Link, Popover, Slider, Stack, Tooltip, Typography, Zoom, circularProgressClasses } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import TuneIcon from "@mui/icons-material/Tune";
import LoopIcon from "@mui/icons-material/Loop";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close";
import CableIcon from "@mui/icons-material/Cable";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CampaignIcon from "@mui/icons-material/Campaign";
import CellTowerIcon from "@mui/icons-material/CellTower";
import DeblurIcon from "@mui/icons-material/Deblur";
import BlurOnIcon from "@mui/icons-material/BlurOn";
import ExposureIcon from "@mui/icons-material/Exposure";
import GradientIcon from "@mui/icons-material/Gradient";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import RouterIcon from "@mui/icons-material/Router";
import SmokingRoomsIcon from "@mui/icons-material/SmokingRooms";
import ReplayIcon from "@mui/icons-material/Replay";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { AppContext } from "../context/AppContext";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import * as Tone from "tone";
import SettingsInputCompositeIcon from "@mui/icons-material/SettingsInputComposite";
import RadioIcon from "@mui/icons-material/Radio";
import { FastForwardRounded, FastRewindRounded, PauseRounded, PlayArrowRounded, StickyNote2 } from "@mui/icons-material";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import StopRoundedIcon from "@mui/icons-material/StopRounded";
import { IStem } from "../types/IStem";
import { IAudio } from "../types/IAudio";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
	<Tooltip
		{...props}
		classes={{
			popper: className
		}}
	/>
))(({ theme }) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: "rgba(0, 0, 0, 0.87)",
		boxShadow: theme.shadows[1],
		fontSize: 11
	}
}));

const CommandBar: React.FunctionComponent<any> = ({}): JSX.Element => {
	const appContext = React.useContext(AppContext);
	const whiteTheme = createTheme({
		palette: {
			primary: {
				main: "#FFFFFF"
			},
			secondary: {
				main: "#FFFFFF"
			}
		}
	});

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

	const redTheme = createTheme({
		palette: {
			primary: {
				main: "#FF0000"
			},
			secondary: {
				main: "#FF0000"
			}
		}
	});

	let isMobile = false;

	if (typeof window !== "undefined") {
		isMobile = window.innerWidth <= 768;
	}

	const looperRef = React.useRef();
	const effectsRef = React.useRef();
	const playerControlsRef = React.useRef();
	const stemsRef = React.useRef();
	const profileRef = React.useRef();
	const downloadsRef = React.useRef();

	const [recordTheme, setRecordTheme] = React.useState<any>(darkGreyTheme);
	const [recordingTooltip, setRecordingTooltip] = React.useState<string>("Say Hello");
	const [showLooperDialog, setShowLooperDialog] = React.useState<boolean>(false);
	const [looperAnchorEl, setLooperAnchorEl] = React.useState();
	const [startLoopEnabled, setStartLoopEnabled] = React.useState<boolean>(true);
	const [endLoopEnabled, setEndLoopEnabled] = React.useState<boolean>(true);
	const [startLoopTime, setStartLoopTime] = React.useState<number>(null);
	const [endLoopTime, setEndLoopTime] = React.useState<number>(null);
	const [showEffectsDialog, setShowEffectsDialog] = React.useState<boolean>(false);
	const [effectsAnchorEl, setEffectsAnchorEl] = React.useState();
	const [showStemsDialog, setShowStemsDialog] = React.useState<boolean>(false);
	const [stemsAnchorEl, setStemsAnchorEl] = React.useState();
	const [showPlayerControlsDialog, setShowPlayerControlsDialog] = React.useState<boolean>(false);
	const [playerControlsAnchorEl, setPlayerControlsAnchorEl] = React.useState();
	const [isPaused, setIsPaused] = React.useState<boolean>(false);
	const [showProfileDialog, setShowProfileDialog] = React.useState<boolean>(false);
	const [profileAnchorEl, setProfileAnchorEl] = React.useState();
	const [showDownloadsDialog, setShowDownloadsDialog] = React.useState<boolean>(false);
	const [downloadsAnchorEl, setDownloadsAnchorEl] = React.useState();

	const loadLoop = async (): Promise<void> => {
		Tone.Transport.cancel();

		if (appContext.SelectedAudio.Stems.length > 0) {
			appContext.SelectedAudio.Stems.forEach((stem) => {
				appContext.Player.current.player(stem.Name).unsync();
				appContext.Player.current.player(stem.Name).dispose();
			});

			const initialURLs = appContext.SelectedAudio.Stems.reduce((acc, stem) => {
				const name: string = stem["Name"];
				acc[name] = stem["Path"];
				return acc;
			}, {});

			appContext.Player.current = new Tone.Players({
				urls: initialURLs,
				onload: async () => {
					await Promise.all(
						appContext.SelectedAudio.Stems.map(async (stem) => {
							const stemMuted: boolean = stem.Channel.muted;
							const tempChannel = new Tone.Channel().toDestination();
							stem.Channel = tempChannel;
							appContext.Player.current.player(stem.Name).connect(tempChannel);
							appContext.Player.current.player(stem.Name).reverse = appContext.SelectedAudio.Reversed;
							appContext.Player.current.player(stem.Name).playbackRate = appContext.TempoLevel;
							appContext.Player.current.player(stem.Name).volume.value = stem.Volume;
							appContext.Player.current.player(stem.Name).mute = stemMuted;
							appContext.Player.current.player(stem.Name).sync();
							appContext.Player.current.player(stem.Name).start(0);
						})
					);

					Tone.Transport.loop = true;
					Tone.Transport.loopStart = startLoopTime;
					Tone.Transport.loopEnd = endLoopTime;
					Tone.Transport.start();
				}
			}).toDestination();
		} else {
			appContext.Player.current.unsync();
			appContext.Player.current = new Tone.Player();

			await appContext.Player.current.load(appContext.SelectedAudio.Path);

			appContext.Player.current.reverse = appContext.SelectedAudio.Reversed;
			appContext.Player.current.playbackRate = appContext.TempoLevel;
			appContext.Player.current.toDestination().sync().start(0);

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
				appContext.SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			endLoopTime,
			appContext.SelectedAudio.Duration - endLoopTime
		);

		Tone.Transport.start();

		setEndLoopTime(null);
		setStartLoopTime(null);
		setStartLoopEnabled(true);
		setEndLoopEnabled(true);
	};

	React.useEffect(() => {
		if (!startLoopEnabled && !endLoopEnabled) {
			loadLoop();
		}
	}, [startLoopEnabled, endLoopEnabled]);

	const updateRecordTheme = async (): Promise<void> => {
		if (recordTheme.palette.primary.main === "#9a9a9a") {
			setRecordTheme(redTheme);

			if (Tone.Transport.state === "started") {
				appContext.Recorder.current.start();
			}
		} else {
			setRecordTheme(darkGreyTheme);

			if (Tone.Transport.state === "started") {
				const recording = new Blob([await appContext.Recorder.current.stop()], { type: "audio/webm" });

				// download the recording by creating an anchor element and blob url
				const url = URL.createObjectURL(recording);
				const anchor = document.createElement("a");
				anchor.download = "recording.webm";
				anchor.href = url;
				anchor.click();
			}
		}
	};

	const downloadLoop = async (): Promise<void> => {
		const recorder = new Tone.Recorder({
			mimeType: "audio/webm"
		});

		appContext.Player.current.connect(recorder);
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

	const updateScheduleTimingEvent = (event: Event, value: number): void => {
		const updatedDuration: number = (appContext.TempoLevel / value) * appContext.SelectedAudio.Duration;
		const timestampRatio: number = appContext.PlayerTimestamp / appContext.SelectedAudio.Duration;
		let updatedTimestamp: number = Math.round(timestampRatio * updatedDuration);

		Tone.Transport.clear(appContext.SelectedAudio.CurrentTimestampEventId);
		Tone.Transport.seconds = updatedTimestamp;

		let currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
			() => {
				appContext.SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			updatedTimestamp,
			updatedDuration - updatedTimestamp
		);

		const tempAudio: IAudio = { ...appContext.SelectedAudio };
		tempAudio.CurrentTimestampEventId = currentTimestampEventId;
		tempAudio.Duration = updatedDuration;
		appContext.SetTempoLevel(value);
		appContext.SetPlayerTimestamp(updatedTimestamp);
		appContext.SetSelectedAudio(tempAudio);
	};

	const jumpToPosition = (seconds: number): void => {
		Tone.Transport.clear(appContext.SelectedAudio.CurrentTimestampEventId);
		const updatedTimestamp: number = appContext.PlayerTimestamp + seconds;
		Tone.Transport.seconds = updatedTimestamp;

		let currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
			() => {
				appContext.SetPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			updatedTimestamp,
			appContext.SelectedAudio.Duration - updatedTimestamp
		);

		const tempAudio: IAudio = { ...appContext.SelectedAudio };
		tempAudio.CurrentTimestampEventId = currentTimestampEventId;
		appContext.SetPlayerTimestamp(updatedTimestamp);
		appContext.SetSelectedAudio(tempAudio);
	};

	const renderProfileDialog = (): JSX.Element => {
		return (
			<Popover
				open={showProfileDialog}
				anchorEl={profileAnchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
			>
				<div
					style={{
						position: "relative",
						padding: "1em 1em .5em 1em",
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
						<IconButton style={{ backgroundColor: "transparent" }} color={"primary"} size="small">
							<CloseIcon
								fontSize="inherit"
								onClick={() => {
									setShowProfileDialog(false);
								}}
							></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Stack direction={"row"} alignItems={"center"} style={{ padding: "1em" }}>
					<ProfileDownloadsTinyText>Patrick Hawn / KCMO </ProfileDownloadsTinyText>
					<IconButton style={{ paddingLeft: "10px", backgroundColor: "transparent" }} target="_blank" href="https://www.linkedin.com/in/patrick-hawn-74717381/" size="small">
						<LinkedInIcon color="info" fontSize="inherit"></LinkedInIcon>
					</IconButton>
					<IconButton style={{ backgroundColor: "transparent" }} target="_blank" href="https://www.instagram.com" size="small">
						<InstagramIcon color="info" fontSize="inherit"></InstagramIcon>
					</IconButton>
				</Stack>
			</Popover>
		);
	};

	const renderDownloadsDialog = (): JSX.Element => {
		return (
			<Popover
				open={showDownloadsDialog}
				anchorEl={downloadsAnchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center"
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "left"
				}}
			>
				<div
					style={{
						position: "relative",
						padding: "1em 1em .5em 1em",
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
						<IconButton style={{ backgroundColor: "transparent" }} color={"primary"} size="small">
							<CloseIcon
								fontSize="inherit"
								onClick={() => {
									setShowDownloadsDialog(false);
								}}
							></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Grid container spacing={0} padding={0} alignItems={"center"}>
					<Grid item sx={{ paddingRight: "8px" }}>
						<IconButton style={{ backgroundColor: "transparent" }} color={"primary"} href={appContext.Downloads[0]} download>
							<FileDownloadIcon></FileDownloadIcon>
						</IconButton>
					</Grid>
					<Grid item sx={{ paddingRight: "8px" }}>
						<ProfileDownloadsTinyText>Beat Tape 1</ProfileDownloadsTinyText>
					</Grid>
				</Grid>
			</Popover>
		);
	};

	const renderLooperDialog = (): JSX.Element => {
		return (
			<Popover
				open={showLooperDialog}
				anchorEl={looperAnchorEl}
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
						<IconButton color={"primary"} style={{ backgroundColor: "transparent" }}>
							<CloseIcon
								onClick={() => {
									setShowLooperDialog(false);
								}}
							></CloseIcon>
						</IconButton>
					</div>
				</div>
				<Grid container spacing={1} padding={1}>
					<Grid item>
						<Button
							variant="contained"
							disabled={!startLoopEnabled || Tone.Transport.state !== "started"}
							onClick={() => {
								Tone.Transport.loopStart = appContext.PlayerTimestamp;
								setStartLoopTime(appContext.PlayerTimestamp);
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
								Tone.Transport.loopEnd = appContext.PlayerTimestamp;
								setEndLoopTime(appContext.PlayerTimestamp);
								setEndLoopEnabled(false);
							}}
							style={{ minWidth: "6em" }}
						>
							End
						</Button>
					</Grid>
				</Grid>
			</Popover>
		);
	};

	const renderEffectsDialog = (): JSX.Element => {
		return (
			<Popover
				open={showEffectsDialog}
				anchorEl={effectsAnchorEl}
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
						overflowY: "hidden"
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
						<IconButton disabled={Tone.Transport.state !== "started"} style={{ paddingRight: "1px" }} color={"primary"}>
							<ReplayIcon
								onClick={() => {
									appContext.ResetToDefaults();
								}}
							></ReplayIcon>
						</IconButton>
						<IconButton color={"primary"} style={{ backgroundColor: "transparent" }}>
							<CloseIcon
								onClick={() => {
									setShowEffectsDialog(false);
								}}
							></CloseIcon>
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
						value={appContext.DistortionLevel}
						onChange={appContext.HandleDistortionLevel}
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
						value={appContext.VisualTempoLevel}
						onChange={appContext.HandleTempoLevel}
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
						value={appContext.PitchLevel}
						onChange={appContext.HandlePitchLevel}
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
						value={appContext.TremoloLevel}
						onChange={appContext.HandleTremoloLevel}
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
						value={appContext.ChorusLevel}
						onChange={appContext.HandleChorusLevel}
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
						value={appContext.VibratoLevel}
						onChange={appContext.HandleVibratoLevel}
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
				{/* Phaser */}
				{/* Reverb */}
				{/* Delay */}
				{/* Bit Crusher */}
				{/* Filter */}
			</Popover>
		);
	};

	const renderPlayerControlsDialog = (): JSX.Element => {
		if (appContext.Player.current.loaded) {
			const renderPlayPauseControl = (): JSX.Element => {
				if (!isPaused && Tone.Transport.state !== "paused") {
					return (
						<IconButton
							disabled={appContext.PlayerTimestamp >= appContext.SelectedAudio.Duration - 1}
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
							disabled={appContext.PlayerTimestamp >= appContext.SelectedAudio.Duration - 1}
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
						{/* <IconButton color={"primary"} onClick={() => {}}>
							<FastRewindRounded></FastRewindRounded>
						</IconButton> */}
						<IconButton
							disabled={appContext.PlayerTimestamp <= 10}
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
								if (appContext.SelectedAudio.CurrentTimestampEventId) {
									Tone.Transport.clear(appContext.SelectedAudio.CurrentTimestampEventId);
								}

								if (Tone.Transport.state === "paused") {
									Tone.Transport.start();
								}

								if (appContext.SelectedAudio.Stems.length > 0) {
									appContext.SelectedAudio.Stems.forEach((stem) => {
										appContext.Player.current.player(stem.Name).unsync();
										appContext.Player.current.player(stem.Name).dispose();
									});
								} else {
									appContext.Player.current.unsync();
									appContext.Player.current.dispose();
								}
								setShowPlayerControlsDialog(false);
								setPlayerControlsAnchorEl(null);
								appContext.SetSelectedAudio(null);
							}}
						>
							<StopRoundedIcon></StopRoundedIcon>
						</IconButton>
						{renderPlayPauseControl()}
						<IconButton
							disabled={appContext.PlayerTimestamp + 10 > appContext.SelectedAudio.Duration}
							color={"primary"}
							onClick={() => {
								jumpToPosition(10);
							}}
						>
							<Forward10RoundedIcon></Forward10RoundedIcon>
						</IconButton>
						{/* <IconButton color={"primary"} onClick={() => {}}>
							<FastForwardRounded></FastForwardRounded>
						</IconButton> */}
					</React.Fragment>
				);
			};

			return (
				<Popover
					open={showPlayerControlsDialog}
					anchorEl={playerControlsAnchorEl}
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
							<IconButton color={"primary"}>
								<CloseIcon
									onClick={() => {
										setShowPlayerControlsDialog(false);
									}}
								></CloseIcon>
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

	const renderStemsDialog = (): JSX.Element => {
		if (appContext.Player.current.loaded) {
			const renderStemSliders = (): JSX.Element[] => {
				const renderStemVolumeButton = (stem: IStem): JSX.Element => {
					if (stem.Channel && !appContext.Player.current.player(stem.Name).mute) {
						return <VolumeUpIcon></VolumeUpIcon>;
					} else {
						return <VolumeOffIcon></VolumeOffIcon>;
					}
				};

				const stemSliders: JSX.Element[] = appContext.SelectedAudio.Stems.map((stem) => {
					let currentStem: IStem = appContext.SelectedAudio.Stems.find((track) => track.Name === stem.Name);
					let currentStemIndex: number = appContext.SelectedAudio.Stems.indexOf(stem);

					return (
						<Stack
							height="15em"
							direction="column"
							sx={{
								m: 0.5
							}}
							alignItems="center"
						>
							<TinyText>{stem.Name}</TinyText>
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									let audio: IAudio = { ...appContext.SelectedAudio };

									if (!appContext.Player.current.player(stem.Name).mute) {
										audio.Stems[currentStemIndex].Channel.mute = true;
										appContext.Player.current.player(stem.Name).mute = true;
									} else {
										audio.Stems[currentStemIndex].Channel.mute = false;
										appContext.Player.current.player(stem.Name).mute = false;
									}
									appContext.SetSelectedAudio(audio);
								}}
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
								disabled={appContext.Player.current.player(stem.Name).mute && appContext.Player.current.player(stem.Name).volume.value !== 0}
								orientation="vertical"
								value={currentStem.Volume}
								onChange={(_, value) => {
									let audio: IAudio = { ...appContext.SelectedAudio };
									audio.Stems[currentStemIndex].Volume = value as number;
									appContext.Player.current.player(stem.Name).volume.value = value;
									appContext.SetSelectedAudio(audio);
								}}
								max={6}
								step={0.5}
								min={-30}
								aria-label="Temperature"
								valueLabelDisplay="off"
							/>
						</Stack>
					);
				});

				return stemSliders;
			};

			return (
				<Popover
					open={showStemsDialog}
					anchorEl={stemsAnchorEl}
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
							<IconButton disabled={Tone.Transport.state !== "started"} style={{ paddingRight: "1px" }} color={"primary"}>
								<ReplayIcon
									onClick={() => {
										appContext.ResetVolumeLevels();
									}}
								></ReplayIcon>
							</IconButton>
							<IconButton color={"primary"}>
								<CloseIcon
									onClick={() => {
										setShowStemsDialog(false);
									}}
								></CloseIcon>
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

	const TinyText = styled(Typography)({
		fontSize: "0.75rem",
		opacity: 0.38,
		fontWeight: 500,
		letterSpacing: 0.2
	});

	const ProfileDownloadsTinyText = styled(Typography)({
		fontSize: ".8rem",
		opacity: 0.7,
		fontWeight: 500,
		letterSpacing: 0.2
	});

	const theme = useTheme();

	const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
	const lightIconColor = theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

	const formatDuration = (value: number): string => {
		const minute = Math.floor(value / 60);
		const secondLeft = Math.round(value - minute * 60);
		return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
	};

	const renderTimingInfo = (): JSX.Element => {
		if (appContext.PlayerTimestamp <= appContext.SelectedAudio.Duration) {
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
						<TinyText>{(Tone.Transport.state === "started" || Tone.Transport.state === "paused") && formatDuration(appContext.PlayerTimestamp)}</TinyText>
						<TinyText>-{(Tone.Transport.state === "started" || Tone.Transport.state === "paused") && formatDuration(appContext.SelectedAudio.Duration - appContext.PlayerTimestamp)}</TinyText>
					</Box>
				</React.Fragment>
			);
		}
	};

	const renderPlayerInfo = (): JSX.Element => {
		if (!isMobile && appContext.Player.current && !appContext.Player.current.loaded) {
			return (
				<div
					style={{
						position: "absolute",
						left: "50%",
						top: "0",
						transform: "translateX(-50%)",
						marginTop: "17px"
					}}
				>
					<CircularProgress
						variant="indeterminate"
						disableShrink
						sx={{
							color: (theme) => darkGreyTheme.palette.primary.main,
							animationDuration: "550ms",
							position: "absolute",
							left: 0,
							[`& .${circularProgressClasses.circle}`]: {
								strokeLinecap: "round"
							}
						}}
						size={30}
						thickness={2}
					/>
				</div>
			);
		}

		if (!isMobile && appContext.SelectedAudio && Tone.Transport.state !== "stopped") {
			return (
				<React.Fragment>
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "0",
							transform: "translateX(-50%)",
							marginTop: "10px"
						}}
					>
						<Stack spacing={1.5} direction="row">
							<span ref={stemsRef}>
								<ThemeProvider theme={darkGreyTheme}>
									<IconButton
										color={"primary"}
										style={{
											backgroundColor: "transparent"
										}}
										disabled={appContext.SelectedAudio.Stems.length === 0}
										onClick={() => {
											setShowStemsDialog(true);
											setStemsAnchorEl(stemsRef.current);
										}}
									>
										<SettingsInputCompositeIcon></SettingsInputCompositeIcon>
									</IconButton>
									{renderStemsDialog()}
								</ThemeProvider>
							</span>
							<div>
								<TinyText sx={{ textAlign: "center", letterSpacing: 10 }}>{appContext.SelectedAudio.Name}</TinyText>
								<Slider
									aria-label="time-indicator"
									size="small"
									value={appContext.PlayerTimestamp}
									min={0}
									step={1}
									max={appContext.SelectedAudio.Duration}
									sx={{
										color: theme.palette.mode === "dark" ? "#fff" : "#9a9a9a",
										height: 4,
										padding: "6px 0px",
										width: "250px",
										"@media (pointer: coarse)": {
											padding: "5px"
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
										onClick={() => {
											setShowPlayerControlsDialog(true);
											setPlayerControlsAnchorEl(playerControlsRef.current);
										}}
									>
										<RadioIcon></RadioIcon>
									</IconButton>
									{renderPlayerControlsDialog()}
								</ThemeProvider>
							</span>
						</Stack>
					</div>
				</React.Fragment>
			);
		}
	};

	const renderMobilePlayerInfo = (): JSX.Element => {
		if (isMobile && appContext.Player.current && !appContext.Player.current.loaded) {
			return (
				<div
					style={{
						height: "2.5em",
						top: "4em",
						position: "sticky",
						padding: "1em",
						verticalAlign: "center",
						boxShadow: "0px .5px 5px 0.1px #9a9a9a",
						backgroundColor: "#eeeeee",
						zIndex: 100
					}}
				>
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "0",
							transform: "translateX(-50%)",
							marginTop: "20px"
						}}
					>
						<CircularProgress
							variant="indeterminate"
							disableShrink
							sx={{
								color: (theme) => darkGreyTheme.palette.primary.main,
								animationDuration: "550ms",
								position: "absolute",
								left: 0,
								[`& .${circularProgressClasses.circle}`]: {
									strokeLinecap: "round"
								}
							}}
							size={30}
							thickness={2}
						/>
					</div>
				</div>
			);
		}

		if (isMobile && appContext.SelectedAudio && Tone.Transport.state !== "stopped") {
			return (
				<div
					style={{
						height: "2.5em",
						top: "4em",
						position: "sticky",
						padding: "1em",
						verticalAlign: "center",
						boxShadow: "0px .5px 5px 0.1px #9a9a9a",
						backgroundColor: "#eeeeee",
						zIndex: 100
					}}
				>
					<div
						style={{
							position: "absolute",
							left: "50%",
							top: "0",
							transform: "translateX(-50%)",
							marginTop: "10px"
						}}
					>
						<Stack spacing={1.5} direction="row">
							<span ref={stemsRef}>
								<ThemeProvider theme={darkGreyTheme}>
									<IconButton
										color={"primary"}
										style={{
											backgroundColor: "transparent"
										}}
										disabled={appContext.SelectedAudio.Stems.length === 0}
										onMouseOver={() => {
											setShowStemsDialog(true);
											setStemsAnchorEl(stemsRef.current);
										}}
									>
										<SettingsInputCompositeIcon></SettingsInputCompositeIcon>
									</IconButton>
									{renderStemsDialog()}
								</ThemeProvider>
							</span>
							<div>
								<TinyText sx={{ textAlign: "center", letterSpacing: 10 }}>{appContext.SelectedAudio.Name}</TinyText>
								<Slider
									aria-label="time-indicator"
									size="small"
									value={appContext.PlayerTimestamp}
									min={0}
									step={1}
									max={appContext.SelectedAudio.Duration}
									//onChangeCommitted={(_, value) => (appContext.Player.current.seek = value as number)}
									sx={{
										color: theme.palette.mode === "dark" ? "#fff" : "#9a9a9a",
										height: 4,
										width: "250px",
										"@media (pointer: coarse)": {
											padding: "0px"
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
										onMouseOver={() => {
											setShowPlayerControlsDialog(true);
											setPlayerControlsAnchorEl(playerControlsRef.current);
										}}
									>
										<RadioIcon></RadioIcon>
									</IconButton>
									{renderPlayerControlsDialog()}
								</ThemeProvider>
							</span>
						</Stack>
					</div>
				</div>
			);
		}
	};

	return (
		<React.Fragment>
			<div
				style={{
					height: "2em",
					top: "0",
					position: "sticky",
					padding: "1em",
					verticalAlign: "center",
					boxShadow: "0px .5px 5px 0.1px #9a9a9a",
					backgroundColor: "#eeeeee",
					zIndex: 100
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						fontSize: "25px",
						paddingTop: ".6em",
						paddingLeft: ".6em"
					}}
				>
					<span ref={profileRef}>
						<ThemeProvider theme={darkGreyTheme}>
							{/* <LightTooltip TransitionComponent={Zoom} title="About" placement="right"> */}
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									setShowProfileDialog(true);
									setProfileAnchorEl(profileRef.current);
								}}
							>
								<PersonIcon></PersonIcon>
							</IconButton>
							{/* </LightTooltip> */}
							{renderProfileDialog()}
						</ThemeProvider>
					</span>
					<span ref={downloadsRef}>
						<ThemeProvider theme={darkGreyTheme}>
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									setShowDownloadsDialog(true);
									setDownloadsAnchorEl(downloadsRef.current);
								}}
							>
								<FolderOpenIcon></FolderOpenIcon>
							</IconButton>
							{renderDownloadsDialog()}
						</ThemeProvider>
					</span>
				</div>
				{renderPlayerInfo()}
				<div
					style={{
						position: "absolute",
						top: "0",
						right: "0",
						fontSize: "25px",
						paddingTop: ".6em",
						paddingRight: ".6em"
					}}
				>
					<span ref={looperRef}>
						<ThemeProvider theme={darkGreyTheme}>
							{/* <LightTooltip
              TransitionComponent={Zoom}
              title={"Looper"}
              placement="bottom"
            > */}
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									setShowLooperDialog(true);
									setLooperAnchorEl(looperRef.current);
								}}
							>
								<LoopIcon></LoopIcon>
							</IconButton>
							{/* </LightTooltip> */}
							{renderLooperDialog()}
						</ThemeProvider>
					</span>
					<span ref={effectsRef}>
						<ThemeProvider theme={darkGreyTheme}>
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									setShowEffectsDialog(true);
									setEffectsAnchorEl(effectsRef.current);
								}}
							>
								<TuneIcon></TuneIcon>
							</IconButton>
							{/* </LightTooltip> */}
							{renderEffectsDialog()}
						</ThemeProvider>
					</span>
					<ThemeProvider theme={recordTheme}>
						{/* <LightTooltip TransitionComponent={Zoom} title={recordingTooltip} placement="bottom"> */}
						<IconButton
							color={"primary"}
							style={{
								backgroundColor: "transparent"
							}}
							onClick={(event) => updateRecordTheme()}
						>
							<RadioButtonCheckedIcon></RadioButtonCheckedIcon>
						</IconButton>
						{/* </LightTooltip> */}
					</ThemeProvider>
				</div>
			</div>
			{renderMobilePlayerInfo()}
		</React.Fragment>
	);
};

export default CommandBar;
