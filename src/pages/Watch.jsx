// ...importaciones
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  FastForward,
  Rewind,
  RotateCcw,
} from "lucide-react";

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);
  const [volumeDisplay, setVolumeDisplay] = useState(null);
  const [showReturn, setShowReturn] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoAspect, setVideoAspect] = useState("landscape");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef();

  const videoUrl = `http://3.219.191.147:8080/api/videos/${id}`;

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {}); // Evita AbortError
      setPaused(false);
      setVideoEnded(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  const toggleMute = () => {
    const muted = videoRef.current.muted;
    videoRef.current.muted = !muted;
    setVolume(muted ? videoRef.current.volume : 0);
    showVolumeDisplay(videoRef.current.muted ? 0 : videoRef.current.volume);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.parentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleKeyboard = (e) => {
    const vid = videoRef.current;
    if (!vid) return;
    switch (e.key.toLowerCase()) {
      case " ":
        e.preventDefault();
        togglePlay();
        break;
      case "arrowright":
        vid.currentTime += 5;
        break;
      case "arrowleft":
        vid.currentTime -= 5;
        break;
      case "arrowup":
        e.preventDefault();
        const volUp = Math.min(vid.volume + 0.1, 1);
        vid.volume = volUp;
        setVolume(volUp);
        vid.muted = false;
        showVolumeDisplay(volUp);
        break;
      case "arrowdown":
        e.preventDefault();
        const volDown = Math.max(vid.volume - 0.1, 0);
        vid.volume = volDown;
        setVolume(volDown);
        vid.muted = volDown === 0;
        showVolumeDisplay(volDown);
        break;
      case "f":
        toggleFullscreen();
        break;
      case "escape":
        navigate("/novedades");
        break;
      default:
        break;
    }
  };

  const handleMouseMove = (e) => {
    setShowControls(true);
    clearTimeout(window._controlsTimeout);
    window._controlsTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    setShowReturn(e.clientY < 100 && e.clientX < 200);
  };

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    videoRef.current.currentTime = videoRef.current.duration * percent;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const showVolumeDisplay = (value) => {
    const percent = Math.round(value * 100);
    setVolumeDisplay(`Volumen: ${percent}%`);
    clearTimeout(window._volumeTimeout);
    window._volumeTimeout = setTimeout(() => {
      setVolumeDisplay(null);
    }, 1000);
  };

  const handleLoadedMetadata = () => {
    const vid = videoRef.current;
    setVideoAspect(vid.videoHeight > vid.videoWidth ? "portrait" : "landscape");
    setDuration(vid.duration);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const updateBuffered = () => {
      if (!video || !video.duration) return;

      const buffered = video.buffered;
      if (buffered.length) {
        const end = buffered.end(buffered.length - 1);
        const bufferWithOffset = Math.min(end + 10, video.duration); // +10 segundos
        setBufferedEnd((bufferWithOffset / video.duration) * 100);
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener("progress", updateBuffered);
    video.addEventListener("timeupdate", updateBuffered);
    return () => {
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("timeupdate", updateBuffered);
    };
  }, []);

  return (
    <div
      className="bg-black text-white w-screen h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {videoAspect === "portrait" && (
        <div
          className="absolute w-full h-full object-cover blur-2xl scale-110 brightness-50"
          style={{
            backgroundImage: `url(${videoUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: 0,
          }}
        />
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        preload="metadata"
        autoPlay
        controls={false}
        className={`absolute top-1/2 left-1/2 z-10 transform -translate-x-1/2 -translate-y-1/2 ${
          videoAspect === "portrait" ? "h-full w-auto" : "w-full h-full"
        }`}
        onClick={togglePlay}
        onCanPlay={() => {
          videoRef.current.play().catch(() => {});
          setIsBuffering(false);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setVideoEnded(false);
        }}
        onEnded={() => setVideoEnded(true)}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => console.error("Error al reproducir el video.")}
      />

      {/* Spinner de carga */}
      {isBuffering && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-24 h-24 border-6 border-[#9146FF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Botón de repetir */}
      {videoEnded && (
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <button
            onClick={() => {
              videoRef.current.currentTime = 0;
              videoRef.current.play().catch(() => {});
              setVideoEnded(false);
            }}
            className="bg-[#9146FF] hover:bg-[#6e34c9] text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all animate-fade-in"
          >
            <RotateCcw className="inline-block mr-2" /> Repetir video
          </button>
        </div>
      )}

      {/* Toast volumen */}
      {volumeDisplay && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-2 rounded text-lg text-white z-30">
          {volumeDisplay}
        </div>
      )}

      {/* Botón regresar */}
      <div
        onClick={() => navigate("/novedades")}
        className={`absolute top-5 left-5 px-5 py-3 text-xl text-white rounded cursor-pointer z-40 flex items-center gap-2
        bg-black/20 hover:text-[#9146FF] transition-all duration-300 ease-in-out
        ${showReturn ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5 pointer-events-none"}`}
      >
        <ChevronLeft size={20} /> Regresar al Inicio
      </div>

      {/* 🎯 Controles personalizados */}
      <div
        className={`absolute bottom-0 left-0 right-0 px-12 py-8 
        bg-gradient-to-t from-[#212121] to-transparent text-white 
        transition-all duration-500 ease-in-out z-10 
        ${showControls ? "opacity-80 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
      >
        <div className="w-full h-4 relative rounded mb-2 cursor-pointer" onClick={handleSeek}>
          <div className="absolute h-full bg-zinc-700 rounded left-0 top-0 w-full z-0" />
          <div className="absolute h-full bg-blue-600/50 rounded left-0 top-0 z-10" style={{ width: `${bufferedEnd}%` }} />
          <div className="absolute h-full bg-[#a14fff] rounded left-0 top-0 z-20" style={{ width: `${progress}%` }} />
          <div className="absolute bottom-full left-0 mb-2 text-2xl text-zinc-300 z-30">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 text-lg mb-4">
          <div className="flex items-center justify-center gap-8">
            <button onClick={() => (videoRef.current.currentTime -= 5)}>
              <Rewind size={32} />
            </button>
            <button onClick={togglePlay}>
              {paused ? <Play size={38} /> : <Pause size={38} />}
            </button>
            <button onClick={() => (videoRef.current.currentTime += 5)}>
              <FastForward size={32} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-10 flex items-center gap-3 z-20">
          <button onClick={toggleMute}>
            {volume === 0 ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const vol = parseFloat(e.target.value);
              videoRef.current.volume = vol;
              setVolume(vol);
              videoRef.current.muted = vol === 0;
              showVolumeDisplay(vol);
            }}
            className="w-32 h-2 cursor-pointer rounded-lg appearance-none transition-all duration-200"
            style={{
              background: `linear-gradient(to right, #9146FF 0%, #9146FF ${volume * 100}%, #4B4B4B ${volume * 100}%, #4B4B4B 100%)`,
            }}
          />
        </div>

        <div className="absolute bottom-8 right-10">
          <button onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize size={38} /> : <Maximize size={38} />}
          </button>
        </div>
      </div>
    </div>
  );
}
