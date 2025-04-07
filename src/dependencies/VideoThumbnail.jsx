import { useEffect, useRef, useState } from "react";

export default function VideoThumbnail({ videoUrl }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(`thumb-${videoUrl}`);
    if (stored) {
      setThumbnail(stored);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    let timeoutId;

    const handleCapture = () => {
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/jpeg");
        setThumbnail(image);
        localStorage.setItem(`thumb-${videoUrl}`, image);
      } catch (err) {
        console.error("❌ Error al capturar miniatura:", err);
      }
    };

    const handleLoadedData = () => {
      video.currentTime = 1;
    };

    const handleSeeked = () => {
      handleCapture();
      clearTimeout(timeoutId);
    };

    const handleTimeout = () => {
      console.warn("⚠️ Miniatura cancelada por timeout para:", videoUrl);
      video.src = "";
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("seeked", handleSeeked);

    timeoutId = setTimeout(handleTimeout, 5000); // 5 segundos máx

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("seeked", handleSeeked);
      clearTimeout(timeoutId);
    };
  }, [videoUrl]);

  return (
    <div className="w-full h-48 bg-zinc-800 flex items-center justify-center overflow-hidden rounded-t-xl">
      {!thumbnail ? (
        <>
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            preload="metadata"
            className="hidden"
            crossOrigin="anonymous"
          />
          <canvas ref={canvasRef} className="hidden" />
          <p className="text-sm text-zinc-400">Cargando miniatura...</p>
        </>
      ) : (
        <img
          src={thumbnail}
          alt="Miniatura cargada"
          className="w-full h-48 object-cover"
        />
      )}
    </div>
  );
}
