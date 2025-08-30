import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  ChevronUp,
  ChevronDown,
  List
} from 'lucide-react';
import { useMetadata } from '../contexts/MetadataContext';

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
  const [isShuffled, setIsShuffled] = useState(metadata?.music?.shuffle || false);
  const [isLooped, setIsLooped] = useState(metadata?.music?.loop || false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const playlist = metadata?.music?.playlist || [];
  const currentTrack = playlist[currentTrackIndex];

  // Format time helper
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play/Pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Next track
  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
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
  }, [playlist.length, currentTime]);

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle progress bar drag
  const handleProgressDrag = (e) => {
    if (!isDragging || !audioRef.current || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
      } else {
        audioRef.current.volume = 0;
      }
      setIsMuted(!isMuted);
    }
  };

  // Update audio element when track changes
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    audioRef.current.src = currentTrack.src;
    audioRef.current.volume = isMuted ? 0 : volume;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex, currentTrack]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isLooped && playlist.length === 1) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooped, nextTrack, playlist.length]);

  // Auto-play on mount if enabled
  useEffect(() => {
    if (metadata?.music?.autoplay && audioRef.current && playlist.length > 0) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Autoplay prevented:', err);
      });
    }
  }, []);

  if (playlist.length === 0) return null;

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Floating player */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
          isExpanded ? 'h-64' : 'h-20'
        }`}
      >
        <div className="absolute inset-0 liquid-glass border-t border-white/20">
          {/* Mini player */}
          <div className="h-20 px-4 flex items-center gap-4">
            {/* Track info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-romantic-pink/30 to-romantic-lavender/30 flex items-center justify-center">
                <Music size={20} className="text-romantic-pink" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {currentTrack?.title || 'Unknown Track'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {currentTrack?.artist || 'Unknown Artist'}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevTrack}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipBack size={18} />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="p-3 bg-romantic-pink/20 hover:bg-romantic-pink/30 rounded-full transition-all"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              
              <button
                onClick={nextTrack}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Expand button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors md:hidden"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
            </button>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-4">
              {/* Progress bar */}
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-xs text-gray-600 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  className="relative w-32 h-1 bg-gray-300/50 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  onMouseMove={handleProgressDrag}
                >
                  <div
                    className="absolute left-0 top-0 h-full bg-romantic-pink rounded-full"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-romantic-pink rounded-full shadow-lg"
                    style={{ left: `${(currentTime / duration) * 100 || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-10">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="p-1">
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 accent-romantic-pink"
                />
              </div>

              {/* Extra controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsShuffled(!isShuffled)}
                  className={`p-1.5 rounded transition-colors ${
                    isShuffled ? 'text-romantic-pink bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <Shuffle size={14} />
                </button>
                <button
                  onClick={() => setIsLooped(!isLooped)}
                  className={`p-1.5 rounded transition-colors ${
                    isLooped ? 'text-romantic-pink bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <Repeat size={14} />
                </button>
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded view (mobile) */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 pb-4 space-y-4 md:hidden"
              >
                {/* Progress bar */}
                <div className="space-y-1">
                  <div
                    ref={progressRef}
                    className="relative h-1 bg-gray-300/50 rounded-full cursor-pointer"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="absolute left-0 top-0 h-full bg-romantic-pink rounded-full"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Extra controls */}
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => setIsShuffled(!isShuffled)}
                    className={`p-2 rounded-full transition-colors ${
                      isShuffled ? 'text-romantic-pink bg-white/20' : ''
                    }`}
                  >
                    <Shuffle size={20} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={toggleMute}>
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-24 accent-romantic-pink"
                    />
                  </div>
                  
                  <button
                    onClick={() => setIsLooped(!isLooped)}
                    className={`p-2 rounded-full transition-colors ${
                      isLooped ? 'text-romantic-pink bg-white/20' : ''
                    }`}
                  >
                    <Repeat size={20} />
                  </button>
                </div>

                {/* Queue button */}
                <button
                  onClick={() => setShowQueue(!showQueue)}
                  className="w-full py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                >
                  View Queue ({playlist.length} tracks)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Queue modal */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 w-80 max-h-96 liquid-glass rounded-xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-medium">Queue</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {playlist.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setShowQueue(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left ${
                    index === currentTrackIndex ? 'bg-romantic-pink/10' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-romantic-pink/30 to-romantic-lavender/30 flex items-center justify-center flex-shrink-0">
                    {index === currentTrackIndex && isPlaying ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <Music size={14} />
                      </motion.div>
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{track.title}</p>
                    <p className="text-xs text-gray-600 truncate">{track.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500">{track.duration}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicPlayer;