import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";

export function Header() {
  const location = useLocation();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`transition-colors ${
        location.pathname === to
          ? "text-[#9146FF]"
          : "text-white hover:text-[#9146FF]"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-md flex items-center justify-between px-10 py-6 border-b border-zinc-800">
      <nav className="flex items-center gap-10 text-lg font-bold uppercase tracking-wide">
        {navLink("/home", "Inicio")}
        {navLink("/novedades", "Novedades")}
      </nav>

      <div>
        <Link
          to="/profile"
          className={`transition-colors ${
            location.pathname === "/profile"
              ? "text-[#9146FF]"
              : "text-white hover:text-[#9146FF]"
          }`}
        >
          <User size={34} />
        </Link>
      </div>
    </header>
  );
}

export default Header;