import React, { useState, useRef, useEffect, useCallback } from "react";

const ManageMusic = () => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio());
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [songs, setSongs] = useState([]);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prevIsShuffle) => {
      const newShuffleState = !prevIsShuffle;
      if (newShuffleState) {
        setShuffledSongs(shuffleArray(songs));
      } else {
        setShuffledSongs([]);
      }
      return newShuffleState;
    });
  }, [songs, shuffleArray]);

  const toggleRepeat = useCallback(() => {
    setIsRepeat((prevIsRepeat) => !prevIsRepeat);
  }, []);

  const handleLikeChange = useCallback((songId, newLiked) => {
    setSongs((prevSongs) =>
      prevSongs.map((song) =>
        song.SongID === songId ? { ...song, liked: newLiked } : song
      )
    );

    setShuffledSongs((prevShuffledSongs) =>
      prevShuffledSongs.map((song) =>
        song.SongID === songId ? { ...song, liked: newLiked } : song
      )
    );
  }, []);

  const handleSongSelect = useCallback((song) => {
    setCurrentSong(song);
    audioRef.current.src = song.AudioFile;
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => console.error("Ошибка воспроизведения:", error));
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((error) => console.error("Ошибка воспроизведения:", error));
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleSongPlay = useCallback(
    (song) => {
      if (currentSong && currentSong.SongID === song.SongID) {
        togglePlay();
      } else {
        handleSongSelect(song);
      }
    },
    [currentSong, handleSongSelect, togglePlay]
  );

  const handleSeek = (newTime) => {
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const playNextSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;

    const songListToUse = isShuffle ? shuffledSongs : songs;

    let currentIndex = songListToUse.findIndex(
      (song) => song.SongID === currentSong.SongID
    );
    if (currentIndex === -1) {
      currentIndex = 0;
    }

    let nextIndex = (currentIndex + 1) % songListToUse.length;
    handleSongSelect(songListToUse[nextIndex]);
  }, [currentSong, songs, shuffledSongs, isShuffle, handleSongSelect]);

  const playPreviousSong = useCallback(() => {
    if (!currentSong || songs.length === 0) return;

    const songListToUse = isShuffle ? shuffledSongs : songs;

    let currentIndex = songListToUse.findIndex(
      (song) => song.SongID === currentSong.SongID
    );

    if (currentIndex === -1) {
      currentIndex = 0;
    }
    let previousIndex =
      (currentIndex - 1 + songListToUse.length) % songListToUse.length;
    handleSongSelect(songListToUse[previousIndex]);
  }, [currentSong, songs, shuffledSongs, isShuffle, handleSongSelect]);
  useEffect(() => {
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    if (currentSong) {
      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);

      return () => {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [currentSong]);
  useEffect(() => {
    const handleEnded = () => {
      if (isRepeat) {
        audioRef.current
          .play()
          .catch((error) => console.error("Ошибка воспроизведения:", error));
      } else {
        playNextSong();
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [playNextSong, isRepeat]);
  return {
    currentSong,
    isPlaying,
    togglePlay,
    audioRef,
    handleSeek,
    currentTime,
    duration,
    handleLikeChange,
    playNextSong,
    playPreviousSong,
    songs,
    handleSongSelect,
    isShuffle,
    toggleShuffle,
    isRepeat,
    toggleRepeat,
    setSongs,
    toggleSongPlay,
  };
};
export default ManageMusic;
