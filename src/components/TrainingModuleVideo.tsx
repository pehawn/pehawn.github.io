import React, { useRef, useEffect } from "react";

interface ITrainingModuleVideo {
	video: string;
}

const TrainingModuleVideo: React.FunctionComponent<ITrainingModuleVideo> = (props): JSX.Element => {
	const videoRef = useRef(undefined);
	useEffect(() => {
		videoRef.current.defaultMuted = true;
	});
	return (
		<video style={{ minWidth: "100%", minHeight: "100%", maxWidth: "17.5em", height: "12.5em" }} ref={videoRef} loop autoPlay muted playsInline>
			<source src={props.video} type="video/mp4" />
		</video>
	);
};

export default TrainingModuleVideo;
