import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResidenceInfo } from '../types';

interface DiscoverSectionProps {
  residence?: ResidenceInfo;
}

const commonAreaImages = [
  { file: 'Hall.webp', label: "Hall d'entrée" },
  { file: 'Hall 180cm.webp', label: "Vue du hall" },
  { file: 'Hall 180cm (2).webp', label: "Hall et circulation" },
  { file: 'Hall boîte aux lettres.webp', label: 'Boîtes aux lettres' },
  { file: 'Hall escalier.webp', label: 'Escalier du hall' },
  { file: 'Vue ascenseur hall.webp', label: 'Ascenseur et hall' },
  { file: 'Piscine.webp', label: 'Piscine' },
  { file: 'vue du parking.webp', label: 'Vue du parking' }
];

export const DiscoverSection: React.FC<DiscoverSectionProps> = () => {
  const [activeCommonArea, setActiveCommonArea] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  useEffect(() => {
    if (isGalleryHovered) return;

    const rotation = window.setInterval(() => {
      setActiveCommonArea((current) => (current + 1) % commonAreaImages.length);
    }, 5000);

    return () => window.clearInterval(rotation);
  }, [isGalleryHovered]);

  const activeImage = commonAreaImages[activeCommonArea];

  return (
    <section id="decouvrir" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Galerie conservée : hall, piscine, circulations et parking. */}
        <div className="mt-16 border-t border-neutral-200/80 pt-12">
          <div className="max-w-3xl mb-8 space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-emerald-800">Espaces communs</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">Hall, piscine et parking</h3>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              Découvrez les espaces communs de la résidence à travers les vues du hall, des circulations, de la piscine et du parking.
            </p>
          </div>

          <div
            className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xl"
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_250px] gap-5 p-3 sm:p-4 items-stretch">
            <div className="relative min-h-[380px] sm:min-h-[520px] overflow-hidden rounded-xl bg-neutral-900">
              <img
                key={activeImage.file}
                src={`./images/Dossier Hall piscine et parking/${activeImage.file}`}
                alt={`${activeImage.label} de la Résidence NOEMA`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-1000"
              />
              <div className="absolute left-5 top-5 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300 sm:left-8 sm:top-8">Galerie NOEMA</div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8 sm:bottom-8">
                <div className="rounded-lg bg-black/40 px-3 py-2 text-white backdrop-blur-[2px]">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{String(activeCommonArea + 1).padStart(2, '0')} / {String(commonAreaImages.length).padStart(2, '0')}</span>
                  <h4 className="mt-0.5 text-xl sm:text-2xl font-serif font-bold">{activeImage.label}</h4>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCommonArea((activeCommonArea - 1 + commonAreaImages.length) % commonAreaImages.length)}
                    aria-label="Image précédente"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-900"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCommonArea((activeCommonArea + 1) % commonAreaImages.length)}
                    aria-label="Image suivante"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-neutral-900"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 lg:grid-cols-2 gap-2.5 content-start rounded-xl bg-neutral-50 p-2">
              {commonAreaImages.map((image, index) => (
                <button
                  key={image.file}
                  type="button"
                  onClick={() => setActiveCommonArea(index)}
                  aria-label={`Afficher ${image.label}`}
                  aria-pressed={activeCommonArea === index}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 bg-neutral-100 transition-all duration-300 ${activeCommonArea === index ? 'border-emerald-600 shadow-lg opacity-100' : 'border-transparent opacity-70 hover:border-neutral-300 hover:opacity-100'}`}
                >
                  <img
                    src={`./images/Dossier Hall piscine et parking/${image.file}`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-1 bottom-1 truncate bg-black/45 px-1.5 py-1 text-left text-[10px] font-semibold text-white drop-shadow-sm">{image.label}</span>
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>

      </div>
    </section>
  );
};
