import React from 'react';
import { HeartPulse, MapPin, Navigation, School, ShoppingBag } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const mapEmbedUrl = 'https://www.google.com/maps?q=5.399806,-3.943556&z=15&output=embed';
  const pointsOfInterest = [
    {
      category: 'Axes & Transports',
      icon: Navigation,
      items: [
        { name: 'Voie 8e et 9e tranche, Cocody', distance: 'au pied de la résidence' },
        { name: 'Boulevard Y4', distance: 'env. 4,4 km' },
      ]
    },
    {
      category: 'Commerces & Commodités',
      icon: ShoppingBag,
      items: [
        { name: 'Carrefour Market Kokoh Mall', distance: 'env. 1,4 km' },
        { name: 'Supermarché Sidy', distance: 'env. 1,5 km' },
      ]
    },
    {
      category: 'Écoles & Santé',
      icon: HeartPulse,
      items: [
        { name: 'École Étoile du Matin', distance: 'env. 0,8 km' },
        { name: 'Groupe Scolaire La Destinée Angré', distance: 'env. 1,7 km' },
        { name: 'Clinique Notre Dame de la Nativité', distance: 'env. 0,3 km' },
        { name: 'Clinique Médicale d’Angré', distance: 'env. 1,0 km' },
      ]
    }
  ];

  return (
    <section id="localisation" className="py-20 lg:py-28 bg-[#FAFAFA] border-t border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Abidjan • Cocody</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Au Cœur du Quartier Prisé d'Angré Djorogobité
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Située à Angré Djorogobité, la Résidence NOEMA offre une localisation stratégique dans l'un des pôles urbains les plus prisés de la commune de Cocody.
          </p>
        </div>

        {/* Map & POI Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md">
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Localisation exacte</p>
                <h3 className="mt-1 font-serif text-xl font-bold text-neutral-900">Résidence NOEMA, Angré Djorogobité</h3>
              </div>
              <span className="shrink-0 text-xs font-semibold text-emerald-800">Carte du quartier</span>
            </div>
            <iframe
              title="Carte de localisation de la Résidence NOEMA"
              src={mapEmbedUrl}
              className="h-[500px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex items-center gap-2 bg-neutral-50 px-5 py-3 text-xs text-neutral-600">
              <MapPin className="h-4 w-4 shrink-0 text-emerald-700" />
              <span>Coordonnées vérifiées : 5°23'59.3&quot;N, 3°56'36.8&quot;W</span>
            </div>
          </div>

          {/* Points of Interest Accordion/Grid */}
          <div className="lg:col-span-6 space-y-4">
            {pointsOfInterest.map((group, idx) => {
              const Icon = group.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">{group.category}</h4>
                  </div>

                  <div className="space-y-2 pt-1">
                    {group.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between gap-4 text-xs py-1.5 border-b border-neutral-50 last:border-0">
                        <span className="text-neutral-700 font-medium">{item.name}</span>
                        <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-0.5 font-mono font-bold text-emerald-700">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
