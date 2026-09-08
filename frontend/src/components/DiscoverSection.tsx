import React, { useEffect, useState } from 'react';
import { 
  Building, 
  MapPin, 
  ShieldCheck, 
  Leaf, 
  Sun, 
  Lock, 
  Car, 
  Sparkles,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
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

export const DiscoverSection: React.FC<DiscoverSectionProps> = ({ residence }) => {
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
      
      {/* Decorative architectural accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
            <Building className="w-3.5 h-3.5 text-neutral-600" />
            <span>Présentation du Programme</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Une architecture blanche épurée au cœur d'Angré Djorogobité.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            La Résidence NOEMA a été pensée pour répondre aux plus hautes exigences de confort urbain à Abidjan : 
            volumes généreux baignés de lumière, balcons arborés créant un microclimat naturel, matériaux durables et sécurité intégrale.
          </p>
        </div>

        {/* Asymmetric Content Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Editorial Feature Card */}
          <div className="lg:col-span-7 bg-[#FAFAFA] rounded-2xl p-6 sm:p-10 border border-neutral-200/80 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-800">
                  Concept Architectural
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  Angré Djorogobité
                </span>
              </div>

              <h3 className="text-2xl font-serif font-bold text-neutral-900">
                La Biophilie Urbaine : Fraîcheur & Élégance Contemporaine
              </h3>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Les façades blanches épurées de NOEMA incarnent un design contemporain minimaliste et fonctionnel. 
                Cette conception bioclimatique atténue le rayonnement solaire, favorise une ventilation naturelle traversante et confère à la résidence une identité visuelle immédiatement reconnaissable.
              </p>

              {/* Verified Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-700 font-medium">Structure R+7 en béton armé certifié</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-700 font-medium">Grandes baies vitrées aluminium</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-700 font-medium">Parkings sécurisés en rez-de-chaussée</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-700 font-medium">Ascenseur sécurisé avec contrôle d'accès</span>
                </div>
              </div>
            </div>

            {/* Bottom Status bar */}
            <div className="pt-6 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-500" />
                <span className="text-xs font-semibold text-neutral-800">Livraison prévisionnelle : {residence?.delivery_date_estimated || '30 mois'}</span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Chantier en cours actif
              </span>
            </div>

          </div>

          {/* Right Column: Key Architectural Highlights & Image */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Hall Preview Image */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100">
              <div className="relative h-64 overflow-hidden sm:h-72 group">
                <img
                  src="/images/Dossier Hall piscine et parking/Hall 180cm.webp"
                  alt="Hall d'entrée de la Résidence NOEMA"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="bg-white px-5 py-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Hall d'entrée</span>
                <p className="mt-1 text-sm font-bold text-neutral-900">Un accueil élégant et contemporain</p>
              </div>
            </div>

            {/* 3 Pillars Compact Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              
              <div className="bg-[#FAFAFA] rounded-xl p-5 border border-neutral-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Sécurité & Sérénité 24/7</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Gardiennage permanent, vidéosurveillance des accès et clôture périphérique sécurisée.
                </p>
              </div>

              <div className="bg-[#FAFAFA] rounded-xl p-5 border border-neutral-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 shadow-2xs">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900">Emplacement Stratégique</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Angré Djorogobité, à proximité immédiate des commerces, écoles et axes majeurs.
                </p>
              </div>

              <div className="relative min-h-52 overflow-hidden rounded-xl border border-neutral-200/80 sm:col-span-2 group">
                <img
                  src="/images/Dossier Hall piscine et parking/Piscine.webp"
                  alt="Piscine intérieure de la Résidence NOEMA"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-5 bottom-5 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200">Espace Bien-Être</span>
                  <h4 className="mt-1 text-lg font-serif font-bold">Piscine Intérieure</h4>
                  <p className="mt-1 text-xs leading-relaxed text-white/85">
                    Un espace piscine privatif conçu pour la détente et le bien-être des résidents.
                  </p>
                </div>
              </div>

            </div>

          </div>

          </div>

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
                src={`/images/Dossier Hall piscine et parking/${activeImage.file}`}
                alt={`${activeImage.label} de la Résidence NOEMA`}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover animate-in fade-in duration-1000"
              />
              <div className="absolute left-5 top-5 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300 sm:left-8 sm:top-8">Galerie NOEMA</div>
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-8 sm:bottom-8">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">{String(activeCommonArea + 1).padStart(2, '0')} / {String(commonAreaImages.length).padStart(2, '0')}</span>
                  <h4 className="mt-2 text-2xl sm:text-3xl font-serif font-bold">{activeImage.label}</h4>
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
                    src={`/images/Dossier Hall piscine et parking/${image.file}`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-1 bottom-1 truncate px-1.5 py-1 text-left text-[10px] font-semibold text-white">{image.label}</span>
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
