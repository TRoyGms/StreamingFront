import { Link } from "react-router-dom";
import Header from "../dependencies/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#212121] text-white">
      {/* Navbar grande */}
      <Header />

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto pt-36 px-6 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#9146FF] mb-6">
          Bienvenido a ÑextFlics
        </h1>
        <p className="text-zinc-300 text-xl max-w-4xl mx-auto mb-12 leading-relaxed">
          Aquí encontrarás diferentes tipos de contenido multimedia como{" "}videos{" "}
          <span className="text-[#9146FF] font-semibold">musicales</span> y{" "}
          <span className="text-[#9146FF] font-semibold">divertidos</span>. <br />
          Disfruta de tu estancia aquí y{" "}
          <span className="text-[#9146FF] font-semibold">gracias por confiar en nosotros!</span>.
        </p>

        {/* Botones destacados */}
        <div className="flex flex-wrap justify-center gap-5">
          <Link to="/novedades">
            <button className="bg-[#9146FF] hover:bg-[#a566ff] text-white font-bold text-lg px-7 py-4 rounded-lg shadow-xl transition-all">
              🔥 Ver Novedades
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
