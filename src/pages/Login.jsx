import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setError("");
    setForm({ username: "", email: "", password: "" });
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin
      ? "http://3.219.191.147:8080/api/users/login"
      : "http://3.219.191.147:8080/api/users/register";

    try {
      if (!isLogin && form.password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }

      const payload = {
        email: form.email,
        password: form.password,
        ...(isLogin ? {} : { username: form.username }),
      };

      const response = await axios.post(endpoint, payload);

      if (isLogin) {
        const loginTime = new Date().toISOString();
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("lastLogin", loginTime);
        navigate("/home");
      } else {
        setIsLogin(true);
        setForm({ username: "", email: "", password: "" });
        setError("Cuenta creada. Ahora inicia sesión.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] text-white flex items-center justify-center px-6">
      <div className="bg-zinc-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#9146FF]">
          {isLogin ? "Inicia Sesión" : "Crea una Cuenta"}
        </h2>

        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full bg-zinc-800 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-zinc-800 rounded px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-zinc-400 hover:text-[#9146FF]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-[#9146FF] hover:bg-[#a566ff] transition-all py-2 rounded font-semibold"
          >
            {isLogin ? "Entrar" : "Registrarse"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-zinc-400">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                onClick={toggleForm}
                className="text-[#9146FF] hover:underline"
              >
                Regístrate aquí
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={toggleForm}
                className="text-[#9146FF] hover:underline"
              >
                Inicia sesión
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
