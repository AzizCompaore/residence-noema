import React, { useState } from 'react';
import { Play, Sparkles, X, ShieldCheck, Film } from 'lucide-react';

export const StoryVideoSection: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="histoire" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
            <Film className="w-3.5 h-3.5 text-neutral-600" />
            <span>Vision & Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            L'Histoire & la Genèse de NOEMA
          </h2>

          <p className="text-base text-neutral-600 font-normal leading-relaxed">
            Découvrez en vidéo la réflexion architecturale et le parti pris esthétique qui guident la conception de la Résidence NOEMA à Angré Djorogobité.
          </p>
        </div>

        {/* Cinematic Video Teaser Box */}
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden bg-neutral-900 aspect-16/9 shadow-2xl border border-neutral-200 group">
          <img
            src="/images/Dossier T3/Salon F3 modifié/Enscape_2026-06-26-03-04-29.webp"
            alt="Intérieur raffiné Résidence NOEMA"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover opacity-70 group-hover:scale-103 group-hover:opacity-60 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />

          {/* Central Play Trigger Button */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="w-20 h-20 rounded-full bg-white text-neutral-950 flex items-center justify-center pl-1 shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 group/play"
              aria-label="Visionner le film architectural"
            >
              <Play className="w-8 h-8 fill-neutral-950 text-neutral-950" />
            </button>
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-neutral-200">
              Visionner le film de présentation (2 min)
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-neutral-300">
            <span>Uriel Group • ImmoDiaspo</span>
            <span>Angré Djorogobité, Abidjan — Côte d'Ivoire</span>
          </div>
        </div>

        {/* Video Player Modal */}
        {isVideoModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <div 
              className="relative w-full max-w-4xl bg-neutral-950 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 text-white">
                <span className="text-sm font-serif font-bold">Résidence NOEMA — Film de présentation</span>
                <button 
                  onClick={() => setIsVideoModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 text-center space-y-6 text-white">
                <div className="aspect-16/9 bg-neutral-900 rounded-xl flex flex-col items-center justify-center p-6 space-y-4 border border-neutral-800">
                  <Film className="w-12 h-12 text-emerald-400" />
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold">Visite Virtuelle & Immersion Architecturale</h4>
                    <p className="text-xs text-neutral-400 max-w-md mx-auto">
                      La capsule vidéo haute définition est en cours de montage avec les dernières prises de vues aériennes par drone du chantier d'Angré Djorogobité.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full">
                    Diffusion officielle T4 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
