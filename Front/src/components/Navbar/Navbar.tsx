// components/Navbar.tsx
import ActiveLink from "@/helpers/activeLink";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-[var(--background)] text-[var(--principal-text)] h-20 flex justify-between items-center px-4">
      {/* logo */}
      <div>
      <Link href="/">
          <h1 className="text-3xl font-bold text-[var(--primary)]">
            ConsoLearn
          </h1>
        </Link>
      </div>

      {/* menu */}
      <div className="flex space-x-4 justify-center items-center">
        <ul className="flex space-x-4">
          <ActiveLink href="/">Inicio</ActiveLink>
          <ActiveLink href="/cursos">Cursos</ActiveLink>
          <ActiveLink href="/comunidad">Comunidad</ActiveLink>
          <ActiveLink href="/nosotros">Nosotros</ActiveLink>
          <ActiveLink href="/pricing">Pricing</ActiveLink>
          <ActiveLink href="/contacto">Contacto</ActiveLink>
        </ul>

        {/* Botones */}
        <div className="flex space-x-3">
          <button className="secondary-btn py-1 px-2">Iniciar sesión</button>
          <button className="primary-btn py-1 px-2">Registrarse</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
