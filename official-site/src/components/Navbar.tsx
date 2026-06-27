"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuUrl, setMenuUrl] = useState("https://piazza-marconi-cafe-menu.vercel.app");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("-mannellimau-langs-projects.vercel.app") || host.includes("localhost") || host.includes("127.0.0.1")) {
        setMenuUrl("https://piazza-marconi-cafe-menu-prlrmdf2s-mannellimau-langs-projects.vercel.app");
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: menuUrl, target: "_blank" },
    { name: "Intolleranze", href: "/intolleranze" },
    { name: "Catering", href: "/catering" },
    { name: "Gusto & Relax", href: "/lounge-aperitivo" },
    { name: "Lavora Con Noi", href: "/lavora-con-noi" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen || pathname !== "/" ? "bg-black border-b border-white/10 shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center group">
          <span className="text-xl md:text-2xl font-serif text-white tracking-[0.2em] uppercase">Piazza Marconi</span>
          <span className="text-xs md:text-sm font-sans text-white/70 tracking-[0.4em] uppercase font-bold group-hover:text-accent transition-colors">Cafè</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              target={link.target}
              className={`text-sm uppercase tracking-widest font-semibold transition-colors ${
                pathname === link.href ? "text-accent" : "text-white/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-black border-b border-white/10 shadow-2xl py-6 flex flex-col items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              target={link.target}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-widest font-semibold transition-colors ${
                pathname === link.href ? "text-accent" : "text-white/80 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
