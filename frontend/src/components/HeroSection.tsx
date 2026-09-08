import React, { useEffect, useState } from 'react';
import { 
  ArrowDown, 
  Calculator, 
  Building, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ResidenceInfo } from '../types';

interface HeroSectionProps {
  residence?: ResidenceInfo;
  onOpenSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  residence,
  onOpenSimulator
}) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollOffset(Math.min(window.scrollY * 0.12, 72));
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
    setHeroTilt({ x: relativeY * -3, y: relativeX * 3 });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-[92vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center bg-[#FAFAFA] overflow-hidden border-b border-neutral-200/70"
    >
      {/* Subtle architectural background grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Real Estate Program Verified Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-xs text-xs font-semibold text-neutral-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-neutral-500 font-medium">Programme Résidentiel Neuf</span>
              <span className="text-neutral-300">•</span>
              <span className="text-emerald-700 font-bold">Angré Djorogobité, Abidjan</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-neutral-900 leading-[1.08]">
                RÉSIDENCE <span className="text-neutral-900 block">NOEMA</span>
              </h1>
              <p className="text-sm sm:text-base font-semibold tracking-wider text-emerald-800 uppercase">
                Angré Djorogobité • Abidjan, Côte d'Ivoire
              </p>
            </div>

            {/* Short strong value statement */}
            <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl">
              Une signature architecturale R+7 contemporaine au design épuré. 
              Conçue pour un confort de vie d'exception et un investissement patrimonial pérenne au cœur d'Abidjan.
            </p>

            {/* Two Primary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <a
                id="hero-cta-apartments"
                href="#appartements"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-neutral-900 text-white text-sm font-bold tracking-wide hover:bg-neutral-800 hover:shadow-lg transition-all duration-200 active:scale-98 group"
              >
                <span>DÉCOUVRIR LES APPARTEMENTS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                id="hero-cta-simulator"
                onClick={onOpenSimulator}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white text-neutral-900 border border-neutral-300 text-sm font-bold tracking-wide hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-md transition-all duration-200 active:scale-98"
              >
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>ÉTUDIER MON FINANCEMENT</span>
              </button>
            </div>

            {/* Verified Trust Badges */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-neutral-600 font-medium">Bâtiment</span>
                <span className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-neutral-600" />
                  R+7 Standing
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-neutral-600 font-medium">Typologies</span>
                <span className="text-sm font-bold text-neutral-900">
                  T2 & T3
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-neutral-600 font-medium">Livraison Prévisionnelle</span>
                <span className="text-sm font-bold text-neutral-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                  {residence?.delivery_date_estimated || '30 mois'}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-neutral-600 font-medium">Accompagnement</span>
                <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  ImmoDiaspo
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Architectural Hero Image with Frame & Parallax Effect */}
          <div className="lg:col-span-5 relative" onPointerMove={handleHeroPointerMove} onPointerLeave={() => setHeroTilt({ x: 0, y: 0 })}>
            <div className="hero-orbit pointer-events-none absolute -right-8 -top-8 hidden h-28 w-28 rounded-full border border-emerald-400/40 border-dashed lg:block" />
            <div className="relative mx-auto max-w-md lg:max-w-none group">
              
              {/* Outer Glow & Architectural White Framing */}
              <div className="relative rounded-2xl bg-white p-3 sm:p-4 shadow-xl border border-neutral-200/90 transition-all duration-500 group-hover:shadow-2xl" style={{ transform: `perspective(1200px) rotateX(${heroTilt.x}deg) rotateY(${heroTilt.y}deg) translateY(${scrollOffset * 0.35}px)`, transformStyle: 'preserve-3d' }}>
                
                {/* Image Container with precise aspect ratio matching real building */}
                <div className="relative rounded-xl overflow-hidden bg-neutral-100 aspect-3/4 max-h-[580px]">
                  <img
                    id="hero-facade-image"
                    src="/images/noema%20façade.png"
                    alt="Façade de la Résidence NOEMA à Angré Djorogobité, Abidjan"
                    referrerPolicy="no-referrer"
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="w-full h-full object-cover object-center transform group-hover:scale-103 transition-transform duration-700 ease-out"
                    style={{ transform: `translate3d(0, ${scrollOffset}px, 0) scale(1.04)` }}
                  />
                  
                  {/* Subtle Top & Bottom Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Top Architectural Label */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-bold text-neutral-900 border border-white/60 shadow-xs">
                    Rendu Architectural Conforme
                  </div>

                  {/* Bottom Image Caption */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-emerald-300">Façade Principale</p>
                        <p className="text-sm font-bold">Angré Djorogobité, Abidjan</p>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-sm">
                        R+7
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hero-float absolute -bottom-4 -left-4 hidden rounded-xl border border-emerald-200 bg-white px-3 py-2 shadow-lg sm:block">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-emerald-700">Signature NOEMA</span>
                  <span className="mt-0.5 block text-xs font-semibold text-neutral-800">Vivre autrement</span>
                </div>

                {/* Floating Micro-Card 2: Diaspora Safety */}
                <div className="hidden sm:flex absolute -top-4 -right-4 bg-white rounded-xl px-3.5 py-2.5 shadow-lg border border-neutral-200/90 items-center gap-2 text-xs font-semibold text-neutral-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Achat à distance 100% sécurisé</span>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Bottom anchor scroll hint */}
        <div className="hidden lg:flex justify-center pt-10">
          <a
            href="#decouvrir"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <span>Découvrir le programme</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>

      </div>
    </section>
  );
};
