import React from 'react';
import { ShieldCheck, Headphones, KeyRound, LayoutDashboard, Briefcase, Waves, Dumbbell, Sun, Trees } from 'lucide-react';

const amenities = [
  { icon: ShieldCheck, label: 'Sécurité 24h/24' },
  { icon: Headphones, label: 'Conciergerie diaspora 24h/24' },
  { icon: KeyRound, label: 'Gestion locative à distance' },
  { icon: LayoutDashboard, label: 'Espace propriétaire digital' },
  { icon: Briefcase, label: 'Business Lounge & Coworking' },
  { icon: Waves, label: 'Piscine' },
  { icon: Dumbbell, label: 'Salle de sport' },
  { icon: Sun, label: 'Rooftop' },
  { icon: Trees, label: 'Espaces verts et de détente' }
];

export const ExperienceSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-[#FAFAFA] border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-3xl mb-14 space-y-5">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Votre adresse à Abidjan. Votre patrimoine. Votre liberté.
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            NOEMA a été pensée pour les personnes qui vivent entre l'Afrique et l'étranger : profiter pleinement de son appartement lorsqu'on est à Abidjan, et rester connecté à son patrimoine lorsqu'on est ailleurs.
          </p>
          <p className="text-base sm:text-lg font-bold text-neutral-900 leading-relaxed">
            Vivez-y quand vous êtes à Abidjan. Faites vivre votre patrimoine lorsque vous êtes ailleurs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {amenities.map((amenity) => {
            const Icon = amenity.icon;
            return (
              <div
                key={amenity.label}
                className="flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-5 border border-neutral-200/80 hover:shadow-md hover:border-neutral-300 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-[#FAFAFA] border border-neutral-200 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs font-bold text-neutral-800 leading-snug">
                  {amenity.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
