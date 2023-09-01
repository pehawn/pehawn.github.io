import { Button, Card, CardActions, CardContent, Popover, Typography } from "@mui/material";
import React, { memo } from "react";
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
	uuid?: string;
	closeDialog(): void;
}

let TrainingModuleDialog: React.FunctionComponent<ITrainingModuleDialog> = (props): JSX.Element => {
	const { SelectedAudio, SetSelectedAudio, DisplayTrainingModules, SetDisplayTrainingModules, Player } = React.useContext(AppContext);

	const showNextDialog = (): void => {
		let displayTrainingModules: boolean[] = DisplayTrainingModules.slice();
		displayTrainingModules[props.currentStep - 1] = false;
		displayTrainingModules[props.currentStep] = true;
		SetDisplayTrainingModules(displayTrainingModules);

		props.closeDialog();
	};

	const exitTraining = (): void => {
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
			key={`trainingpopover${props.uuid}`}
		>
			<div
				style={{
					position: "relative",
					padding: "1em 1em 1em 1em",
					verticalAlign: "center"
				}}
				key={`trainingouterdiv${props.uuid}`}
			>
				<div
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						display: "contents"
					}}
					key={`traininginnerdiv${props.uuid}`}
				>
					<Card key={`trainingcard${props.uuid}`}>
						<CardContent key={`trainingcc${props.uuid}`}>
							<Typography key={`trainingtext1${props.uuid}`} sx={{ fontSize: ".95rem", opacity: 0.65, fontWeight: 450 }}>
								{props.headerText}
							</Typography>
							<TrainingModuleVideo uuid={props.uuid} video={props.trainingVideo} />
							<Typography key={`trainingtext2${props.uuid}`} sx={{ fontSize: ".75rem", opacity: 0.65, fontWeight: 450 }}>
								{props.trainingText}
							</Typography>
						</CardContent>
						<CardActions key={`trainingca${props.uuid}`}>
							<Button key={`exitbutton${props.uuid}`} onClick={() => exitTraining()}>
								Exit
							</Button>
							<Button key={`nextbutton${props.uuid}`} onClick={() => (props.finalStep ? exitTraining() : showNextDialog())}>
								{props.finalStep ? <>Finish</> : <>Next</>}
							</Button>
						</CardActions>
					</Card>
				</div>
			</div>
		</Popover>
	);
};

export default TrainingModuleDialog;
