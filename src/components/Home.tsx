import React, { useState, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { Play, Pause, Volume2, StepForward, StepBack, Menu, X, RotateCcw, Dices } from 'lucide-react';
import { IAudio } from '../types/IAudio';
import * as Tone from "tone";
import { IStem } from '../types/IStem';
import { GatsbyImage } from 'gatsby-plugin-image';

const HawnestAudioPlayer = () => {

  const appContext = React.useContext(AppContext);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showAlbumDropdown, setShowAlbumDropdown] = useState(false);
  const [startLoopTime, setStartLoopTime] = useState<number | null>(null);
  const [endLoopTime, setEndLoopTime] = useState<number | null>(null);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [waveformData, setWaveformData] = useState({});
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [volume, setVolume] = useState(75);
  const [transportState, setTransportState] = useState<string>(Tone.Transport.state);
  const [isLoadingSong, setIsLoadingSong] = useState(false);

  const volumeSliderRef = useRef(null);

  const audioContextRef = useRef(null);

  React.useEffect(() => {
    setSelectedAlbum(appContext?.Albums[0]);
  }, [appContext?.Albums]);

  // React.useEffect(() => {
  //   setTransportState(Tone.Transport.state);
  // }, [Tone.Transport.state]);

  // Add refs to track loop events
  const loopTimestampEventRef = useRef<number | null>(null);

  // Monitor loop state changes
  React.useEffect(() => {
    if (startLoopTime !== null && endLoopTime !== null && !isLooping) {
      activateLoop();
    }
  }, [startLoopTime, endLoopTime]);

  // Activate the loop
  const activateLoop = async (): Promise<void> => {
    try {
      console.log('Activating loop:', startLoopTime, 'to', endLoopTime);

      // Clear old events
      if (loopTimestampEventRef.current !== null) {
        Tone.Transport.clear(loopTimestampEventRef.current);
        loopTimestampEventRef.current = null;
      }

      // Set up loop on transport
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = startLoopTime;
      Tone.Transport.loopEnd = endLoopTime;

      // Jump to loop start
      Tone.Transport.seconds = startLoopTime;

      // Schedule timestamp updates within the loop
      const loopDuration = endLoopTime - startLoopTime;
      const newTimestampEventId = Tone.Transport.scheduleRepeat(
        () => {
          appContext.SetPlayerTimestamp(Tone.Transport.seconds);
        },
        1,
        startLoopTime,
        loopDuration
      );

      loopTimestampEventRef.current = newTimestampEventId;
      setIsLooping(true);

      console.log('Loop activated with timestamp event:', newTimestampEventId);

    } catch (error) {
      console.error('Error activating loop:', error);
    }
  };

  // Set loop start point
  const setLoopStart = (): void => {
    try {
      const currentTime = Tone.Transport.seconds;
      console.log('Loop start set to:', currentTime);
      setStartLoopTime(currentTime);
    } catch (error) {
      console.error('Error setting loop start:', error);
    }
  };

  // Set loop end point
  const setLoopEnd = (): void => {
    try {
      const currentTime = Tone.Transport.seconds;
      console.log('Loop end set to:', currentTime);
      setEndLoopTime(currentTime);
    } catch (error) {
      console.error('Error setting loop end:', error);
    }
  };

  // Cancel/deactivate the loop
  const cancelLoop = (): void => {
    try {
      console.log('Cancelling loop');

      // Clear loop event
      if (loopTimestampEventRef.current !== null) {
        Tone.Transport.clear(loopTimestampEventRef.current);
        loopTimestampEventRef.current = null;
      }

      // Disable loop on transport
      Tone.Transport.loop = false;

      // Jump to end of loop
      Tone.Transport.seconds = endLoopTime;
      appContext.SetPlayerTimestamp(endLoopTime);

      // Schedule regular timestamp tracking for remaining portion
      const remainingDuration = appContext.SelectedAudio.Duration - endLoopTime;
      const newTimestampEventId = Tone.Transport.scheduleRepeat(
        () => {
          appContext.SetPlayerTimestamp(Tone.Transport.seconds);
        },
        1,
        endLoopTime,
        remainingDuration
      );

      // Update the main timestamp event ref
      if (appContext.Timestamp.current !== null) {
        Tone.Transport.clear(appContext.Timestamp.current);
      }
      appContext.Timestamp.current = newTimestampEventId;

      // Reset loop state
      setStartLoopTime(null);
      setEndLoopTime(null);
      setIsLooping(false);

      console.log('Loop cancelled, resuming normal playback');

    } catch (error) {
      console.error('Error cancelling loop:', error);
    }
  };

  // Clear loop without playing remaining portion
  const clearLoop = (): void => {
    try {
      console.log('Clearing loop');

      // Clear loop event
      if (loopTimestampEventRef.current !== null) {
        Tone.Transport.clear(loopTimestampEventRef.current);
        loopTimestampEventRef.current = null;
      }

      // Disable loop
      Tone.Transport.loop = false;

      // Reset loop state
      setStartLoopTime(null);
      setEndLoopTime(null);
      setIsLooping(false);

      console.log('Loop cleared');

    } catch (error) {
      console.error('Error clearing loop:', error);
    }
  };

  const jumpToPosition = (seconds: number): void => {
    try {
      console.log('Jumping to position:', seconds);

      // 1. Calculate new position
      let updatedTimestamp = appContext.PlayerTimestamp + seconds;
      updatedTimestamp = Math.max(0, Math.min(updatedTimestamp, appContext.SelectedAudio.Duration));

      // 2. Set transport directly (don't recreate events)
      Tone.Transport.seconds = updatedTimestamp;

      // 3. Update display immediately
      appContext.SetPlayerTimestamp(updatedTimestamp);

      console.log('Jumped to:', updatedTimestamp);

    } catch (error) {
      console.error('Error in jumpToPosition:', error);
    }
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

  // Play audio via Tone.js Player
  const updateAudio = async (audio: IAudio, reversed: boolean, randomizeEffects: boolean): Promise<void> => {

    if (!appContext.Player.current || appContext.Player.current.loaded) {
      setIsLoadingSong(true);
      let tempAudio: IAudio = { ...audio };
      tempAudio.Reversed = reversed;
      tempAudio.Paused = false;

      try {
        await appContext.UpdateSelectedAudio(tempAudio, randomizeEffects);
      } finally {
        // Small delay to ensure audio is ready
        setTimeout(() => {
          setIsLoadingSong(false);
        }, 500);
      }
    }
  };

  // Generate waveform data from audio file
  const generateWaveform = async (audioUrl, songId) => {
    try {
      // Create audio context if it doesn't exist
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      // Get the raw audio data
      const rawData = audioBuffer.getChannelData(0);
      const samples = 500;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];

      // Sample the data to create waveform bars
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }

      // Normalize the data
      const multiplier = Math.pow(Math.max(...filteredData), -1);
      const normalizedData = filteredData.map(n => n * multiplier);

      setWaveformData(prev => ({
        ...prev,
        [songId]: normalizedData
      }));
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Fallback to generated waveform if file can't be loaded
      const fallbackData = Array.from({ length: 500 }, (_, i) => {
        const seedA = songId * 0.3;
        const seedB = songId * 0.7;
        return Math.abs(
          Math.sin(i * 0.15 + seedA) * 0.5 +
          Math.cos(i * 0.25 + seedB) * 0.3 +
          Math.sin(i * 0.05 + songId) * 0.2
        );
      });
      setWaveformData(prev => ({
        ...prev,
        [songId]: fallbackData
      }));
    }
  };

  // Load waveform when song is hovered
  useEffect(() => {
    if (hoveredCard && !waveformData[hoveredCard]) {
      const song = appContext.Tracks.find(s => s.Name === hoveredCard);
      if (song) {
        generateWaveform(song.Path, song.Name);
      }
    }
  }, [hoveredCard]);

  useEffect(() => {
    if (appContext?.Player?.current) {
      appContext.Player.current.volume.value = Tone.gainToDb(volume / 100);
    }
  }, [volume]);

  // Close volume slider when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (volumeSliderRef.current && !volumeSliderRef.current.contains(event.target)) {
        setShowVolumeSlider(false);
      }
    };

    if (showVolumeSlider) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showVolumeSlider]);

  return (
    <div className="min-h-screen bg-zinc-50 text-black">
      {/* Modal/Overlay */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowModal(null)}
        >
          <div
            className="bg-zinc-50 w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-black/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-zinc-50 border-b border-black/10 px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl tracking-wide">{showModal === 'info' ? 'INFO' : 'CONTACT'}</h2>
              <button
                onClick={() => setShowModal(null)}
                className="text-2xl hover:opacity-50 transition-opacity leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-4 sm:px-8 py-6 sm:py-8">
              {showModal === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">ABOUT</h3>
                    <p className="text-sm leading-relaxed">
                      Hawnest is an independent artist currently residing in Kansas City, Missouri. Their music explores themes of nostalgia, longing, and impermanence through a blend of electronic and organic sounds. Drawing inspiration from genres such as Indie Pop, R&B, and Hip Hop, Hawnest crafts immersive soundscapes that invite listeners to reflect and introspect.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">CREDITS</h3>
                    <p className="text-sm leading-relaxed">
                      All tracks written, produced, and performed by Hawnest<br />
                      Recorded at various locations across 2022-2025<br />
                      Mixed by Martin Cooke, Spencer Hoad<br />
                      Mastered by Simon Lancelot
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">LINKS</h3>
                    <div className="flex flex-col gap-2 text-sm">
                      <a href="https://open.spotify.com/artist/3h3LNc3azuPly6IhUnevmn" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">
                        Spotify →
                      </a>
                      <a href="https://music.apple.com/us/artist/hawnest/1842981468" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Apple Music →</a>
                      <a href="https://www.instagram.com/hawnest_" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Instagram →</a>
                      {/* <a href="#" className="hover:opacity-50 transition-opacity">Bandcamp →</a> */}
                    </div>
                  </div>
                </div>
              )}

              {showModal === 'contact' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">GET IN TOUCH</h3>
                    <p className="text-sm leading-relaxed mb-4">
                      For booking inquiries, collaborations, or general questions, please reach out via email.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">EMAIL</h3>
                    <a href="mailto:contact@hawnest.com" className="text-sm hover:opacity-50 transition-opacity">
                      hawnestmusic@gmail.com
                    </a>
                  </div>
                  <div>
                    <h3 className="text-sm tracking-wider opacity-60 mb-2">SOCIAL</h3>
                    <div className="flex flex-col gap-2 text-sm">
                      <a href="https://www.instagram.com/hawnest_/" target="_blank" rel="noopener noreferrer" className="hover:opacity-50 transition-opacity">Instagram →</a>
                      {/* <a href="#" className="hover:opacity-50 transition-opacity">Twitter →</a>
                      <a href="#" className="hover:opacity-50 transition-opacity">Soundcloud →</a> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Minimal */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-zinc-50/95 backdrop-blur-sm border-b border-black/5">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="text-sm tracking-wider">HAWNEST</div>
          {/* Album Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowAlbumDropdown(!showAlbumDropdown)}
              className="text-xs tracking-wider opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2"
            >
              {selectedAlbum?.Name}
              <span className="text-[10px]">▼</span>
            </button>
            {showAlbumDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-zinc-50 border border-black/10 shadow-lg min-w-[200px]">
                {appContext?.Albums.map((album) => (
                  <button
                    key={album.Name}
                    onClick={() => {
                      setSelectedAlbum(album);
                      setShowAlbumDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 text-xs tracking-wider hover:bg-black/5 transition-colors flex justify-between items-center"
                  >
                    <span>{album.Name}</span>
                    <span className="opacity-40">{album.Type} · {album.ReleaseDate?.getFullYear()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:flex gap-6 lg:gap-8 text-xs tracking-wider">
          <button
            disabled={true}
            className="hover:opacity-50 transition-opacity"
          >
            TOUR
          </button>
          <button
            disabled={true}
            className="hover:opacity-50 transition-opacity"
          >
            MERCH
          </button>
          <button
            onClick={() => setShowModal('info')}
            className="hover:opacity-50 transition-opacity"
          >
            INFO
          </button>
          <button
            onClick={() => setShowModal('contact')}
            className="hover:opacity-50 transition-opacity"
          >
            CONTACT
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden hover:opacity-50 transition-opacity"
        >
          {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="fixed top-[52px] sm:top-[60px] left-0 right-0 z-40 bg-zinc-50 border-b border-black/10 md:hidden">
          <div className="flex flex-col text-xs tracking-wider">
            <button
              onClick={() => {
                setShowAlbumDropdown(!showAlbumDropdown);
              }}
              className="px-4 py-4 text-left hover:bg-black/5 transition-colors border-b border-black/5 flex items-center justify-between"
            >
              <span>ALBUM: {selectedAlbum?.Name}</span>
              <span className="text-[10px]">{showAlbumDropdown ? '▲' : '▼'}</span>
            </button>
            {showAlbumDropdown && (
              <div className="bg-zinc-100/50">
                {appContext?.Albums.map((album) => (
                  <button
                    key={album.Name}
                    onClick={() => {
                      setSelectedAlbum(album);
                      setShowAlbumDropdown(false);
                      setShowMobileMenu(false);
                    }}
                    className="w-full text-left px-8 py-3 text-xs tracking-wider hover:bg-black/5 transition-colors border-b border-black/5"
                  >
                    {album.Name}
                  </button>
                ))}
              </div>
            )}
            <button
              disabled={true}
              className="px-4 py-4 text-left hover:bg-black/5 transition-colors border-b border-black/5">
              TOUR
            </button>
            <button
              disabled={true}
              className="px-4 py-4 text-left hover:bg-black/5 transition-colors border-b border-black/5">
              MERCH
            </button>
            <button
              onClick={() => {
                setShowModal('info');
                setShowMobileMenu(false);
              }}
              className="px-4 py-4 text-left hover:bg-black/5 transition-colors border-b border-black/5"
            >
              INFO
            </button>
            <button
              onClick={() => {
                setShowModal('contact');
                setShowMobileMenu(false);
              }}
              className="px-4 py-4 text-left hover:bg-black/5 transition-colors"
            >
              CONTACT
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pt-14 sm:pt-16 px-4 sm:px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="py-12 sm:py-20 border-b border-black/10 flex flex-col sm:flex-row items-start gap-6 sm:gap-8">
            {/* Album Art */}
            {/* <div className="w-48 h-48 bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-6xl font-light tracking-wider text-zinc-400 flex-shrink-0">
              R
            </div> */}
            {selectedAlbum && <GatsbyImage image={selectedAlbum?.Artwork} alt={selectedAlbum?.Name} className="rounded-lg w-full sm:w-64 lg:w-80 flex-shrink-0" />}
            {/* Album Info */}
            <div className="pt-0 sm:pt-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-4 tracking-tight">{selectedAlbum?.Name}</h1>
              <p className="text-xs sm:text-sm tracking-wider opacity-60">{selectedAlbum?.Type} · {selectedAlbum?.ReleaseDate?.getFullYear()} · {selectedAlbum?.Songs.length} TRACKS</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="py-6 sm:py-8 border-b border-black/10">
            <div className="flex gap-4 sm:gap-6 text-xs tracking-wider overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                disabled={appContext.SelectedAudio === null ? true : false}
                onClick={() => activeFilter === 'STEMS' ? setActiveFilter(null) : setActiveFilter('STEMS')}
                className={`whitespace-nowrap transition-opacity ${activeFilter === 'STEMS' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}
                disabled:opacity-30 disabled:hover:opacity-30 disabled:cursor-not-allowed`}
              >
                LEVELS
              </button>
              <button
                disabled={appContext.SelectedAudio === null ? true : false}
                onClick={() => activeFilter === 'EFFECTS' ? setActiveFilter(null) : setActiveFilter('EFFECTS')}
                className={`whitespace-nowrap transition-opacity ${activeFilter === 'EFFECTS' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}
                disabled:opacity-30 disabled:hover:opacity-30 disabled:cursor-not-allowed`}
              >
                EFFECTS
              </button>
              <button
                disabled={appContext.SelectedAudio === null ? true : false}
                onClick={() => activeFilter === 'LOOPS' ? setActiveFilter(null) : setActiveFilter('LOOPS')}
                className={`whitespace-nowrap transition-opacity ${activeFilter === 'LOOPS' ? 'opacity-100' : 'opacity-30 hover:opacity-60'}
                disabled:opacity-30 disabled:hover:opacity-30 disabled:cursor-not-allowed`}
              >
                LOOPER
              </button>
            </div>

            {/* Control Panels */}
            {activeFilter === 'STEMS' && appContext.SelectedAudio && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-zinc-100/50 border border-black/5 space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => { appContext.ResetVolumeLevels() }}
                    className="text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    RESET TO DEFAULT
                  </button>
                </div>
                {appContext.SelectedAudio && appContext.SelectedAudio.Stems.length > 0 && appContext.SelectedAudio.Stems.map((stem) => {
                  let audio: IAudio = { ...appContext.SelectedAudio };
                  let currentStem: IStem = appContext.SelectedAudio.Stems.find((track) => track.Name === stem.Name);
                  let currentStemIndex: number = appContext.SelectedAudio.Stems.indexOf(stem);
                  let stemVolume = 100 + (currentStem?.Volume * 2);
                  let stemName = currentStem?.Name;

                  if (stemVolume == 0) {
                    audio.Stems[currentStemIndex].Channel.mute = true;
                    appContext.Player.current.player(stem.Name).mute = true;
                  }

                  return (
                    <div key={stem.Name}>
                      <div className="flex items-center gap-4 pr-0 sm:pr-16">
                        <div className="text-xs tracking-wider opacity-60 flex-1">{stemName}</div>
                        <button
                          onClick={() => {
                            appContext.Player.current.player(stem.Name).reverse = !appContext.Player.current.player(stem.Name).reverse;
                          }}
                          className="flex-none text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all whitespace-nowrap">
                          {appContext.Player.current.player(stem.Name).reverse ? 'FORWARD' : 'REVERSE'}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <input
                          type="range"
                          min="-50"
                          max="10"
                          step="0.5"
                          value={currentStem?.Volume}
                          onChange={(e) => {
                            audio.Stems[currentStemIndex].Volume = Number(e.target.value);
                            appContext.Player.current.player(stem.Name).volume.value = Number(e.target.value)
                            appContext.SetSelectedAudio(audio);
                          }}
                          className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                        />
                        <div className="text-xs tracking-wider opacity-60 w-12 text-right">{stemVolume}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeFilter === 'EFFECTS' && appContext.SelectedAudio && (
              <div className="mt-6 p-6 bg-zinc-100/50 border border-black/5 space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={appContext.ResetToDefaults}
                    className="text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    RESET TO DEFAULT
                  </button>
                </div>
                {/* Tempo */}
                <div className="text-xs tracking-wider opacity-60">Tempo</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0.01"
                    max="3.4"
                    step="0.01"
                    value={appContext.VisualTempoLevel}
                    onChange={(e) => appContext.HandleTempoLevel(e.nativeEvent, Number(e.target.value))}
                    onMouseUp={(e) => updateScheduleTimingEvent(e.nativeEvent, Number(e.currentTarget.value))}
                    onTouchEnd={(e) => updateScheduleTimingEvent(e.nativeEvent, Number(e.currentTarget.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  {/* <div className="text-xs tracking-wider opacity-60 w-12 text-right">{effectLevel}%</div> */}
                </div>
                {/* Pitch */}
                <div className="text-xs tracking-wider opacity-60">Pitch</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={appContext.PitchLevel}
                    onChange={(e) => appContext.HandlePitchLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Reverb */}
                <div className="text-xs tracking-wider opacity-60">Reverb</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.ReverbLevel}
                    onChange={(e) => appContext.HandleReverbLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Delay */}
                <div className="text-xs tracking-wider opacity-60">Delay</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.FeedbackDelayLevel}
                    onChange={(e) => appContext.HandleFeedbackDelayLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Distortion */}
                <div className="text-xs tracking-wider opacity-60">Distortion</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={appContext.DistortionLevel}
                    onChange={(e) => appContext.HandleDistortionLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Chorus */}
                <div className="text-xs tracking-wider opacity-60">Slapback</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.ChorusLevel}
                    onChange={(e) => appContext.HandleChorusLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Vibrato */}
                <div className="text-xs tracking-wider opacity-60">Phone</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.VibratoLevel}
                    onChange={(e) => appContext.HandleVibratoLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Low Pass */}
                <div className="text-xs tracking-wider opacity-60">Low Pass Filter</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.LowPassFilterLevel}
                    onChange={(e) => appContext.HandleLowPassFilterLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                {/* Phaser */}
                <div className="text-xs tracking-wider opacity-60">Phaser</div>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={appContext.PhaserLevel}
                    onChange={(e) => appContext.HandlePhaserLevel(e.nativeEvent, Number(e.target.value))}
                    className="flex-1 h-1 bg-black/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeFilter === 'LOOPS' && appContext.SelectedAudio && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-zinc-100/50 border border-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs tracking-wider opacity-60">LOOP DEFINITION</div>
                  <button
                    onClick={clearLoop}
                    className="text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                  >
                    CLEAR
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <button
                    onClick={setLoopStart}
                    disabled={startLoopTime !== null || transportState !== 'started'}
                    className={`w-full sm:flex-1 text-xs tracking-wider px-4 py-3 border border-black/10 rounded-full transition-all ${startLoopTime !== null || transportState !== 'started'
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-black hover:text-white'
                      }`}
                  >
                    {startLoopTime !== null ? `START: ${startLoopTime.toFixed(2)}` : 'SET START'}
                  </button>
                  <button
                    onClick={setLoopEnd}
                    disabled={startLoopTime === null || endLoopTime !== null || transportState !== 'started'}
                    className={`w-full sm:flex-1 text-xs tracking-wider px-4 py-3 border border-black/10 rounded-full transition-all ${startLoopTime === null || endLoopTime !== null || transportState !== 'started'
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-black hover:text-white'
                      }`}
                  >
                    {endLoopTime !== null ? `END: ${endLoopTime.toFixed(2)}` : 'SET END'}
                  </button>
                </div>
                {startLoopTime !== null && endLoopTime !== null && (
                  <div className="mt-4 space-y-3">
                    <div className="text-center text-xs tracking-wider opacity-60 font-bold">
                      LOOP ACTIVE: {startLoopTime.toFixed(2)}s → {endLoopTime.toFixed(2)}s
                    </div>
                    <button
                      onClick={cancelLoop}
                      className="w-full text-xs tracking-wider px-4 py-3 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                      EXIT LOOP
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Song List - Date-Based Archive Style */}
          <div className="py-4">
            {selectedAlbum?.Songs.map((song, index) => (
              <div
                key={song.Name}
                onMouseEnter={() => setHoveredCard(song.Name)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative border-b border-black/5 transition-all duration-300 ${hoveredCard === song.Name ? 'bg-black/[0.02]' : ''
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-6 px-2 sm:px-6 cursor-pointer gap-3 sm:gap-0">
                  {/* Left: Date & Title */}
                  <div className="flex items-center gap-3 sm:gap-8 flex-1 min-w-0">
                    <div className="hidden sm:block text-xs tracking-wider opacity-40 w-20 flex-shrink-0">{selectedAlbum?.ReleaseDate.toISOString().slice(0, 10)}</div>
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <button
                        disabled={isLoadingSong}
                        onClick={() => {
                          if (appContext.SelectedAudio?.Name !== song.Name || Tone.Transport.state === 'stopped') {
                            updateAudio(song, false, false);
                            setTransportState('started');
                          } else if (transportState === 'started') {
                            Tone.Transport.pause();
                            setTransportState('paused');
                          } else if (transportState === 'paused') {
                            Tone.Transport.start();
                            setTransportState('started');
                          }
                        }}
                        className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all flex-shrink-0"
                      >
                        {isLoadingSong ? (
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        ) : appContext.SelectedAudio?.Name === song.Name && Tone.Transport.state === 'started' ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </button>
                      <h3 className="text-base sm:text-lg tracking-wide truncate flex-1">{song.Name}</h3>
                      <div className="flex sm:hidden items-center gap-2 flex-shrink-0">
                        <button disabled={isLoadingSong} title="Reverse" onClick={() => {
                          updateAudio(song, true, false);
                        }}>
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button disabled={isLoadingSong} title="Randomize" onClick={() => {
                          updateAudio(song, Math.random() <= 0.5, true);
                        }}>
                          <Dices className="w-3.5 h-3.5" />
                        </button>
                        <div className="text-xs tracking-wider opacity-40 w-10 text-right">{song?.Duration}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Controls & Duration */}
                  <div className="hidden sm:flex items-center justify-end gap-4 sm:gap-6">
                    <div className={`flex gap-2 transition-opacity duration-300 ${hoveredCard === song.Name ? 'opacity-100' : 'sm:opacity-0 opacity-100'
                      }`}>
                      <button
                        disabled={isLoadingSong}
                        onClick={() => {
                          updateAudio(song, true, false);
                        }}
                        className="text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                        REVERSE
                      </button>
                      <button
                        disabled={isLoadingSong}
                        onClick={() => {
                          updateAudio(song, Math.random() <= 0.5, true);
                        }}
                        className="text-xs tracking-wider px-3 py-1.5 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all">
                        RANDOMIZE
                      </button>
                    </div>
                    <div className="text-xs tracking-wider opacity-40 w-12 text-right flex-shrink-0">{song?.Duration?.toString().replaceAll(".", ":")}</div>
                  </div>
                </div>

                {/* Waveform - Appears on Hover with Real Audio Data */}
                <div className={`hidden sm:block overflow-hidden transition-all duration-500 ${hoveredCard === song.Name ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className="flex items-center gap-0.5 h-20 px-4 pb-6">
                    {waveformData[song.Name] ? (
                      // Real waveform data
                      waveformData[song.Name].map((value, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-black transition-all duration-300"
                          style={{
                            height: `${value * 100}%`,
                          }}
                        ></div>
                      ))
                    ) : (
                      // Loading placeholder
                      [...Array(500)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-black/5 animate-pulse"
                          style={{
                            height: '50%',
                          }}
                        ></div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Player Bar - Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-50/95 backdrop-blur-sm border-t border-black/10 z-50">
        <div className="px-3 sm:px-6 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
            {/* Now Playing */}
            <div className="flex-1 flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Mini Album Art */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-zinc-200 to-zinc-300 flex items-center justify-center text-sm font-light tracking-wider text-zinc-400 flex-shrink-0">
                {appContext.SelectedAudio ? <GatsbyImage image={appContext.SelectedAudio?.Album?.Artwork} alt={appContext.SelectedAudio?.Album?.Name} className="rounded-sm" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm tracking-wide truncate">{appContext?.SelectedAudio?.Album?.Name} - {appContext?.SelectedAudio?.Album?.Type}</div>
                <div className="text-xs tracking-wider opacity-40 mt-0.5 truncate">{appContext?.SelectedAudio ? appContext?.SelectedAudio?.Name + ' · ' + appContext?.SelectedAudio?.Album?.ReleaseDate?.getFullYear() : ''}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <button className="hover:opacity-50 transition-opacity hidden sm:block" onClick={() => jumpToPosition(-10)} disabled={!appContext.SelectedAudio || appContext.PlayerTimestamp <= 10}>
                <StepBack className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full..."
                onClick={() => {
                  if (transportState === "paused") {
                    Tone.Transport.start();
                    setTransportState("started");
                  } else {
                    Tone.Transport.pause();
                    setTransportState("paused");
                  }
                }}
                disabled={!appContext?.SelectedAudio || isLoadingSong}>
                {isLoadingSong ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : transportState === "started" && Tone.Transport.state !== 'stopped' ? (
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
                )}
              </button>
              <button className="hover:opacity-50 transition-opacity hidden sm:block" onClick={() => jumpToPosition(10)} disabled={!appContext.SelectedAudio || appContext.PlayerTimestamp + 10 > appContext?.SelectedAudio?.Duration}>
                <StepForward className="w-4 h-4" />
              </button>
            </div>

            {/* Utility */}
            <div className="flex-1 flex justify-end items-center gap-2 sm:gap-4 min-w-0">
              {/* <button className="hover:opacity-50 transition-opacity">
                <Shuffle className="w-4 h-4" />
              </button> */}
              {/* Volume Control with Vertical Slider */}
              <div className="relative" ref={volumeSliderRef}>
                <button
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  className="hover:opacity-50 transition-opacity"
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Vertical Volume Slider */}
                {showVolumeSlider && (
                  <div className="absolute bottom-full right-0 mb-2 bg-zinc-50 border border-black/10 shadow-lg p-4 rounded-lg">
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative h-32 w-2 bg-black/10 rounded-full">
                        <div
                          className="absolute bottom-0 left-0 w-full bg-black rounded-full transition-all"
                          style={{ height: `${volume}%` }}
                        ></div>
                        {/* Slider Knob */}
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border-2 border-zinc-50 shadow-md transition-all pointer-events-none"
                          style={{ bottom: `calc(${volume}% - 8px)` }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          style={{
                            WebkitAppearance: 'slider-vertical',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-xs tracking-wider opacity-40">{appContext?.SelectedAudio ? Math.floor(appContext?.SelectedAudio?.Duration / 60) + ":" + Math.round(appContext?.SelectedAudio?.Duration % 60).toString() : '-'}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-6xl mx-auto mt-3">
            <div className="h-px bg-black/10 relative">
              <div
                className="absolute top-0 left-0 h-full bg-black transition-all"
                style={{ width: `${Math.min((appContext?.PlayerTimestamp / appContext?.SelectedAudio?.Duration) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HawnestAudioPlayer;