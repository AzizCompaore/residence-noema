import React, { useEffect, useState } from 'react';
import { 
  X, 
  Calculator, 
  MessageCircle, 
  Maximize2, 
  Bed, 
  Bath, 
  Layers, 
  Check, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Car
} from 'lucide-react';
import { Apartment } from '../types';
import { formatFCFA, formatEUR } from '../services/api';
import { buildWhatsAppURL } from '../utils/utm';

interface ApartmentDetailModalProps {
  apartment: Apartment | null;
  onClose: () => void;
  onSelectForSimulation: (apartment: Apartment) => void;
  whatsappNumber?: string;
}

export const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({
  apartment,
  onClose,
  onSelectForSimulation,
  whatsappNumber = '+2250789001122'
}) => {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const isSmallPhone = typeof window !== 'undefined' && window.innerWidth < 640;

  const leftDoorTransform = isDoorOpen
    ? isSmallPhone
      ? 'perspective(1600px) rotateY(-82deg) scaleY(0.84)'
      : 'perspective(1600px) rotateY(-108deg)'
    : 'perspective(1600px) rotateY(0deg)';

  const rightDoorTransform = isDoorOpen
    ? isSmallPhone
      ? 'perspective(1600px) rotateY(82deg) scaleY(0.84)'
      : 'perspective(1600px) rotateY(108deg)'
    : 'perspective(1600px) rotateY(0deg)';

  useEffect(() => {
    if (!apartment) {
      setIsDoorOpen(false);
      return;
    }

    setActivePhotoIndex(0);
    setIsDoorOpen(false);
    const openingTimer = window.setTimeout(() => setIsDoorOpen(true), 650);

    return () => window.clearTimeout(openingTimer);
  }, [apartment?.id]);

  if (!apartment) return null;

  const fallbackPhotos = apartment.type === 't3'
    ? [
        './images/Dossier T3/Rendus F3\'/Salon 1 F3\'.webp',
        './images/Dossier T3/Rendus F3\'/Salon 2 F3\'.webp',
        './images/Dossier T3/Rendus F3\'/Cuisine 1.webp',
        './images/Dossier T3/Rendus F3\'/Chambre Master 1 F3\'.webp'
      ]
    : [
        './images/Dossier T2/Rendus F2/Salon 1.webp',
        './images/Dossier T2/Rendus F2/Salon 2.webp',
        './images/Dossier T2/Rendus F2/Cuisine 1.webp',
        './images/Dossier T2/Rendus F2/Chambre 1.webp'
      ];
  const photos = apartment.photos && apartment.photos.length > 0 ? apartment.photos : fallbackPhotos;
  const fallbackFeatures = apartment.type === 't3'
    ? ['Séjour + coin repas', 'Balcon de 4,56 m²', 'Cuisine et buanderie', '2 chambres avec salle d’eau']
    : ['Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau', 'Aucun balcon'];
  const features = apartment.key_features && apartment.key_features.length > 0
    ? apartment.key_features
    : fallbackFeatures;

  const statusLabels: Record<string, { label: string; bg: string; text: string; border: string }> = {
    available: { label: 'Disponible', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
    option: { label: 'Sous Option', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    reserved: { label: 'Réservé', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
    sold: { label: 'Vendu', bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300' }
  };

  const statusInfo = statusLabels[apartment.status] || statusLabels.available;

  const whatsappMessage = `Bonjour, je suis très intéressé(e) par l'appartement ${apartment.name} (Réf: ${apartment.ref}) à la Résidence NOEMA au prix de ${formatFCFA(apartment.price_fcfa)}. Pouvez-vous me transmettre la fiche technique et les modalités de réservation ?`;
  const whatsappUrl = buildWhatsAppURL(whatsappNumber, whatsappMessage);

  return (
    <div 
      id="apartment-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`absolute inset-0 z-50 flex overflow-hidden pointer-events-none transition-opacity duration-200 ${
            isDoorOpen ? 'opacity-0 delay-900' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <div
            className="relative w-1/2 h-full border-r border-amber-300/80 bg-[linear-gradient(125deg,#ffffff_0%,#f3eee5_52%,#ded6c9_100%)] shadow-[inset_-16px_0_26px_rgba(91,75,55,0.28)] transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transformOrigin: 'left center',
              transform: leftDoorTransform,
            }}
          >
            <div className="absolute inset-3 border border-amber-300/90 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.7)]" />
            <div className="absolute inset-5 border border-stone-300/70" />
            <div className="absolute inset-x-8 top-8 bottom-1/2 border border-stone-300/80 bg-white/35 shadow-[inset_0_0_20px_rgba(148,129,103,0.15)]" />
            <div className="absolute inset-x-8 top-1/2 bottom-8 border border-stone-300/80 bg-white/35 shadow-[inset_0_0_20px_rgba(148,129,103,0.15)]" />
            <div className="absolute right-5 top-1/2 h-16 w-3 -translate-y-1/2 rounded-full border border-amber-500/70 bg-[linear-gradient(90deg,#9d6c24,#f8df9a,#bd8d40)] shadow-[0_2px_8px_rgba(120,83,29,0.4)]" />
          </div>
          <div
            className="relative w-1/2 h-full border-l border-amber-300/80 bg-[linear-gradient(235deg,#ffffff_0%,#f3eee5_52%,#ded6c9_100%)] shadow-[inset_16px_0_26px_rgba(91,75,55,0.28)] transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transformOrigin: 'right center',
              transform: rightDoorTransform,
            }}
          >
            <div className="absolute inset-3 border border-amber-300/90 shadow-[inset_0_0_0_3px_rgba(255,255,255,0.7)]" />
            <div className="absolute inset-5 border border-stone-300/70" />
            <div className="absolute inset-x-8 top-8 bottom-1/2 border border-stone-300/80 bg-white/35 shadow-[inset_0_0_20px_rgba(148,129,103,0.15)]" />
            <div className="absolute inset-x-8 top-1/2 bottom-8 border border-stone-300/80 bg-white/35 shadow-[inset_0_0_20px_rgba(148,129,103,0.15)]" />
            <div className="absolute left-5 top-1/2 h-16 w-3 -translate-y-1/2 rounded-full border border-amber-500/70 bg-[linear-gradient(90deg,#bd8d40,#f8df9a,#9d6c24)] shadow-[0_2px_8px_rgba(120,83,29,0.4)]" />
          </div>
        </div>

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-[#FAFAFA]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono px-2.5 py-1 bg-neutral-900 text-white rounded-md">
              {apartment.ref}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
              {statusInfo.label}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Photo Gallery Carousel */}
            <div className="relative rounded-xl overflow-hidden bg-neutral-950 aspect-16/10 lg:col-span-3 lg:aspect-auto lg:min-h-[390px]">
            <img
              src={photos[activePhotoIndex]}
              alt={`${apartment.name} - Vue ${activePhotoIndex + 1}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Carousel navigation controls if multiple photos */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  aria-label="Photo précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
                  aria-label="Photo suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Thumbnails indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-3 py-1.5 rounded-full">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activePhotoIndex === idx ? 'w-5 bg-white' : 'bg-white/50'
                      }`}
                      aria-label={`Aller à la photo ${idx + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            </div>

            <div className="lg:col-span-2 flex flex-col justify-between rounded-xl border border-neutral-200 bg-[#FAFAFA] p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Résidence NOEMA</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-bold leading-tight text-neutral-900">
                  {apartment.name}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  {apartment.floor} • Angré Djorogobité, Abidjan
                </p>

                <div className="mt-6 border-y border-neutral-200 py-5">
                  <span className="text-xs text-neutral-500 block font-medium">Prix indicatif</span>
                  <span className="mt-1 text-2xl sm:text-3xl font-extrabold text-neutral-900 block font-mono">
                    {formatFCFA(apartment.price_fcfa)}
                  </span>
                  <span className="mt-1 text-xs text-emerald-700 font-semibold block">
                    Soit environ {formatEUR(apartment.price_fcfa)}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-neutral-200 bg-neutral-200">
                <div className="bg-white p-3.5">
                  <span className="text-[11px] text-neutral-500 block">Surface</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-neutral-900">{apartment.surface_sqm} m²</span>
                </div>
                <div className="bg-white p-3.5">
                  <span className="text-[11px] text-neutral-500 block">Balcon</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-emerald-800">{apartment.balcony_surface_sqm > 0 ? `+${apartment.balcony_surface_sqm} m²` : 'Aucun'}</span>
                </div>
                <div className="bg-white p-3.5">
                  <span className="text-[11px] text-neutral-500 block">Chambres</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-neutral-900">{apartment.bedrooms_count}</span>
                </div>
                <div className="bg-white p-3.5">
                  <span className="text-[11px] text-neutral-500 block">Salles d'eau</span>
                  <span className="mt-1 block text-lg font-bold font-mono text-neutral-900">{apartment.bathrooms_count}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="border-t border-neutral-200 pt-7 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Description du bien</h4>
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {apartment.description}
            </p>
          </div>

          {apartment.composition && apartment.composition.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Composition du lot</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {apartment.composition.map((room, index) => <div key={index} className="rounded-lg border border-neutral-100 bg-neutral-50/70 px-3 py-2.5 text-sm text-neutral-700">{room}</div>)}
              </div>
            </div>
          )}

          {/* Key Features List */}
          {features.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900">Prestations & Équipements inclus</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-neutral-700 bg-neutral-50/70 p-2.5 rounded-lg border border-neutral-100">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-[#FAFAFA] border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-600 text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 font-semibold text-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600" />
            <span>Contacter un conseiller WhatsApp</span>
          </a>

          <button
            onClick={() => {
              onClose();
              onSelectForSimulation(apartment);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs shadow-md transition-all active:scale-98"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>PUIS-JE FINANCER CET APPARTEMENT ?</span>
          </button>
        </div>
      </div>
    </div>
  );
};
