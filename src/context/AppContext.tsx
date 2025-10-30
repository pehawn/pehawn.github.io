import * as React from "react";
import * as Tone from "tone";
import { IAudio } from "../types/IAudio";
import { ISwatch } from "../types/ISwatch";
import { getImage } from "gatsby-plugin-image";
import { HexToHSL } from "../components/colorPicker/Helpers";
import useDevHook, { ReactHook } from "../hooks/UseDevHook";
import { IAlbum } from "../types/IAlbum";

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
	Albums: IAlbum[];
	Player: any;
	Recorder: any;
	Timestamp: any;
	EndTimestamp: any;
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
	HandleDistortionLevel(event: Event, value: number): void;
	HandleFeedbackDelayLevel(event: Event, value: number): void;
	HandleChorusLevel(event: Event, value: number): void;
	HandleVibratoLevel(event: Event, value: number): void;
	HandleLowPassFilterLevel(event: Event, value: number): void;
	HandleReverbLevel(event: Event, value: number): void;
	HandlePhaserLevel(event: Event, value: number): void;
	HandlePitchLevel(event: Event, value: number): void;
	HandleTempoLevel(event: Event, value: number): void;
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

	const env: string = process.env.GATSBY_ENV;

	const showTutorialDialog: boolean = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("ShowTutorial")) : false;

	// State objects
	const [swatches, setSwatches] = useDevHook<ISwatch[]>([], "swatches", ReactHook.State, env);
	const [selectedSwatch, setSelectedSwatch] = useDevHook<ISwatch>(null, "selectedSwatch", ReactHook.State, env);
	const [updateSwatch, setUpdateSwatch] = useDevHook<boolean>(true, "updateSwatch", ReactHook.State, env);
	const [selectedAudio, setSelectedAudio] = useDevHook<IAudio>(null, "selectedAudio", ReactHook.State, env);
	const [distortionEffect, setDistortionEffect] = useDevHook(null, "distortionEffect", ReactHook.State, env);
	const [distortionLevel, setDistortionLevel] = useDevHook<number>(0, "distortionLevel", ReactHook.State, env);
	const [feedbackDelayEffect, setFeedbackDelayEffect] = useDevHook(null, "feedbackDelayEffect", ReactHook.State, env);
	const [feedbackDelayLevel, setFeedbackDelayLevel] = useDevHook<number>(0, "feedbackDelayLevel", ReactHook.State, env);
	const [chorusEffect, setChorusEffect] = useDevHook(null, "chorusEffect", ReactHook.State, env);
	const [chorusLevel, setChorusLevel] = useDevHook<number>(0, "chorusLevel", ReactHook.State, env);
	const [vibratoEffect, setVibratoEffect] = useDevHook(null, "vibratoEffect", ReactHook.State, env);
	const [vibratoLevel, setVibratoLevel] = useDevHook<number>(0, "vibratoLevel", ReactHook.State, env);
	const [lowPassFilterEffect, setLowPassFilterEffect] = useDevHook(null, "lowPassFilterEffect", ReactHook.State, env);
	const [lowPassFilterLevel, setLowPassFilterLevel] = useDevHook<number>(0, "lowPassFilterLevel", ReactHook.State, env);
	const [reverbEffect, setReverbEffect] = useDevHook(null, "reverbEffect", ReactHook.State, env);
	const [reverbLevel, setReverbLevel] = useDevHook<number>(0, "reverbLevel", ReactHook.State, env);
	const [phaserEffect, setPhaserEffect] = useDevHook(null, "phaserEffect", ReactHook.State, env);
	const [phaserLevel, setPhaserLevel] = useDevHook<number>(0, "phaserLevel", ReactHook.State, env);
	const [pitchEffect, setPitchEffect] = useDevHook(null, "pitchEffect", ReactHook.State, env);
	const [pitchLevel, setPitchLevel] = useDevHook<number>(0, "pitchLevel", ReactHook.State, env);
	// Used to display tempo level to user but not used for calculations when determining duration
	const [visualTempoLevel, setVisualTempoLevel] = useDevHook<number>(1, "visualTempoLevel", ReactHook.State, env);
	const [tempoLevel, setTempoLevel] = useDevHook<number>(1, "tempoLevel", ReactHook.State, env);
	const [playerTimestamp, setPlayerTimestamp] = useDevHook<number>(null, "playerTimestamp", ReactHook.State, env);
	const [displayTutorialDialog, setDisplayTutorialDialog] = useDevHook<boolean>(showTutorialDialog, "displayTutorialDialog", ReactHook.State, env);
	const [displayTrainingModules, setDisplayTrainingModules] = useDevHook<boolean[]>([false, false, false, false, false, false], "displayTrainingModules", ReactHook.State, env);
	const [tracks, setTracks] = useDevHook<IAudio[]>([], "tracks", ReactHook.State, env);
	const [downloads, setDownloads] = useDevHook<string[]>([], "downloads", ReactHook.State, env);
	const [albums, setAlbums] = useDevHook<IAlbum[]>([], "albums", ReactHook.State, env);
	//const [isPlaying, setIsPlaying] = useDevHook<boolean>(false, "isPlaying", ReactHook.State, env);

	// Ref Objects
	const playerRef = useDevHook(null, "playerRef", ReactHook.Ref, env);
	const recorderRef = useDevHook(null, "recorderRef", ReactHook.Ref, env);
	const timestampEventRef = React.useRef<number | null>(null);
	const endEventRef = React.useRef<number | null>(null);

	const setData = async (): Promise<void> => {
		if (props.graphQlData.allMdx.nodes) {
			let foundTracks: IAudio[] = [];
			let foundDownloads: string[] = [];
			let foundAlbums: IAlbum[] = [];

			for (const data of props.graphQlData.allMdx.nodes) {
				if (data.frontmatter.audio.filter((t) => t.dir.includes("downloads")).length > 0) {
					foundDownloads.push(data.frontmatter.audio[0].publicURL);
				} else {
					const audio = data?.frontmatter?.audio.filter((t) => !t.publicURL.includes("Stems"))[0];
					const imageNode = props.graphQlData.allFile.nodes.find(
						(f) => f.name.replaceAll("_", " ").toLowerCase() === data.frontmatter?.album?.toLowerCase()
					);

					let albumArt = getImage(imageNode?.childImageSharp);

					let foundAudio: IAudio = {
						Name: audio.name,
						FullName: data?.frontmatter?.title,
						Path: audio.publicURL,
						Stems: [],
						Order: data?.frontmatter?.order,
						Duration: data?.frontmatter?.duration
					};

					if (data?.frontmatter?.album && !foundAlbums.includes(data?.frontmatter?.album)) {
						const album: IAlbum = {
							Name: data?.frontmatter?.album,
							ReleaseDate: new Date(data?.frontmatter?.date),
							Songs: [foundAudio],
							Type: data?.frontmatter?.albumType,
							Artwork: albumArt
						};
						foundAlbums.push(album);
						foundAudio.Album = album;
					} else {
						const albumIndex = foundAlbums.findIndex((album) => album.Name === data?.frontmatter?.album);
						if (albumIndex !== -1) {
							foundAlbums[albumIndex].Songs.push(foundAudio);
							foundAudio.Album = foundAlbums[albumIndex];
						}
					}

					for (const stem of data?.frontmatter?.audio.filter((t) => t.relativeDirectory.includes("Stems"))) {
						foundAudio.Stems.push({
							Name: stem.name.replace("_", " "),
							Path: stem.publicURL,
							Volume: 0
						});
					}

					foundTracks.push(foundAudio);
				}
			}

			foundAlbums.sort((a, b) => (a.ReleaseDate < b.ReleaseDate ? 1 : -1));

			// Sort tracks based on album color in ascending order
			foundTracks.sort((a, b) => a.Order - b.Order);

			const showTutorial: boolean = JSON.parse(localStorage.getItem("ShowTutorial"));
			setDisplayTutorialDialog(showTutorial ?? true);

			setTracks(foundTracks);
			setDownloads(foundDownloads);
			setAlbums(foundAlbums);

			Tone.start();
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
		try {
			console.log('Starting updateSelectedAudio');

			// 1. Clear ALL old events FIRST
			if (timestampEventRef.current !== null) {
				Tone.getTransport().clear(timestampEventRef.current);
				console.log('Cleared old timestamp event:', timestampEventRef.current);
				timestampEventRef.current = null;
			}

			if (endEventRef.current !== null) {
				Tone.getTransport().clear(endEventRef.current);
				console.log('Cleared old end event:', endEventRef.current);
				endEventRef.current = null;
			}

			// 2. Ensure audio context is started
			await Tone.start();

			// 3. Stop and dispose current playback
			if (playerRef.current) {
				try {
					playerRef.current.stop();
				} catch (e) {
					console.warn('Error stopping player:', e);
				}
			}

			// Stop transport
			Tone.getTransport().stop();
			Tone.getTransport().cancel();

			// Remove old end listener
			Tone.getTransport().off('stop');

			// 4. Clean up old resources
			if (selectedAudio?.CurrentTimestampEventId) {
				Tone.getTransport().clear(selectedAudio.CurrentTimestampEventId);
			}

			if (selectedAudio?.Stems?.length > 0) {
				selectedAudio.Stems.forEach((stem) => {
					try {
						playerRef.current?.player(stem.Name)?.unsync();
						playerRef.current?.player(stem.Name)?.dispose();
					} catch (e) {
						console.error('Error disposing stem:', e);
					}
				});
			} else if (playerRef.current) {
				try {
					playerRef.current.unsync();
					playerRef.current.dispose();
				} catch (e) {
					console.error('Error disposing player:', e);
				}
			}

			// 5. Dispose effects
			[distortionEffect, chorusEffect, feedbackDelayEffect, vibratoEffect,
				pitchEffect, lowPassFilterEffect, reverbEffect, phaserEffect].forEach(effect => {
					try {
						effect?.dispose();
					} catch (e) {
						console.error('Error disposing effect:', e);
					}
				});

			if (recorderRef.current) {
				try {
					recorderRef.current.dispose();
				} catch (e) {
					console.error('Error disposing recorder:', e);
				}
			}

			const tempoValue = randomizeEffects ? Math.random() * (1.4 - 0.6 + 1) + 0.6 : tempoLevel;

			if (audio.Stems?.length > 0) {
				console.log('Loading stems:', audio.Stems.length);

				const initialURLs = audio.Stems.reduce((acc, stem) => {
					acc[stem.Name] = stem.Path;
					return acc;
				}, {});

				let duration = 0;

				playerRef.current = new Tone.Players({
					urls: initialURLs,
					onload: async () => {
						console.log('Stems loaded');
						try {
							// Set up channels
							audio.Stems.forEach((stem) => {
								const stemLength = playerRef.current.player(stem.Name).buffer.duration;
								if (stemLength > duration) {
									duration = stemLength;
								}

								const tempChannel = new Tone.Channel().toDestination();
								stem.Channel = tempChannel;

								const player = playerRef.current.player(stem.Name);
								player.connect(tempChannel);
								player.reverse = audio.Reversed;
								player.playbackRate = tempoValue;
								player.volume.value = 0;
								player.sync();
								player.start(0);
							});

							audio.Duration = duration / tempoValue;

							// Update state first
							setSelectedAudio(audio);
							setPlayerTimestamp(0);

							// Reset transport BEFORE scheduling events
							Tone.getTransport().seconds = 0;

							// Schedule timestamp updates
							const newTimestampEventId = Tone.getTransport().scheduleRepeat(
								() => {
									setPlayerTimestamp(Tone.Transport.seconds);
								},
								1,
								0,
								audio.Duration
							);

							timestampEventRef.current = newTimestampEventId;
							console.log('Timestamp event scheduled:', newTimestampEventId);

							// Start transport
							Tone.getTransport().start();

							// Schedule end event
							const newEndEventId = Tone.getTransport().scheduleOnce(() => {
								console.log('Song ended');
								setPlayerTimestamp(0);
								Tone.getTransport().stop();
								Tone.getTransport().seconds = 0;
								endEventRef.current = null;
							}, `+${audio.Duration}`);

							endEventRef.current = newEndEventId;
							console.log('End event scheduled:', newEndEventId);

						} catch (error) {
							console.error('Error in onload callback:', error);
						}
					}
				}).toDestination();

			} else {
				console.log('Loading single audio file:', audio.Path);

				playerRef.current = new Tone.Player({
					url: audio.Path,
					onload: () => {
						console.log('Single audio loaded');
						try {
							playerRef.current.reverse = audio.Reversed;
							playerRef.current.playbackRate = tempoValue;
							playerRef.current.volume.value = 0;
							playerRef.current.sync();

							audio.Duration = (playerRef.current.buffer.duration as number) / tempoValue;

							setSelectedAudio(audio);
							setPlayerTimestamp(0);

							// Reset transport
							Tone.getTransport().seconds = 0;

							// Schedule timestamp updates
							const newTimestampEventId = Tone.getTransport().scheduleRepeat(
								() => {
									setPlayerTimestamp(Tone.Transport.seconds);
								},
								1,
								0,
								audio.Duration
							);

							timestampEventRef.current = newTimestampEventId;
							console.log('Timestamp event scheduled:', newTimestampEventId);

							// Start playback
							playerRef.current.start(0);
							Tone.getTransport().start();

							// Schedule end event
							const newEndEventId = Tone.getTransport().scheduleOnce(() => {
								console.log('Song ended');
								setPlayerTimestamp(0);
								Tone.getTransport().stop();
								Tone.getTransport().seconds = 0;
								endEventRef.current = null;
							}, `+${audio.Duration}`);

							endEventRef.current = newEndEventId;
							console.log('End event scheduled:', newEndEventId);

						} catch (error) {
							console.error('Error in single audio onload:', error);
						}
					}
				}).toDestination();
			}

			if (randomizeEffects) {
				setTempoLevel(tempoValue);
				setVisualTempoLevel(tempoValue);
			}

			const recorder = new Tone.Recorder();
			recorderRef.current = recorder;
			Tone.getDestination().connect(recorder);

			setEffectsChain(randomizeEffects);

			console.log('updateSelectedAudio complete');

		} catch (error) {
			console.error('Error in updateSelectedAudio:', error);
		}
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
		}

		const updatedDuration: number = (tempoLevel / 1) * selectedAudio.Duration;
		const timestampRatio: number = playerTimestamp / selectedAudio.Duration;
		let updatedTimestamp: number = Math.round(timestampRatio * updatedDuration);

		Tone.getTransport().clear(selectedAudio.CurrentTimestampEventId);
		Tone.getTransport().seconds = updatedTimestamp;

		let currentTimestampEventId: number = Tone.getTransport().scheduleRepeat(
			() => {
				setPlayerTimestamp(Tone.TransportTime().toSeconds());
			},
			1,
			updatedTimestamp,
			updatedDuration - updatedTimestamp
		);

		tempAudio.CurrentTimestampEventId = currentTimestampEventId;
		setPlayerTimestamp(updatedTimestamp);

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

	const handleDistortionLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedDistLevel: number = value / 100;
		distortionEffect.wet.value = convertedDistLevel;
		setDistortionLevel(value);
	};

	const handlePitchLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		pitchEffect.pitch = value;
		setPitchLevel(value);
	};

	const handleTempoLevel = (event: Event, value: number): void => {
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

	const handleFeedbackDelayLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedFeedbackDelayLevel: number = value / 100;
		feedbackDelayEffect.wet.value = convertedFeedbackDelayLevel;
		setFeedbackDelayLevel(value);
	};

	const handleChorusLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedChorusLevel: number = value / 100;
		chorusEffect.wet.value = convertedChorusLevel;
		setChorusLevel(value);
	};

	const handleVibratoLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedVibratoLevel: number = value / 100;
		vibratoEffect.wet.value = convertedVibratoLevel;
		setVibratoLevel(value);
	};

	const handleLowPassFilterLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedLowPassFilterLevel: number = value / 100;
		lowPassFilterEffect.wet.value = convertedLowPassFilterLevel;
		setLowPassFilterLevel(value);
	};

	const handleReverbLevel = (event: Event, value: number): void => {
		// Workaround for mobile slider events, extra mouse down event was getting registered on
		// mobile and causing slider value to jump
		if (event.type === "mousedown" && isIOS) {
			return;
		}
		const convertedReverbLevel: number = value / 100;
		reverbEffect.wet.value = convertedReverbLevel;
		setReverbLevel(value);
	};

	const handlePhaserLevel = (event: Event, value: number): void => {
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
		Albums: albums,
		Tracks: tracks,
		Downloads: downloads,
		Swatches: swatches,
		SelectedSwatch: selectedSwatch,
		UpdateSwatch: updateSwatch,
		SelectedAudio: selectedAudio,
		Player: playerRef,
		Recorder: recorderRef,
		Timestamp: timestampEventRef,
		EndTimestamp: endEventRef,
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
