"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import GoogleTranslate from "@/components/GoogleTranslate";

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

  const isScrolledState = isScrolled || isMobileMenuOpen || pathname !== "/";

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolledState 
          ? "bg-background py-6 text-foreground shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
          : "bg-transparent py-8 text-white"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-16 max-w-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col group">
          <span className={`text-2xl md:text-3xl font-serif tracking-tight transition-colors ${isScrolledState ? "text-foreground" : "text-white"}`}>
            Piazza<span className="italic ml-2">Marconi</span>
          </span>
          <span className={`text-[10px] md:text-xs font-sans tracking-[0.4em] uppercase font-bold transition-colors ${isScrolledState ? "text-primary" : "text-white/80 group-hover:text-white"}`}>
            Cafè
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              target={link.target}
              className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors hover:text-primary ${
                pathname === link.href ? "text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
          <GoogleTranslate />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-6 lg:hidden">
          <GoogleTranslate />
          <button 
            className={`p-2 transition-colors hover:text-primary ${isScrolledState ? "text-foreground" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-background overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center text-foreground ${
          isMobileMenuOpen ? "max-h-[500px] py-12 border-b border-border/10 shadow-2xl" : "max-h-0 py-0 border-transparent shadow-none"
        }`}
      >
        <div className="flex flex-col items-center gap-8 w-full px-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              target={link.target}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm uppercase tracking-[0.2em] font-semibold transition-colors hover:text-primary w-full text-center ${
                pathname === link.href ? "text-primary" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
