import * as React from "react";
import * as Tone from "tone";
import { IAudio } from "../types/IAudio";
import { ISwatch } from "../types/ISwatch";
import { getImage } from "gatsby-plugin-image";
import { HexToHSL } from "../components/colorPicker/Helpers";

export interface IAppContextProps {
	children: React.ReactNode;
	graphQlData: any;
}

export interface IAppContext {
	Tracks: IAudio[];
	Downloads: string[];
	Swatches: ISwatch[];
	SelectedSwatch: ISwatch;
	UpdateSwatch: boolean;
	SelectedAudio: IAudio;
	Player: any;
	Recorder: any;
	DistortionLevel: number;
	DistortionEffect: any;
	FeedbackDelayLevel: number;
	FeedbackDelayEffect: any;
	ChorusLevel: number;
	ChorusEffect: any;
	VibratoLevel: number;
	VibratoEffect: any;
	LowPassFilterLevel: number;
	LowPassFilterEffect: any;
	ReverbLevel: number;
	ReverbEffect: any;
	PhaserLevel: number;
	PhaserEffect: any;
	PitchLevel: number;
	PitchEffect: any;
	TempoLevel: number;
	VisualTempoLevel: number;
	PlayerTimestamp: number;
	DisplayTutorialDialog: boolean;
	DisplayTrainingModules: boolean[];
	SetTempoLevel(tempo: number): void;
	SetSelectedSwatch(swatch: ISwatch): void;
	SetUpdateSwatch(update: boolean): void;
	SetSwatches(swatches: ISwatch[]): void;
	SetSelectedAudio(audio: IAudio): void;
	SetPlayerTimestamp(time: number): void;
	UpdateSelectedAudio(audio: IAudio, randomizeEffects: boolean): void;
	HandleDistortionLevel(event: Event, value: number, activeThumb: number): void;
	HandleFeedbackDelayLevel(event: Event, value: number, activeThumb: number): void;
	HandleChorusLevel(event: Event, value: number, activeThumb: number): void;
	HandleVibratoLevel(event: Event, value: number, activeThumb: number): void;
	HandleLowPassFilterLevel(event: Event, value: number, activeThumb: number): void;
	HandleReverbLevel(event: Event, value: number, activeThumb: number): void;
	HandlePhaserLevel(event: Event, value: number, activeThumb: number): void;
	HandlePitchLevel(event: Event, value: number, activeThumb: number): void;
	HandleTempoLevel(event: Event, value: number, activeThumb: number): void;
	ResetToDefaults(): void;
	ResetVolumeLevels(): void;
	SetDisplayTutorialDialog(displayTutorialDialog: boolean): void;
	SetDisplayTrainingModules(displayTrainingModules: boolean[]): void;
}

export const AppContext = React.createContext<IAppContext>(undefined);

export const AppContextProvider = (props: IAppContextProps) => {
	// Workaround for mobile slider events, extra mouse down event was getting registered on
	// mobile and causing slider value to jump. Detect what type of device is being used
	const iOS = (): boolean => {
		if (typeof window !== "undefined") {
			const platform = navigator.userAgent || navigator.platform;

			return (
				["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(platform) ||
				// iPad on iOS 13 detection
				(navigator.userAgent.includes("Mac") && "ontouchend" in document)
			);
		} else {
			return false;
		}
	};
	const isIOS = iOS();

	const [swatches, setSwatches] = React.useState<ISwatch[]>([]);
	const [selectedSwatch, setSelectedSwatch] = React.useState<ISwatch>(null);
	const [updateSwatch, setUpdateSwatch] = React.useState<boolean>(true);
	const [selectedAudio, setSelectedAudio] = React.useState<IAudio>(null);
	const [distortionEffect, setDistortionEffect] = React.useState(null);
	const [distortionLevel, setDistortionLevel] = React.useState<number>(0);
	const [feedbackDelayEffect, setFeedbackDelayEffect] = React.useState(null);
	const [feedbackDelayLevel, setFeedbackDelayLevel] = React.useState<number>(0);
	const [chorusEffect, setChorusEffect] = React.useState(null);
	const [chorusLevel, setChorusLevel] = React.useState<number>(0);
	const [vibratoEffect, setVibratoEffect] = React.useState(null);
	const [vibratoLevel, setVibratoLevel] = React.useState<number>(0);
	const [lowPassFilterEffect, setLowPassFilterEffect] = React.useState(null);
	const [lowPassFilterLevel, setLowPassFilterLevel] = React.useState<number>(0);
	const [reverbEffect, setReverbEffect] = React.useState(null);
	const [reverbLevel, setReverbLevel] = React.useState<number>(0);
	const [phaserEffect, setPhaserEffect] = React.useState(null);
	const [phaserLevel, setPhaserLevel] = React.useState<number>(0);
	const [pitchEffect, setPitchEffect] = React.useState(null);
	const [pitchLevel, setPitchLevel] = React.useState<number>(0);
	// Used to display tempo level to user but not used for calculations when determining duration
	const [visualTempoLevel, setVisualTempoLevel] = React.useState<number>(1);
	const [tempoLevel, setTempoLevel] = React.useState<number>(1);
	const [playerTimestamp, setPlayerTimestamp] = React.useState<number>(null);
	const [displayTutorialDialog, setDisplayTutorialDialog] = React.useState<boolean>(true);
	const [displayTrainingModules, setDisplayTrainingModules] = React.useState<boolean[]>([false, false, false, false, false, false]);

	const [tracks, setTracks] = React.useState<IAudio[]>([]);
	const [downloads, setDownloads] = React.useState<string[]>([]);

	const playerRef = React.useRef(null);
	const recorderRef = React.useRef(null);

	const setData = async (): Promise<void> => {
		if (props.graphQlData.allMdx.nodes) {
			let foundTracks: IAudio[] = [];
			let foundDownloads: string[] = [];

			for (const data of props.graphQlData.allMdx.nodes) {
				if (data.frontmatter.audio.filter((t) => t.dir.includes("downloads")).length > 0) {
					foundDownloads.push(data.frontmatter.audio[0].publicURL);
				} else {
					const audio = data.frontmatter.audio.filter((t) => !t.publicURL.includes("Stems"))[0];
					let albumArt = getImage(data.frontmatter.featuredImage?.childImageSharp?.gatsbyImageData);
					let cardColor: string = null;

					cardColor = data.frontmatter?.albumArtColor;

					let foundAudio: IAudio = {
						Name: audio.name,
						FullName: data.frontmatter.title,
						Path: audio.publicURL,
						AlbumArt: albumArt,
						CardColor: cardColor,
						Stems: [],
						Order: data.frontmatter.order
					};

					for (const stem of data.frontmatter.audio.filter((t) => t.relativeDirectory.includes("Stems"))) {
						foundAudio.Stems.push({
							Name: stem.name,
							Path: stem.publicURL,
							Volume: 0
						});
					}

					foundTracks.push(foundAudio);
				}
			}

			// Sort tracks based on album color in ascending order
			foundTracks.sort((a, b) => a.Order - b.Order);

			const showTutorial: boolean = JSON.parse(localStorage.getItem("ShowTutorial"));
			setDisplayTutorialDialog(showTutorial ?? true);

			setTracks(foundTracks);
			setDownloads(foundDownloads);
		}
	};

	React.useEffect(() => {
		if (selectedAudio?.CardColor) {
			// Update page color
			const baseColor: string = selectedAudio?.CardColor;
			const hslValues: number[] = HexToHSL(baseColor);
			const hueFactor: number = 2;
			const saturationFactor: number = hslValues[1] / 10;
			const lightnessFactor: number = hslValues[2] / 1000;

			for (let i = 0; i < 2; i++) {
				const backgroundColor: string = ("hsl(" + (hslValues[0] + i * 4 * hueFactor) + ", " + (hslValues[1] + (Math.pow(i, 2) - 7) * saturationFactor) + "%, " + (hslValues[2] + (Math.pow(i, 2) + 90) * lightnessFactor) + "%)") as string;

				if (i === 1) {
					const bodyElement = document.querySelector("body");
					bodyElement.style.background = backgroundColor;
					bodyElement.style.height = "100%";
					bodyElement.style.transition = "background 1s ease-in";
				}
			}
		}
	}, [selectedAudio]);

	React.useEffect(() => {
		setData();
	}, []);

	const setEffectsChain = (randomizeEffects: boolean): void => {
		const distValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : distortionLevel;
		const feedbackDelayValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : feedbackDelayLevel;
		const vibratoValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : vibratoLevel;
		const chorusValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : chorusLevel;
		const pitchValue: number = randomizeEffects ? Math.floor(Math.random() * (12 - -12 + 1)) + -12 : pitchLevel;
		const reverbValue: number = randomizeEffects ? Math.floor(Math.random() * 33) : reverbLevel;
		const lowPassFilterValue: number = randomizeEffects ? Math.floor(Math.random() * 33) : lowPassFilterLevel;
		const phaserValue: number = randomizeEffects ? Math.floor(Math.random() * 100) : phaserLevel;

		let tempDistortion = new Tone.Distortion(1);
		tempDistortion.wet.value = distValue / 100;

		let tempPitch = new Tone.PitchShift();
		tempPitch.pitch = pitchValue;

		let tempFeedbackDelay = new Tone.FeedbackDelay(1, 0.5);
		tempFeedbackDelay.wet.value = feedbackDelayValue / 100;

		let tempVibrato = new Tone.Vibrato(15, 1);
		tempVibrato.wet.value = vibratoValue / 100;

		let tempChorus = new Tone.Chorus(1, 150, 4);
		tempChorus.wet.value = chorusValue / 100;

		let tempLowPassFilter = new Tone.AutoFilter(1, 150, 4);
		tempLowPassFilter.wet.value = lowPassFilterValue / 100;

		let tempReverb = new Tone.Reverb(3);
		tempReverb.wet.value = reverbValue / 100;

		let tempPhaser = new Tone.Phaser();
		tempPhaser.wet.value = phaserValue / 100;

		if (randomizeEffects) {
			setPitchLevel(pitchValue);
			setFeedbackDelayLevel(feedbackDelayValue);
			setVibratoLevel(vibratoValue);
			setChorusLevel(chorusValue);
			setDistortionLevel(distValue);
			setLowPassFilterLevel(lowPassFilterValue);
			setReverbLevel(reverbValue);
			setPhaserLevel(phaserValue);
		}

		setDistortionEffect(tempDistortion);
		setPitchEffect(tempPitch);
		setFeedbackDelayEffect(tempFeedbackDelay);
		setVibratoEffect(tempVibrato);
		setChorusEffect(tempChorus);
		setLowPassFilterEffect(tempLowPassFilter);
		setReverbEffect(tempReverb);
		setPhaserEffect(tempPhaser);

		Tone.Destination.chain(tempDistortion, tempPitch, tempFeedbackDelay, tempVibrato, tempChorus, tempLowPassFilter, tempReverb, tempPhaser);
	};

	const updateSelectedAudio = async (audio: IAudio, randomizeEffects: boolean): Promise<void> => {
		if (Tone.Transport.state === "started" || Tone.Transport.state === "paused" || (Tone.Transport.state === "stopped" && playerRef.current)) {
			if (selectedAudio && selectedAudio.CurrentTimestampEventId) {
				Tone.Transport.clear(selectedAudio.CurrentTimestampEventId);
			}

			if (Tone.Transport.state === "paused") {
				Tone.Transport.start();
			}

			if (selectedAudio) {
				if (selectedAudio.Stems.length > 0) {
					selectedAudio.Stems.forEach((stem) => {
						playerRef.current.player(stem.Name).unsync();
						playerRef.current.player(stem.Name).dispose();
					});
				} else {
					playerRef.current.unsync();
					playerRef.current.dispose();
				}
			}

			distortionEffect.dispose();
			chorusEffect.dispose();
			feedbackDelayEffect.dispose();
			vibratoEffect.dispose();
			pitchEffect.dispose();
			lowPassFilterEffect.dispose();
			reverbEffect.dispose();
			phaserEffect.dispose();

			if (recorderRef.current) {
				recorderRef.current.dispose();
			}
		}

		const tempoValue: number = randomizeEffects ? Math.random() * (1.4 - 0.6 + 1) + 0.6 : tempoLevel;
		let startTime: number = 0;

		if (audio.Stems.length > 0) {
			const initialURLs = audio.Stems.reduce((acc, stem) => {
				const name: string = stem["Name"];
				acc[name] = stem["Path"];
				return acc;
			}, {});

			let duration: number = 0;
			playerRef.current = await new Tone.Players({
				urls: initialURLs,
				onload: async () => {
					await Promise.all(
						audio.Stems.map((stem) => {
							const stemLength: number = playerRef.current.player(stem.Name).buffer.duration;
							if (stemLength > duration) {
								duration = stemLength;
							}
							const tempChannel = new Tone.Channel().toDestination();
							stem.Channel = tempChannel;
							playerRef.current.player(stem.Name).connect(tempChannel);
							playerRef.current.player(stem.Name).reverse = audio.Reversed;
							playerRef.current.player(stem.Name).playbackRate = tempoValue;
							playerRef.current.player(stem.Name).sync();
							playerRef.current.player(stem.Name).start();
						})
					).then(() => {
						audio.Duration = duration / tempoValue;
						const currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
							() => {
								setPlayerTimestamp(startTime++);
							},
							1,
							0,
							audio.Duration
						);

						audio.CurrentTimestampEventId = currentTimestampEventId;
						audio.Bpm = Tone.Transport.bpm.value;

						setSelectedAudio(audio);
					});
				}
			}).toDestination();
		} else {
			playerRef.current = new Tone.Player();
			playerRef.current.context.resume();
			await playerRef.current.load(audio.Path);
			playerRef.current.reverse = audio.Reversed;
			playerRef.current.playbackRate = tempoValue;
			playerRef.current.toDestination().sync().start(0);

			audio.Duration = (playerRef.current.buffer.duration as number) / tempoValue;
			audio.Bpm = Tone.Transport.bpm.value;

			const currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
				() => {
					setPlayerTimestamp(startTime++);
				},
				1,
				0,
				audio.Duration
			);

			audio.CurrentTimestampEventId = currentTimestampEventId;
			setSelectedAudio(audio);
		}

		if (randomizeEffects) {
			setTempoLevel(tempoValue);
			setVisualTempoLevel(tempoValue);
		}

		const recorder = new Tone.Recorder();
		recorderRef.current = recorder;
		Tone.Destination.connect(recorder);

		setPlayerTimestamp(0);

		Tone.Transport.start();
		Tone.Transport.seconds = 0;

		setEffectsChain(randomizeEffects);
	};

	const resetToDefaults = (): void => {
		let tempAudio: IAudio = { ...selectedAudio };

		distortionEffect.wet.value = 0;
		setDistortionLevel(0);
		setDistortionEffect(distortionEffect);

		pitchEffect.pitch = 0;
		setPitchLevel(0);
		setPitchEffect(pitchEffect);

		feedbackDelayEffect.wet.value = 0;
		setFeedbackDelayLevel(0);
		setFeedbackDelayEffect(feedbackDelayEffect);

		chorusEffect.wet.value = 0;
		setChorusLevel(0);
		setChorusEffect(chorusEffect);

		vibratoEffect.wet.value = 0;
		setVibratoLevel(0);
		setVibratoEffect(vibratoEffect);

		lowPassFilterEffect.wet.value = 0;
		setLowPassFilterLevel(0);
		setLowPassFilterEffect(lowPassFilterEffect);

		reverbEffect.wet.value = 0;
		setReverbLevel(0);
		setReverbEffect(reverbEffect);

		phaserEffect.wet.value = 0;
		setPhaserLevel(0);
		setPhaserEffect(phaserEffect);

		if (selectedAudio.Stems.length > 0) {
			let duration: number = 0;
			selectedAudio.Stems.forEach((stem) => {
				playerRef.current.player(stem.Name).playbackRate = 1;
				if (playerRef.current.player(stem.Name).buffer.duration > duration) {
					duration = playerRef.current.player(stem.Name).buffer.duration;
				}
			});
			tempAudio.Duration = duration;
		} else {
			playerRef.current.playbackRate = 1;
			tempAudio.Duration = playerRef.current.buffer.duration;

			const timestampRatio: number = playerTimestamp / selectedAudio.Duration;
			const updatedTimestamp: number = Math.round(timestampRatio * playerRef.current.buffer.duration);

			Tone.Transport.clear(selectedAudio.CurrentTimestampEventId);
			Tone.Transport.seconds = updatedTimestamp;
			const currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
				() => {
					setPlayerTimestamp(Tone.TransportTime().toSeconds());
				},
				1,
				updatedTimestamp,
				tempAudio.Duration - updatedTimestamp
			);
			tempAudio.CurrentTimestampEventId = currentTimestampEventId;
			setPlayerTimestamp(updatedTimestamp);
		}

		setTempoLevel(1);
		setVisualTempoLevel(1);
		setSelectedAudio(tempAudio);
	};

	const resetVolumeLevels = (): void => {
		let tempAudio: IAudio = { ...selectedAudio };

		if (tempAudio.Stems.length > 0) {
			tempAudio.Stems.forEach((stem) => {
				stem.Volume = 0;
				playerRef.current.player(stem.Name).volume.value = 0;
				playerRef.current.player(stem.Name).mute = false;
			});
		}

		setSelectedAudio(tempAudio);
	};

	const handleDistortionLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedDistLevel: number = value / 100;
		distortionEffect.wet.value = convertedDistLevel;
		setDistortionLevel(value);
	};

	const handlePitchLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		pitchEffect.pitch = value;
		setPitchLevel(value);
	};

	const handleTempoLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		if (selectedAudio.Stems.length > 0) {
			selectedAudio.Stems.forEach((stem) => {
				playerRef.current.player(stem.Name).playbackRate = value;
			});
		} else {
			playerRef.current.playbackRate = value;
		}

		setVisualTempoLevel(value);
	};

	const handleFeedbackDelayLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedFeedbackDelayLevel: number = value / 100;
		feedbackDelayEffect.wet.value = convertedFeedbackDelayLevel;
		setFeedbackDelayLevel(value);
	};

	const handleChorusLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedChorusLevel: number = value / 100;
		chorusEffect.wet.value = convertedChorusLevel;
		setChorusLevel(value);
	};

	const handleVibratoLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedVibratoLevel: number = value / 100;
		vibratoEffect.wet.value = convertedVibratoLevel;
		setVibratoLevel(value);
	};

	const handleLowPassFilterLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedLowPassFilterLevel: number = value / 100;
		lowPassFilterEffect.wet.value = convertedLowPassFilterLevel;
		setLowPassFilterLevel(value);
	};

	const handleReverbLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedReverbLevel: number = value / 100;
		reverbEffect.wet.value = convertedReverbLevel;
		setReverbLevel(value);
	};

	const handlePhaserLevel = (event: Event, value: number, activeThumb: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedPhaserLevel: number = value / 100;
		phaserEffect.wet.value = convertedPhaserLevel;
		setPhaserLevel(value);
	};

	const contextObject: IAppContext = {
		Tracks: tracks,
		Downloads: downloads,
		Swatches: swatches,
		SelectedSwatch: selectedSwatch,
		UpdateSwatch: updateSwatch,
		SelectedAudio: selectedAudio,
		Player: playerRef,
		Recorder: recorderRef,
		DistortionLevel: distortionLevel,
		DistortionEffect: distortionEffect,
		FeedbackDelayLevel: feedbackDelayLevel,
		FeedbackDelayEffect: feedbackDelayEffect,
		ChorusLevel: chorusLevel,
		ChorusEffect: chorusEffect,
		VibratoLevel: vibratoLevel,
		VibratoEffect: vibratoEffect,
		LowPassFilterLevel: lowPassFilterLevel,
		LowPassFilterEffect: lowPassFilterEffect,
		ReverbLevel: reverbLevel,
		ReverbEffect: reverbEffect,
		PhaserLevel: phaserLevel,
		PhaserEffect: phaserEffect,
		PitchLevel: pitchLevel,
		PitchEffect: pitchEffect,
		TempoLevel: tempoLevel,
		VisualTempoLevel: visualTempoLevel,
		PlayerTimestamp: playerTimestamp,
		DisplayTutorialDialog: displayTutorialDialog,
		DisplayTrainingModules: displayTrainingModules,
		SetTempoLevel: setTempoLevel,
		SetSelectedSwatch: setSelectedSwatch,
		SetUpdateSwatch: setUpdateSwatch,
		SetSwatches: setSwatches,
		SetSelectedAudio: setSelectedAudio,
		SetPlayerTimestamp: setPlayerTimestamp,
		UpdateSelectedAudio: updateSelectedAudio,
		HandleDistortionLevel: handleDistortionLevel,
		HandleFeedbackDelayLevel: handleFeedbackDelayLevel,
		HandleVibratoLevel: handleVibratoLevel,
		HandleChorusLevel: handleChorusLevel,
		HandleLowPassFilterLevel: handleLowPassFilterLevel,
		HandleReverbLevel: handleReverbLevel,
		HandlePhaserLevel: handlePhaserLevel,
		HandlePitchLevel: handlePitchLevel,
		HandleTempoLevel: handleTempoLevel,
		ResetToDefaults: resetToDefaults,
		ResetVolumeLevels: resetVolumeLevels,
		SetDisplayTutorialDialog: setDisplayTutorialDialog,
		SetDisplayTrainingModules: setDisplayTrainingModules
	};

	return <AppContext.Provider value={contextObject}>{props.children}</AppContext.Provider>;
};
