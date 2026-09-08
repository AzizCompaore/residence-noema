import React, { useState } from 'react';
import { 
  Building2, 
  Calculator, 
  Maximize2, 
  Eye, 
  Bed, 
  Bath, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Apartment, ApartmentType } from '../types';
import { formatFCFA, formatEUR } from '../services/api';

interface ApartmentsSectionProps {
  apartments: Apartment[];
  onSelectApartment: (apartment: Apartment) => void;
  onSelectForSimulation: (apartment: Apartment) => void;
}

export const ApartmentsSection: React.FC<ApartmentsSectionProps> = ({
  apartments,
  onSelectApartment,
  onSelectForSimulation
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ApartmentType>('all');

  const filteredApartments = apartments.filter(apt => {
    if (selectedFilter === 'all') return true;
    return apt.type === selectedFilter;
  });

  const statusConfig: Record<string, { label: string; bg: string; text: string; border: string }> = {
    available: { label: 'Disponible', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300' },
    option: { label: 'Sous Option', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
    reserved: { label: 'Réservé', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300' },
    sold: { label: 'Vendu', bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-300' }
  };

  return (
    <section id="appartements" className="py-20 lg:py-28 bg-[#FAFAFA] border-y border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>Typologies & Grille Tarifaire</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              Les Appartements de la Résidence NOEMA
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 font-normal">
              Découvrez les lots T2 et T3 commercialisés en VEFA, avec surfaces exactes, compositions détaillées et grille de prix selon l'avancement du chantier.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              Tous les lots ({apartments.length})
            </button>

            <button
              onClick={() => setSelectedFilter('t2')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 't2'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              T2
            </button>

            <button
              onClick={() => setSelectedFilter('t3')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 't3'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              T3
            </button>
          </div>
        </div>

        {/* Apartments Cards Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          {filteredApartments.map((apartment) => {
            const status = statusConfig[apartment.status] || statusConfig.available;
            const heroPhoto = apartment.photos?.[0] || './images/Dossier T2/Rendus F2/Salon 1.webp';

            return (
              <div
                key={apartment.id}
                id={`apartment-card-${apartment.id}`}
                className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Photo & Status Badge */}
                <div className="relative aspect-16/10 overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => onSelectApartment(apartment)}>
                  <img
                    src={heroPhoto}
                    alt={apartment.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                  {/* Lot Reference Tag */}
                  <div className="absolute top-3.5 left-3.5 bg-neutral-900/90 backdrop-blur-xs text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-xs">
                    {apartment.ref}
                  </div>

                  {/* Status Badge */}
                  <div className={`absolute top-3.5 right-3.5 text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${status.bg} ${status.text} ${status.border}`}>
                    {status.label}
                  </div>

                  {/* Floor Level info */}
                  <div className="absolute bottom-3 left-3.5 text-white">
                    <p className="text-xs font-medium opacity-90">{apartment.floor}</p>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-3">
                    <h3 
                      className="text-lg font-serif font-bold text-neutral-900 group-hover:text-emerald-800 transition-colors cursor-pointer"
                      onClick={() => onSelectApartment(apartment)}
                    >
                      {apartment.name}
                    </h3>

                    {/* Key Specs Pills */}
                    <div className="flex items-center gap-4 text-xs text-neutral-600 pt-1 pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="font-bold text-neutral-900 font-mono text-sm">{apartment.surface_sqm} m²</span>
                        <span>habitable</span>
                      </div>

                      <span className="text-neutral-300">•</span>

                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="font-bold text-emerald-700 font-mono text-sm">+{apartment.balcony_surface_sqm} m²</span>
                        <span>{apartment.balcony_surface_sqm > 0 ? 'balcon' : 'sans balcon'}</span>
                      </div>

                      <span className="text-neutral-300">•</span>

                      <div className="flex items-center gap-1 font-medium">
                        <span className="font-bold text-neutral-900">{apartment.bedrooms_count}</span>
                        <span>ch.</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {apartment.description}
                    </p>
                  </div>

                  {/* Price Section & Actions */}
                  <div className="space-y-4 pt-2 border-t border-neutral-100">
                    
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-neutral-400 font-medium block">Prix indicatif</span>
                        <span className="text-xl font-bold font-mono text-neutral-900">
                          {formatFCFA(apartment.price_fcfa)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-emerald-800">
                        ≈ {formatEUR(apartment.price_fcfa)}
                      </span>
                    </div>

                    {(apartment.price_launch_fcfa || apartment.price_structure_fcfa || apartment.price_closed_fcfa) && (
                      <div className="grid grid-cols-3 gap-1.5 text-[10px] text-neutral-500">
                        {[
                          ['Lancement', apartment.price_launch_fcfa],
                          ['Gros œuvre', apartment.price_structure_fcfa],
                          ["Hors d'eau-air", apartment.price_closed_fcfa]
                        ].map(([label, price]) => price ? <div key={String(label)} className="rounded-lg bg-neutral-50 px-2 py-2 text-center"><span className="block font-semibold text-neutral-400">{label}</span><span className="mt-1 block font-bold text-neutral-800">{formatFCFA(Number(price)).replace(' FCFA', '')}</span></div> : null)}
                      </div>
                    )}

                    {/* Two Required Mandatory CTAs */}
                    <div className="grid grid-cols-1 gap-2.5">
                      
                      {/* 1. See this apartment */}
                      <button
                        onClick={() => onSelectApartment(apartment)}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all active:scale-98"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Voir cet appartement & plans</span>
                      </button>

                      {/* 2. Can I finance this apartment? (Strategic funnel bridge) */}
                      <button
                        onClick={() => onSelectForSimulation(apartment)}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-98"
                      >
                        <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Puis-je financer cet appartement ?</span>
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
