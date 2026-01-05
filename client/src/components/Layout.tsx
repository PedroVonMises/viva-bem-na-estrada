import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Viva Bem na Estrada", href: "/viva-bem" },
    { name: "Sobre Nós", href: "/sobre" },
    { name: "Ebooks", href: "/ebooks" },
    { name: "Redes Sociais", href: "/social" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-body">
      {/* Navbar */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled ? "bg-background/95 backdrop-blur-md border-border/40 py-2 shadow-lg" : "bg-transparent py-4"
        )}
      >
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <img 
              src="/logo.png" 
              alt="Viva Bem na Estrada" 
              className="h-10 md:h-12 w-auto group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary relative py-1",
                  location === link.href
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary"
                    : "text-slate-300"
                )}
              >
                {link.name}
              </Link>
            ))}
            <Button 
            onClick={() => {
              if (window.location.pathname === '/') {
                document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#newsletter';
              }
            }}
            className="bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)]">
              Inscreva-se
            </Button>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/98 pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-2xl font-sans font-bold",
                    location === link.href ? "text-primary" : "text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Button className="w-full mt-4 bg-primary text-white py-6 text-lg">
                Inscreva-se Agora
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="mb-4">
                <img 
                  src="/logo.png" 
                  alt="Viva Bem na Estrada" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Informação, segurança e entretenimento para quem vive na estrada. 
                O ponto de encontro do motorista profissional.
              </p>
            </div>

            <div>
              <h4 className="font-sans font-bold text-white mb-4">Navegação</h4>
              <ul className="space-y-2">
                {navLinks.slice(0, 3).map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-slate-400 hover:text-primary text-sm transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-bold text-white mb-4">Recursos</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/ebooks" className="text-slate-400 hover:text-primary text-sm transition-colors">
                    Ebooks Gratuitos
                  </Link>
                </li>
                <li>
                  <Link href="/viva-bem" className="text-slate-400 hover:text-primary text-sm transition-colors">
                    Últimos Episódios
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400 hover:text-primary text-sm transition-colors cursor-pointer">
                    Política de Privacidade
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-sans font-bold text-white mb-4">Siga-nos</h4>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/vivabemnaestrada" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-primary hover:text-white text-slate-400 transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://www.facebook.com/profile.php?id=61580852677265" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-primary hover:text-white text-slate-400 transition-all">
                  <Facebook size={20} />
                </a>
                <a href="https://www.youtube.com/@vivabemnaestrada" target="_blank" rel="noopener noreferrer" className="bg-slate-900 p-3 rounded-full hover:bg-primary hover:text-white text-slate-400 transition-all">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Viva Bem na Estrada. Todos os direitos reservados.
            </p>
            <p className="text-slate-600 text-xs">
              Desenvolvido com tecnologia Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
