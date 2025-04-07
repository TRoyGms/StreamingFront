import { useNavigate } from "react-router-dom";
import { LogOut, Home } from "lucide-react";
import { useEffect, useState } from "react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [lastLogin, setLastLogin] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedLogin = localStorage.getItem("lastLogin");

    if (storedUser) {
      setUser(storedUser);
      if (storedLogin) {
        setLastLogin(new Date(storedLogin).toLocaleString());
      }
    } else {
      navigate("/login");
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastLogin");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white flex items-center justify-center px-6 relative">
      {/* Botón regresar */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg flex items-center gap-3 text-lg font-semibold transition"
      >
        <Home size={22} /> Inicio
      </button>

      {/* Botón cerrar sesión */}
      <button
        onClick={logout}
        className="absolute top-6 right-6 bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg flex items-center gap-3 text-lg font-semibold transition"
      >
        <LogOut size={22} /> Cerrar sesión
      </button>

      {/* Tarjeta de perfil */}
      <div className="bg-[#1c1c1c] p-12 rounded-2xl shadow-2xl w-full max-w-3xl text-center border border-zinc-800">
        <h1 className="text-5xl font-extrabold text-[#9146FF] mb-8">
          Perfil del Usuario
        </h1>

        <div className="text-left space-y-6 text-2xl leading-relaxed px-4">
          <p>
            <span className="font-semibold text-zinc-400">Nombre de usuario:</span>{" "}
            <span className="text-white">{user.username}</span>
          </p>
          <p>
            <span className="font-semibold text-zinc-400">Correo electrónico:</span>{" "}
            <span className="text-white">{user.email}</span>
          </p>
          <p>
            <span className="font-semibold text-zinc-400">Último inicio de sesión:</span>{" "}
            <span className="text-white">{lastLogin}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
