import { Button, Card, CardActions, CardContent, Popover, Typography } from "@mui/material";
import React from "react";
import TrainingModuleVideo from "./TrainingModuleVideo";
import * as Tone from "tone";
import { AppContext } from "../context/AppContext";

interface ITrainingModuleDialog {
	isOpen?: boolean;
	trainingVideo?: any;
	trainingAnchorEl?: any;
	trainingText?: string;
	headerText?: string;
	currentStep?: number;
	finalStep?: boolean;
	closeDialog(): void;
}

const TrainingModuleDialog: React.FunctionComponent<ITrainingModuleDialog> = (props): JSX.Element => {
	const { SelectedAudio, SetSelectedAudio, DisplayTrainingModules, SetDisplayTrainingModules, Player } = React.useContext(AppContext);

	const showNextDialog = (): void => {
		let displayTrainingModules: boolean[] = DisplayTrainingModules.slice();
		displayTrainingModules[props.currentStep - 1] = false;
		displayTrainingModules[props.currentStep] = true;
		SetDisplayTrainingModules(displayTrainingModules);

		props.closeDialog();
	};

	const exitTraining = (): void => {
		// Clean up audio example loaded in background
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
		SetDisplayTrainingModules([false, false, false, false, false, false]);

		// Reset page background color
		const bodyElement = document.querySelector("body");
		bodyElement.style.background = "#d8d8d8";

		// Close Training Dialog
		props.closeDialog();
	};

	return (
		<Popover
			open={props.isOpen}
			anchorEl={props.trainingAnchorEl}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left"
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center"
			}}
			sx={{ maxWidth: "30em" }}
			componentsProps={{ backdrop: { style: { backgroundColor: "rgba(0, 0, 0, 0.5)" } } }}
		>
			<div
				style={{
					position: "relative",
					padding: "1em 1em 1em 1em",
					verticalAlign: "center"
				}}
			>
				<div
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						display: "contents"
					}}
				>
					<Card>
						<CardContent>
							<Typography sx={{ fontSize: ".95rem", opacity: 0.65, fontWeight: 450 }}>{props.headerText}</Typography>
							<TrainingModuleVideo video={props.trainingVideo} />
							<Typography sx={{ fontSize: ".75rem", opacity: 0.65, fontWeight: 450 }}>{props.trainingText}</Typography>
						</CardContent>
						<CardActions>
							<Button onClick={() => exitTraining()}>Exit</Button>
							<Button onClick={() => (props.finalStep ? exitTraining() : showNextDialog())}>{props.finalStep ? <>Finish</> : <>Next</>}</Button>
						</CardActions>
					</Card>
				</div>
			</div>
		</Popover>
	);
};

export default TrainingModuleDialog;
