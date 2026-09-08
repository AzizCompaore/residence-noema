import React from 'react';
import { TrendingUp, ShieldCheck, MapPin, Building, Award, CheckCircle2 } from 'lucide-react';

export const WhyInvestSection: React.FC = () => {
  const reasons = [
    {
      icon: MapPin,
      title: 'Emplacement Privilégié à Angré Djorogobité',
      subtitle: 'Cocody, Abidjan',
      description: 'L\'un des secteurs résidentiels les plus recherchés et dynamiques d\'Abidjan. Forte tension locative, proximité immédiate des commerces, établissements scolaires réputés et du Boulevard Latrille.'
    },
    {
      icon: Building,
      title: 'Excellence Constructive R+7',
      subtitle: 'Architecture Contemporaine & Haut de Gamme',
      description: 'Un immeuble contemporain offrant des appartements spacieux, ventilés naturellement et équipés de matériaux pérennes (baies vitrées aluminium, isolation phonique, ascenseur sécurisé).'
    },
    {
      icon: ShieldCheck,
      title: 'Sécurité Juridique & Financière',
      subtitle: 'VEFA Standard & Titre Foncier',
      description: 'Contrat notarié encadré, permis de construire en règle et fonds séquestrés. Les appels de fonds sont strictement indexés sur l\'avancement vérifié des travaux.'
    },
    {
      icon: Award,
      title: 'Accompagnement Spécialisé Diaspora',
      subtitle: 'Gestion 100% à Distance',
      description: 'Avec le support d\'ImmoDiaspo, les acquéreurs résidant à l\'étranger bénéficient d\'un suivi digitalisé, de conseils bancaires personnalisés et d\'une assistance notariale de bout en bout.'
    }
  ];

  return (
    <section id="pourquoi-investir" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5 text-neutral-700" />
            <span>Valeur Patrimoniale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Pourquoi choisir la Résidence NOEMA ?
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Un investissement immobilier à Abidjan doit s'appuyer sur des fondamentaux solides : 
            un emplacement de premier choix, une qualité de construction éprouvée et une transparence juridique absolue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((r, idx) => {
            const Icon = r.icon;
            return (
              <div 
                key={idx}
                className="bg-[#FAFAFA] rounded-2xl p-8 border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-2xs">
                  <Icon className="w-6 h-6 text-emerald-700" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">{r.subtitle}</span>
                  <h3 className="text-xl font-serif font-bold text-neutral-900">{r.title}</h3>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed">
                  {r.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
