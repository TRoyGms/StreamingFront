import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Watch from "./pages/Watch";
import Novedades from "./pages/Novedades";
import PrivateRoute from "./routes/PrivateRoute";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/novedades" element={<Novedades />} />
          <Route path="/profile" element={<Profile/>} />
        </Route>

        {/* Agrega más rutas protegidas aquí si es necesario */}
      </Routes>
    </Router>
  );
}
