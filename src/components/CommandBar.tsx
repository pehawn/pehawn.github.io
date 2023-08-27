import * as React from "react";
import { CircularProgress, IconButton, circularProgressClasses } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import TuneIcon from "@mui/icons-material/Tune";
import LoopIcon from "@mui/icons-material/Loop";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppContext } from "../context/AppContext";
import * as Tone from "tone";
import { IAudio } from "../types/IAudio";
import SchoolIcon from "@mui/icons-material/School";
import TrainingModuleDialog from "./TrainingModuleDialog";
// @ts-ignore
import TrainingEffects from "../assets/training/TrainingEffects.mp4";
// @ts-ignore
import TrainingLooper from "../assets/training/TrainingLooper.mp4";
// @ts-ignore
import TrainingRecord from "../assets/training/TrainingRecord.mp4";
import ProfileCallout from "./ProfileCallout";
import DownloadsCallout from "./DownloadsCallout";
import CommandBarPlayer from "./CommandBarPlayer";
import LooperCallout from "./LooperCallout";
import EffectsCallout from "./EffectsCallout";

const CommandBar: React.FunctionComponent<any> = ({}): JSX.Element => {
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

	const appContext = React.useContext(AppContext);

	const looperRef = React.useRef();
	const effectsRef = React.useRef();
	const profileRef = React.useRef();
	const downloadsRef = React.useRef();
	const trainingRef = React.useRef();
	const trainingEffects = React.useRef();
	const trainingStems = React.useRef();
	const trainingRecord = React.useRef();
	const trainingPlayerControls = React.useRef();
	const trainingLooper = React.useRef();

	const [recordTheme, setRecordTheme] = React.useState<any>(darkGreyTheme);
	const [showLooperDialog, setShowLooperDialog] = React.useState<boolean>(false);
	const [looperAnchorEl, setLooperAnchorEl] = React.useState();
	const [showEffectsDialog, setShowEffectsDialog] = React.useState<boolean>(false);
	const [effectsAnchorEl, setEffectsAnchorEl] = React.useState();
	const [showProfileCallout, setShowProfileCallout] = React.useState<boolean>(false);
	const [profileAnchorEl, setProfileAnchorEl] = React.useState();
	const [showDownloadsCallout, setShowDownloadsCallout] = React.useState<boolean>(false);
	const [downloadsAnchorEl, setDownloadsAnchorEl] = React.useState();
	const [trainingAnchorEl, setTrainingAnchorEl] = React.useState(null);

	React.useEffect(() => {
		if (appContext.DisplayTrainingModules[1]) {
			setTrainingAnchorEl(trainingEffects.current);
		} else if (appContext.DisplayTrainingModules[2]) {
			setTrainingAnchorEl(trainingStems.current);
		} else if (appContext.DisplayTrainingModules[3]) {
			setTrainingAnchorEl(trainingRecord.current);
		} else if (appContext.DisplayTrainingModules[4]) {
			setTrainingAnchorEl(trainingPlayerControls.current);
		} else if (appContext.DisplayTrainingModules[5]) {
			setTrainingAnchorEl(trainingLooper.current);
		}
	}, [appContext.DisplayTrainingModules]);

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

	const renderTrainingModules = async (): Promise<void> => {
		let titleSong: IAudio = appContext.Tracks.find((track: IAudio) => track.Name === "INTROVERT");
		titleSong.Reversed = false;

		await appContext.UpdateSelectedAudio(titleSong, false);

		let displayTrainingModules: boolean[] = appContext.DisplayTrainingModules?.slice();
		displayTrainingModules[0] = true;
		appContext.SetDisplayTrainingModules(displayTrainingModules);
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
						<CommandBarPlayer isMobile={isMobile} />
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
						<CommandBarPlayer isMobile={isMobile} />
					</div>
				</div>
			);
		}
	};

	const renderPlayerTrainingEffects = (): JSX.Element => {
		const open: boolean = appContext.DisplayTrainingModules[1] && trainingAnchorEl !== null;

		return (
			<span ref={trainingEffects}>
				<TrainingModuleDialog
					finalStep={false}
					isOpen={open}
					closeDialog={() => {
						setTrainingAnchorEl(null);
					}}
					currentStep={2}
					headerText="2 of 6"
					trainingAnchorEl={isMobile ? null : trainingAnchorEl}
					trainingText="Transform the audio's sound using the effect sliders. Press the recycle icon to reset the effect sliders to default."
					trainingVideo={TrainingEffects}
				/>
			</span>
		);
	};

	const renderPlayerTrainingLooper = (): JSX.Element => {
		const open: boolean = appContext.DisplayTrainingModules[3] && trainingAnchorEl !== null;

		return (
			<span ref={trainingLooper}>
				<TrainingModuleDialog
					finalStep={false}
					isOpen={open}
					closeDialog={() => {
						setTrainingAnchorEl(null);
					}}
					currentStep={4}
					headerText="4 of 6"
					trainingAnchorEl={isMobile ? null : trainingAnchorEl}
					trainingText="Repeat a specific section of the audio using the looper dialog. Press the start button to define the beginning point and end button to define the end point. Press the cancel button to stop looping."
					trainingVideo={TrainingLooper}
				/>
			</span>
		);
	};

	const renderPlayerTrainingRecord = (): JSX.Element => {
		const open: boolean = appContext.DisplayTrainingModules[5] && trainingAnchorEl !== null;

		return (
			<span ref={trainingRecord}>
				<TrainingModuleDialog
					finalStep={true}
					isOpen={open}
					closeDialog={() => {
						setTrainingAnchorEl(null);
					}}
					currentStep={6}
					headerText="6 of 6"
					trainingAnchorEl={isMobile ? null : trainingAnchorEl}
					trainingText="If you configure or enjoy a track's section and want to keep it, use the record button to capture the desired audio. The file will be downloaded to your browser's window."
					trainingVideo={TrainingRecord}
				/>
			</span>
		);
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
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									setShowProfileCallout(true);
									setProfileAnchorEl(profileRef.current);
								}}
							>
								<PersonIcon></PersonIcon>
							</IconButton>
							<ProfileCallout
								open={showProfileCallout}
								anchor={profileAnchorEl}
								closeCallout={() => {
									setShowProfileCallout(false);
									setProfileAnchorEl(null);
								}}
							/>
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
									setShowDownloadsCallout(true);
									setDownloadsAnchorEl(downloadsRef.current);
								}}
							>
								<FolderOpenIcon></FolderOpenIcon>
							</IconButton>
							<DownloadsCallout
								open={showDownloadsCallout}
								anchor={downloadsAnchorEl}
								closeCallout={() => {
									setShowDownloadsCallout(false);
									setDownloadsAnchorEl(null);
								}}
							/>
						</ThemeProvider>
					</span>
					<span ref={trainingRef}>
						<ThemeProvider theme={darkGreyTheme}>
							<IconButton
								color={"primary"}
								style={{
									backgroundColor: "transparent"
								}}
								onClick={() => {
									renderTrainingModules();
								}}
							>
								<SchoolIcon></SchoolIcon>
							</IconButton>
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
					{renderPlayerTrainingLooper()}
					<span ref={looperRef}>
						<ThemeProvider theme={darkGreyTheme}>
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
							<LooperCallout
								open={showLooperDialog}
								anchor={looperAnchorEl}
								closeCallout={() => {
									setShowLooperDialog(false);
									setLooperAnchorEl(null);
								}}
							/>
						</ThemeProvider>
					</span>
					{renderPlayerTrainingEffects()}
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
							<EffectsCallout
								open={showEffectsDialog}
								anchor={effectsAnchorEl}
								closeCallout={() => {
									setShowEffectsDialog(false);
									setEffectsAnchorEl(null);
								}}
							/>
						</ThemeProvider>
					</span>
					<ThemeProvider theme={recordTheme}>
						<IconButton
							color={"primary"}
							style={{
								backgroundColor: "transparent"
							}}
							onClick={(event) => updateRecordTheme()}
						>
							<RadioButtonCheckedIcon></RadioButtonCheckedIcon>
						</IconButton>
					</ThemeProvider>
					{renderPlayerTrainingRecord()}
				</div>
			</div>
			{renderMobilePlayerInfo()}
		</React.Fragment>
	);
};

export default CommandBar;
