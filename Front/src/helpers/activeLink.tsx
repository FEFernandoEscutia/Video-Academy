// src/helpers/activeLink.tsx
"use client";

import { usePathname } from "next/navigation"; // Importa usePathname
import Link from "next/link";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
}

const ActiveLink = ({ href, children }: ActiveLinkProps) => {
  const pathname = usePathname(); // Obtén la ruta actual
  const isActive = pathname === href; // Comprueba si el enlace es activo

  return (
    <li className={`py-1 px-2 rounded ${isActive ? "isActive" : ""}`}>
      <Link href={href} className={isActive ? "text-black" : "text-gray-400"}>
        {children}
      </Link>
    </li>
  );
};

export default ActiveLink;
