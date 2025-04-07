import { useEffect, useRef, useState } from "react";

export default function VideoThumbnail({ videoUrl }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const captureThumbnail = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/jpeg");
      setThumbnail(image);
    };

    const video = videoRef.current;

    // Escoge un segundo aleatorio entre 1 y 5
    const randomTime = Math.floor(Math.random() * 5) + 1;
    video.currentTime = randomTime;

    video.addEventListener("seeked", captureThumbnail);
    return () => video.removeEventListener("seeked", captureThumbnail);
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
