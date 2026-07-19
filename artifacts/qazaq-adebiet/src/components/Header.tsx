import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Menu, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/poets',       label: 'Ақындар' },
  { href: '/writers',     label: 'Жазушылар' },
  { href: '/zhyrau',      label: 'Жыраулар' },
  { href: '/reader',      label: 'Кітапхана' },
  { href: '/analysis/abai-qara-sozder', label: 'Талдау' },
  { href: '/interactive', label: 'Ойындар' },
  { href: '/bi-sheshender', label: 'Би-шешендер' },
];

export default function Header() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0618]/80 backdrop-blur-md border-b border-white/10 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 z-50">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <span className="font-serif font-bold text-white text-xl">QA</span>
              </div>
              <span className="font-serif font-semibold text-xl tracking-wide hidden sm:block">
                QazaqAdebiet
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? 'text-primary' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 z-50">
              {/* Cabinet button */}
              <Link href="/cabinet"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  bg-violet-500/15 border border-violet-500/30 text-violet-300
                  hover:bg-violet-500/25 transition-all text-sm font-medium">
                <GraduationCap size={14} />
                Кабинет
              </Link>

              {/* Teacher button */}
              <Link href="/mugalim"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  bg-emerald-500/15 border border-emerald-500/30 text-emerald-300
                  hover:bg-emerald-500/25 transition-all text-sm font-medium">
                <GraduationCap size={14} />
                Мұғалім
              </Link>

              <div className="relative flex items-center">
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 200, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden absolute right-10"
                    >
                      <input
                        type="text"
                        placeholder="Іздеу..."
                        className="w-full bg-white/10 border border-white/20 rounded-full py-1.5 px-4 text-sm text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary backdrop-blur-md"
                        autoFocus
                        onBlur={() => setIsSearchOpen(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-foreground/80 hover:text-primary transition-colors rounded-full hover:bg-white/5"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-[#0a0618]/95 backdrop-blur-xl flex flex-col pt-24 px-6 pb-6 lg:hidden"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-xl font-medium transition-colors ${
                    location === link.href ? 'text-accent' : 'text-white/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <div className="glass-panel p-4 rounded-xl">
                <p className="text-sm text-white/50 text-center">
                  Қазақ Әдебиеті Порталы © 2025
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
