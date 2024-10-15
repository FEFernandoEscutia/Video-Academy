
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
return (

    <footer className="bg-[var(--background)] text-[var(--principal-text)] py-8 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo y Redes Sociales */}
        <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-bold text-[var(--primary)]">ConsoLearn</h1>
            <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-[var(--principal-text)] hover:text-[var(--primary)]">
                <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-[var(--principal-text)] hover:text-[var(--primary)]">
                <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-[var(--principal-text)] hover:text-[var(--primary)]">
                <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-[var(--principal-text)] hover:text-[var(--primary)]">
                <FaLinkedinIn />
            </a>
            </div>
        </div>

        {/* Cursos */}
        <div>
            <h2 className="font-semibold text-lg text-[var(--primary)] mb-2">Cursos</h2>
            <ul className="space-y-1">
            <li><a href="/cursos/ui-design" className="hover:text-[var(--primary)]">UI Design</a></li>
            <li><a href="/cursos/ux-design" className="hover:text-[var(--primary)]">UX Design</a></li>
            <li><a href="/cursos/wireframing" className="hover:text-[var(--primary)]">Wireframing</a></li>
            <li><a href="/cursos/diagramming" className="hover:text-[var(--primary)]">Diagramming</a></li>
            </ul>
        </div>

        {/* Carreras */}
        <div>
            <h2 className="font-semibold text-lg text-[var(--primary)] mb-2">Carreras</h2>
            <ul className="space-y-1">
            <li><a href="/carreras/design" className="hover:text-[var(--primary)]">Design</a></li>
            <li><a href="/carreras/prototyping" className="hover:text-[var(--primary)]">Prototyping</a></li>
            <li><a href="/carreras/dev-features" className="hover:text-[var(--primary)]">Development Features</a></li>
            <li><a href="/carreras/design-systems" className="hover:text-[var(--primary)]">Design Systems</a></li>
            </ul>
        </div>

        {/* Recursos */}
        <div>
            <h2 className="font-semibold text-lg text-[var(--primary)] mb-2">Recursos</h2>
            <ul className="space-y-1">
            <li><a href="/blog" className="hover:text-[var(--primary)]">Blog</a></li>
            <li><a href="/best-practices" className="hover:text-[var(--primary)]">Best Practices</a></li>
            <li><a href="/colors" className="hover:text-[var(--primary)]">Colors</a></li>
            <li><a href="/support" className="hover:text-[var(--primary)]">Support</a></li>
            </ul>
        </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 text-center text-sm">
        &copy; {new Date().getFullYear()} ConsoLearn. Todos los derechos reservados.
        </div>
</footer>
);
};

export default Footer;
