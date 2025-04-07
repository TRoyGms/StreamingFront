import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../dependencies/Header";
import VideoThumbnail from "../dependencies/VideoThumbnail"; // Ajusta la ruta si está en otra carpeta

export default function Novedades() {
  const [videos, setVideos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [durationFilter, setDurationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("http://3.219.191.147:8080/api/videos/")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data);
        setFiltered(data);
      });
  }, []);

  useEffect(() => {
    let temp = [...videos];

    if (durationFilter !== "all") {
      temp = temp.filter((v) => {
        const dur = v.Duration || 0;
        if (durationFilter === "less2") return dur < 120;
        if (durationFilter === "between2and5") return dur >= 120 && dur <= 300;
        if (durationFilter === "more5") return dur > 300;
        return true;
      });
    }

    if (typeFilter !== "all") {
      temp = temp.filter((v) => v.Type?.toLowerCase() === typeFilter);
    }

    setFiltered(temp);
  }, [durationFilter, typeFilter, videos]);

  return (
    <div className="min-h-screen bg-[#212121] text-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 pt-36 pb-12">
        <h1 className="text-4xl font-bold text-[#9146FF] mb-6 text-center">📺 Novedades</h1>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-zinc-300">Duración:</label>
            <select
              value={durationFilter}
              onChange={(e) => setDurationFilter(e.target.value)}
              className="bg-zinc-800 text-white px-4 py-2 rounded focus:outline-none"
            >
              <option value="all">Todas</option>
              <option value="less2">Menos de 2 mins</option>
              <option value="between2and5">2 a 5 mins</option>
              <option value="more5">Más de 5 mins</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm text-zinc-300">Tipo:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-zinc-800 text-white px-4 py-2 rounded focus:outline-none"
            >
              <option value="all">Todos</option>
              <option value="meme">🎭 Meme</option>
              <option value="musical">🎵 Musical</option>
              <option value="tkt">📘 Informativo / TKT</option>
            </select>
          </div>
        </div>

        {/* Lista de videos */}
        {filtered.length === 0 ? (
          <p className="text-zinc-400 text-center">No hay videos que coincidan con los filtros.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((video) => (
              <Link key={video.ID} to={`/watch/${video.ID}`} className="group">
                <div className="bg-zinc-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-700 hover:scale-105 transition-all">
                  <VideoThumbnail videoUrl={`http://3.219.191.147:8080/${video.FilePath}`} />
                  <div className="p-4">
                    <h2 className="text-lg font-bold text-white mb-1 group-hover:text-[#9146FF] transition-colors">
                      {video.Title}
                    </h2>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {video.Description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
