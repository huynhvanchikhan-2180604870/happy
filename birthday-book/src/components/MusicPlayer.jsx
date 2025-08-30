import { motion } from "framer-motion";
import {
  ChevronDown,
  MessageCircle,
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMetadata } from "../contexts/MetadataContext";

const MusicPlayer = () => {
  const { metadata } = useMetadata();
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(metadata?.music?.defaultVolume || 0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(
    metadata?.music?.shuffle || false
  );
  const [isLooped, setIsLooped] = useState(metadata?.music?.loop || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [hasTriedAutoplay, setHasTriedAutoplay] = useState(false);

  const playlist = metadata?.music?.playlist || [];

  const currentTrack = playlist[currentTrackIndex];

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Check if we have a valid audio source
      if (!currentTrack?.src || audioError) {
        console.log("No valid audio source available");
        return;
      }

      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
        setAudioError(true);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack?.src, audioError]);

  // Next track
  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;

    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) =>
        prev === playlist.length - 1 ? 0 : prev + 1
      );
    }
    setAudioError(false);
  }, [playlist.length, isShuffled]);

  // Previous track
  const prevTrack = useCallback(() => {
    if (playlist.length === 0) return;

    if (currentTime > 3) {
      // If more than 3 seconds played, restart current track
      audioRef.current.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) =>
        prev === 0 ? playlist.length - 1 : prev - 1
      );
    }
    setAudioError(false);
  }, [currentTime, playlist.length]);

  // Select specific track
  const selectTrack = useCallback(
    (index) => {
      if (index >= 0 && index < playlist.length) {
        setCurrentTrackIndex(index);
        setAudioError(false);
        setShowPlaylist(false);
      }
    },
    [playlist.length]
  );

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle progress click
  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle progress drag
  const handleProgressDrag = (e) => {
    if (!isDragging || !audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Component mount effect for autoplay
  useEffect(() => {
    // Wait for metadata to be loaded and then try autoplay
    if (metadata && metadata.music?.autoplay && playlist.length > 0) {
      const mountTimer = setTimeout(() => {
        if (!hasTriedAutoplay) {
          const randomIndex = Math.floor(Math.random() * playlist.length);
          setCurrentTrackIndex(randomIndex);
          setHasTriedAutoplay(true);
        }
      }, 2000); // Wait 2 seconds for everything to load

      return () => clearTimeout(mountTimer);
    }
  }, [metadata, playlist.length, hasTriedAutoplay]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (metadata?.music?.autoplay && playlist.length > 0 && !hasTriedAutoplay) {
      // Randomly select a track for autoplay
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
      setHasTriedAutoplay(true);
    }
  }, [metadata?.music?.autoplay, playlist.length, hasTriedAutoplay]);

  // Update audio source when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    audioRef.current.src = currentTrack.src;
    audioRef.current.volume = isMuted ? 0 : volume;
    setAudioError(false);

    // Try to autoplay if enabled and this is the first load
    if (metadata?.music?.autoplay && hasTriedAutoplay && !isPlaying) {
      // Add a small delay to ensure audio is loaded
      setTimeout(() => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setAudioError(false);
              })
              .catch((err) => {
                console.log("Autoplay prevented by browser policy:", err);
                // Don't set audioError for autoplay failures
                setIsPlaying(false);
              });
          }
        }
      }, 100);
    } else if (isPlaying) {
      // Manual play
      audioRef.current.play().catch((err) => {
        console.error("Error playing audio:", err);
        setAudioError(true);
        setIsPlaying(false);
      });
    }
  }, [
    currentTrack,
    isPlaying,
    isMuted,
    volume,
    metadata?.music?.autoplay,
    hasTriedAutoplay,
  ]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isLooped && playlist.length === 1) {
        audio.currentTime = 0;
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
          setAudioError(true);
        });
      } else {
        nextTrack();
      }
    };

    const handleError = () => {
      console.error("Audio error occurred");
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [isLooped, nextTrack, playlist.length]);

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (playlist.length === 0) return null;

  return (
    <>
      {/* Mini Chat Popup Style Music Player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="relative">
          {/* Main Chat Bubble */}
          <motion.div
            animate={{
              scale: isExpanded ? 1 : [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: isExpanded ? 0 : Infinity,
              repeatType: "reverse",
            }}
            className={`liquid-glass rounded-2xl shadow-2xl border border-white/30 transition-all duration-300 ${
              isExpanded ? "w-80 h-96 p-4" : "w-16 h-16 p-3 cursor-pointer"
            }`}
            onClick={() => !isExpanded && setIsExpanded(true)}
          >
            {!isExpanded ? (
              // Mini state - just music icon
              <div className="flex items-center justify-center h-full">
                <Music
                  className={`${
                    isPlaying ? "text-romantic-pink" : "text-gray-600"
                  } transition-colors`}
                  size={24}
                />
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 w-3 h-3 bg-romantic-pink rounded-full animate-pulse"
                  />
                )}
              </div>
            ) : (
              // Expanded state - full player
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="text-romantic-pink" size={20} />
                    <span className="font-medium text-gray-700">
                      Music Player
                    </span>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Track Info with Playlist Dropdown */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20 rounded-lg flex items-center justify-center">
                    <Music className="text-romantic-pink" size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <button
                        onClick={() => setShowPlaylist(!showPlaylist)}
                        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {currentTrack?.title || "Unknown Track"}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {currentTrack?.artist || "Unknown Artist"}
                          </p>
                        </div>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${
                            showPlaylist ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* Playlist Dropdown */}
                      {showPlaylist && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 max-h-32 overflow-y-auto z-50"
                        >
                          {playlist.map((track, index) => (
                            <button
                              key={index}
                              onClick={() => selectTrack(index)}
                              className={`w-full p-2 text-left hover:bg-romantic-pink/10 transition-colors ${
                                index === currentTrackIndex
                                  ? "bg-romantic-pink/20"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 flex items-center justify-center">
                                  {index === currentTrackIndex ? (
                                    <div className="w-2 h-2 bg-romantic-pink rounded-full" />
                                  ) : (
                                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`text-xs font-medium truncate ${
                                      index === currentTrackIndex
                                        ? "text-romantic-pink"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {track.title || `Track ${index + 1}`}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {track.artist || "Unknown Artist"}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    {audioError && (
                      <p className="text-xs text-orange-500 mt-1">
                        Nhấn Play để bắt đầu nghe nhạc
                      </p>
                    )}
                    {!isPlaying && !audioError && (
                      <p className="text-xs text-blue-500 mt-1">
                        💡 Nhấn Play để bắt đầu nghe nhạc
                      </p>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button
                    onClick={prevTrack}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <SkipBack size={18} />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    disabled={audioError}
                    className={`p-3 rounded-full transition-all ${
                      audioError
                        ? "bg-gray-300/20 cursor-not-allowed"
                        : "bg-romantic-pink/20 hover:bg-romantic-pink/30"
                    }`}
                  >
                    {isPlaying ? (
                      <Pause size={20} />
                    ) : (
                      <Play size={20} className="ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <SkipForward size={18} />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={handleProgressDrag}
                    className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-romantic-pink rounded-full"
                      style={{
                        width: `${(currentTime / duration) * 100 || 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Additional Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsShuffled(!isShuffled)}
                      className={`p-1.5 rounded transition-colors ${
                        isShuffled
                          ? "text-romantic-pink bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <Shuffle size={16} />
                    </button>
                    <button
                      onClick={() => setIsLooped(!isLooped)}
                      className={`p-1.5 rounded transition-colors ${
                        isLooped
                          ? "text-romantic-pink bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                    >
                      <Repeat size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute}>
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-16 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
                          (isMuted ? 0 : volume) * 100
                        }%, rgba(255,255,255,0.2) ${
                          (isMuted ? 0 : volume) * 100
                        }%, rgba(255,255,255,0.2) 100%)`,
                      }}
                    />
                  </div>
                </div>

                {/* Song Change Hint */}
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-2 bg-romantic-pink/10 rounded-lg"
                  >
                    <p className="text-xs text-gray-600 text-center">
                      💡 Nhấn vào tên bài hát để chọn bài khác
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>

          {/* Audio element */}
          <audio ref={audioRef} preload="metadata" />
        </div>
      </motion.div>
    </>
  );
};

export default MusicPlayer;
