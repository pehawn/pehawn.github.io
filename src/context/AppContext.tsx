import * as React from "react";
import * as Tone from "tone";
import { IAudio } from "../types/IAudio";
import { ISwatch } from "../types/ISwatch";
import { getImage } from "gatsby-plugin-image";

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
	TremoloLevel: number;
	TremoloEffect: any;
	ChorusLevel: number;
	ChorusEffect: any;
	VibratoLevel: number;
	VibratoEffect: any;
	PitchLevel: number;
	PitchEffect: any;
	TempoLevel: number;
	VisualTempoLevel: number;
	PlayerTimestamp: number;
	SetTempoLevel(tempo: number): void;
	SetSelectedSwatch(swatch: ISwatch): void;
	SetUpdateSwatch(update: boolean): void;
	SetSwatches(swatches: ISwatch[]): void;
	SetSelectedAudio(audio: IAudio): void;
	SetPlayerTimestamp(time: number): void;
	UpdateSelectedAudio(audio: IAudio, randomizeEffects: boolean): void;
	HandleDistortionLevel(event: Event, value: number, activeThumb: number): void;
	HandleTremoloLevel(event: Event, value: number, activeThumb: number): void;
	HandleChorusLevel(event: Event, value: number, activeThumb: number): void;
	HandleVibratoLevel(event: Event, value: number, activeThumb: number): void;
	HandlePitchLevel(event: Event, value: number, activeThumb: number): void;
	HandleTempoLevel(event: Event, value: number, activeThumb: number): void;
	ResetToDefaults(): void;
	ResetVolumeLevels(): void;
}

export const AppContext = React.createContext<IAppContext>(undefined);

export const AppContextProvider = (props: IAppContextProps) => {
	const [swatches, setSwatches] = React.useState<ISwatch[]>([]);
	const [selectedSwatch, setSelectedSwatch] = React.useState<ISwatch>(null);
	const [updateSwatch, setUpdateSwatch] = React.useState<boolean>(true);
	const [selectedAudio, setSelectedAudio] = React.useState<IAudio>(null);
	const [distortionEffect, setDistortionEffect] = React.useState(null);
	const [distortionLevel, setDistortionLevel] = React.useState<number>(0);
	const [tremoloEffect, setTremoloEffect] = React.useState(null);
	const [tremoloLevel, setTremoloLevel] = React.useState<number>(0);
	const [chorusEffect, setChorusEffect] = React.useState(null);
	const [chorusLevel, setChorusLevel] = React.useState<number>(0);
	const [vibratoEffect, setVibratoEffect] = React.useState(null);
	const [vibratoLevel, setVibratoLevel] = React.useState<number>(0);
	const [pitchEffect, setPitchEffect] = React.useState(null);
	const [pitchLevel, setPitchLevel] = React.useState<number>(0);
	// Used to display tempo level to user but not used for calculations when determining duration
	const [visualTempoLevel, setVisualTempoLevel] = React.useState<number>(1);
	const [tempoLevel, setTempoLevel] = React.useState<number>(1);
	const [playerTimestamp, setPlayerTimestamp] = React.useState<number>(null);

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

					if (albumArt) {
						console.log(data.frontmatter?.albumArtColor);
						cardColor = data.frontmatter?.albumArtColor;
					}

					let foundAudio: IAudio = {
						Name: audio.name,
						FullName: data.frontmatter.title,
						Path: audio.publicURL,
						AlbumArt: albumArt,
						CardColor: cardColor,
						Stems: []
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

			setTracks(foundTracks);
			setDownloads(foundDownloads);
		}
	};

	React.useEffect(() => {
		setData();
	}, []);

	const setEffectsChain = (randomizeEffects: boolean): void => {
		const distValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : distortionLevel;
		const tremoloValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : tremoloLevel;
		const vibratoValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : vibratoLevel;
		const chorusValue: number = randomizeEffects ? Math.floor(Math.random() * (25 - 0 + 1) + 0) : chorusLevel;
		const pitchValue: number = randomizeEffects ? Math.floor(Math.random() * (12 - -12 + 1)) + -12 : pitchLevel;

		let tempDistortion = new Tone.Distortion(1);
		tempDistortion.wet.value = distValue / 100;

		let tempPitch = new Tone.PitchShift();
		tempPitch.pitch = pitchValue;

		let tempTremelo = new Tone.Tremolo(10, 1);
		tempTremelo.wet.value = tremoloValue / 100;

		let tempVibrato = new Tone.Vibrato(15, 1);
		tempVibrato.wet.value = vibratoValue / 100;

		let tempChorus = new Tone.Chorus(15, 6, 1);
		tempChorus.wet.value = chorusValue / 100;

		if (randomizeEffects) {
			setDistortionLevel(distValue);
			setPitchLevel(pitchValue);
			setTremoloLevel(tremoloValue);
			setVibratoLevel(vibratoValue);
			setChorusLevel(chorusValue);
		}

		setDistortionEffect(tempDistortion);
		setPitchEffect(tempPitch);
		setTremoloEffect(tempTremelo);
		setVibratoEffect(tempVibrato);
		setChorusEffect(tempChorus);

		Tone.Destination.chain(tempDistortion, tempPitch, tempTremelo, tempVibrato, tempChorus);
	};

	const updateSelectedAudio = async (audio: IAudio, randomizeEffects: boolean): Promise<void> => {
		if (Tone.Transport.state === "started" || Tone.Transport.state === "paused" || (Tone.Transport.state === "stopped" && playerRef.current)) {
			if (selectedAudio.CurrentTimestampEventId) {
				Tone.Transport.clear(selectedAudio.CurrentTimestampEventId);
			}

			if (Tone.Transport.state === "paused") {
				Tone.Transport.start();
			}

			if (selectedAudio.Stems.length > 0) {
				selectedAudio.Stems.forEach((stem) => {
					playerRef.current.player(stem.Name).unsync();
					playerRef.current.player(stem.Name).dispose();
				});
			} else {
				playerRef.current.unsync();
				playerRef.current.dispose();
			}

			distortionEffect.dispose();
			chorusEffect.dispose();
			tremoloEffect.dispose();
			vibratoEffect.dispose();
			pitchEffect.dispose();

			if (recorderRef.current) {
				recorderRef.current.dispose();
			}
		}

		const tempoValue: number = randomizeEffects ? Math.random() * (1.4 - 0.6 + 1) + 0.6 : tempoLevel;

		if (audio.Stems.length > 0) {
			const initialURLs = audio.Stems.reduce((acc, stem) => {
				const name: string = stem["Name"];
				acc[name] = stem["Path"];
				return acc;
			}, {});

			let duration: number = 0;
			playerRef.current = new Tone.Players({
				urls: initialURLs,
				onload: async () => {
					await Promise.all(
						audio.Stems.map(async (stem) => {
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
					);

					audio.Duration = duration / tempoValue;

					const currentTimestampEventId: number = Tone.Transport.scheduleRepeat(
						() => {
							setPlayerTimestamp(Tone.TransportTime().toSeconds());
						},
						1,
						0,
						audio.Duration
					);

					audio.CurrentTimestampEventId = currentTimestampEventId;
					audio.Bpm = Tone.Transport.bpm.value;

					setSelectedAudio(audio);
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
					setPlayerTimestamp(Tone.TransportTime().toSeconds());
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

		tremoloEffect.wet.value = 0;
		setTremoloLevel(0);
		setTremoloEffect(tremoloEffect);

		chorusEffect.wet.value = 0;
		setChorusLevel(0);
		setChorusEffect(chorusEffect);

		vibratoEffect.wet.value = 0;
		setVibratoLevel(0);
		setVibratoEffect(vibratoEffect);

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
		const convertedDistLevel: number = value / 100;
		distortionEffect.wet.value = convertedDistLevel;
		setDistortionLevel(value);
	};

	const handlePitchLevel = (event: Event, value: number, activeThumb: number): void => {
		pitchEffect.pitch = value;
		setPitchLevel(value);
	};

	const handleTempoLevel = (event: Event, value: number, activeThumb: number): void => {
		if (selectedAudio.Stems.length > 0) {
			selectedAudio.Stems.forEach((stem) => {
				playerRef.current.player(stem.Name).playbackRate = value;
			});
		} else {
			playerRef.current.playbackRate = value;
		}

		setVisualTempoLevel(value);
	};

	const handleTremoloLevel = (event: Event, value: number, activeThumb: number): void => {
		const convertedTremoloLevel: number = value / 100;
		tremoloEffect.wet.value = convertedTremoloLevel;
		setTremoloLevel(value);
	};

	const handleChorusLevel = (event: Event, value: number, activeThumb: number): void => {
		const convertedChorusLevel: number = value / 100;
		chorusEffect.wet.value = convertedChorusLevel;
		setChorusLevel(value);
	};

	const handleVibratoLevel = (event: Event, value: number, activeThumb: number): void => {
		const convertedVibratoLevel: number = value / 100;
		vibratoEffect.wet.value = convertedVibratoLevel;
		setVibratoLevel(value);
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
		TremoloLevel: tremoloLevel,
		TremoloEffect: tremoloEffect,
		ChorusLevel: chorusLevel,
		ChorusEffect: chorusEffect,
		VibratoLevel: vibratoLevel,
		VibratoEffect: vibratoEffect,
		PitchLevel: pitchLevel,
		PitchEffect: pitchEffect,
		TempoLevel: tempoLevel,
		VisualTempoLevel: visualTempoLevel,
		PlayerTimestamp: playerTimestamp,
		SetTempoLevel: setTempoLevel,
		SetSelectedSwatch: setSelectedSwatch,
		SetUpdateSwatch: setUpdateSwatch,
		SetSwatches: setSwatches,
		SetSelectedAudio: setSelectedAudio,
		SetPlayerTimestamp: setPlayerTimestamp,
		UpdateSelectedAudio: updateSelectedAudio,
		HandleDistortionLevel: handleDistortionLevel,
		HandleTremoloLevel: handleTremoloLevel,
		HandleVibratoLevel: handleVibratoLevel,
		HandleChorusLevel: handleChorusLevel,
		HandlePitchLevel: handlePitchLevel,
		HandleTempoLevel: handleTempoLevel,
		ResetToDefaults: resetToDefaults,
		ResetVolumeLevels: resetVolumeLevels
	};

	return <AppContext.Provider value={contextObject}>{props.children}</AppContext.Provider>;
};
