import React from 'react';
import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#05030d] pt-16 pb-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-primary to-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                <span className="font-serif font-bold text-white text-lg">QA</span>
              </div>
              <span className="font-serif font-semibold text-lg tracking-wide">
                QazaqAdebiet
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Қазақ әдебиетінің мол мұрасын зерттейтін цифрлық білім беру платформасы. Оқы, үйрен, дамы.
            </p>
          </div>

          {/* Санаттар */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Санаттар</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/aqyndar" className="hover:text-primary transition-colors">Ақындар</Link></li>
              <li><Link href="/zhazushylar" className="hover:text-primary transition-colors">Жазушылар</Link></li>
              <li><Link href="/zhyraudar" className="hover:text-primary transition-colors">Жыраулар</Link></li>
              <li><Link href="/kitapkhana" className="hover:text-primary transition-colors">Кітапхана</Link></li>
            </ul>
          </div>

          {/* Ресурстар & Ойындар */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Ресурстар</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/taldau" className="hover:text-primary transition-colors">Әдеби талдау</Link></li>
              <li><Link href="/oyyndar" className="hover:text-primary transition-colors">Интерактивті ойындар</Link></li>
              <li><Link href="/olimpiada" className="hover:text-primary transition-colors">Олимпиада</Link></li>
            </ul>
          </div>

          {/* Байланыс */}
          <div>
            <h4 className="font-serif text-lg text-white mb-4">Байланыс</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li>info@qazaqadebiet.kz</li>
              <li>+7 (700) 123-45-67</li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/70 hover:text-primary hover:border-primary/50 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/40">
            © 2025 «Қазақ әдебиеті» · Цифрлық білім беру платформасы. Барлық құқықтар қорғалған.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link href="/" className="hover:text-white transition-colors">Құпиялық саясаты</Link>
            <Link href="/" className="hover:text-white transition-colors">Қолдану шарттары</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
