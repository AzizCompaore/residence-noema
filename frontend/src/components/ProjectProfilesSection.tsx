import React from 'react';
import { Home, TrendingUp, Landmark, Building2, Users, Calculator, ArrowRight, Compass } from 'lucide-react';

interface ProjectProfilesSectionProps {
  onSelectProfile: (profile: string) => void;
  onOpenSimulator: () => void;
}

const profiles = [
  {
    icon: Home,
    title: 'JE PRÉPARE MON RETOUR À ABIDJAN',
    description: 'Je souhaite préparer mon retour, ma retraite ou disposer de mon propre logement lors de mes séjours.',
    purpose: 'Je prépare mon retour à Abidjan'
  },
  {
    icon: TrendingUp,
    title: 'JE CONSTRUIS MON PATRIMOINE EN AFRIQUE',
    description: 'Je souhaite transformer une partie de mes revenus gagnés à l\u2019étranger en patrimoine immobilier en Côte d\u2019Ivoire.',
    purpose: 'Je construis mon patrimoine en Afrique'
  },
  {
    icon: Landmark,
    title: 'J\u2019INVESTIS POUR GÉNÉRER DES REVENUS',
    description: 'Je souhaite acquérir un bien locatif et générer un complément de revenus.',
    purpose: 'J\u2019investis pour générer des revenus'
  },
  {
    icon: Building2,
    title: 'JE VEUX MON PIED-À-TERRE À ABIDJAN ET LE RENTABILISER',
    description: 'Je profite de mon appartement lorsque je suis en Côte d\u2019Ivoire et il peut être géré lorsque je suis à l\u2019étranger.',
    purpose: 'Je veux mon pied-à-terre à Abidjan et le rentabiliser'
  },
  {
    icon: Users,
    title: 'JE CONSTITUE UN PATRIMOINE POUR MA FAMILLE',
    description: 'Je souhaite préparer et transmettre un patrimoine à mes enfants ou à ma famille.',
    purpose: 'Je constitue un patrimoine pour ma famille'
  }
];

export const ProjectProfilesSection: React.FC<ProjectProfilesSectionProps> = ({ onSelectProfile, onOpenSimulator }) => {
  return (
    <section id="votre-projet" className="py-20 lg:py-28 bg-white border-t border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="max-w-3xl mb-14 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-neutral-700" />
            <span>Votre parcours personnalisé</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Quel est votre projet ?
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Choisissez le parcours qui correspond à votre situation : nous vous orientons directement vers le bien et l'accompagnement adaptés.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {profiles.map((profile) => {
            const Icon = profile.icon;
            return (
              <button
                key={profile.purpose}
                type="button"
                onClick={() => onSelectProfile(profile.purpose)}
                className="group text-left flex flex-col h-full bg-[#FAFAFA] rounded-2xl p-6 border border-neutral-200/80 hover:border-neutral-900 hover:shadow-lg transition-all space-y-4"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shadow-2xs group-hover:bg-neutral-900 transition-colors">
                  <Icon className="w-5 h-5 text-emerald-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 leading-snug tracking-wide">
                  {profile.title}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed flex-1">
                  {profile.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors pt-1">
                  <span>Étudier ce parcours</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Financing hook banner - financing is transversal to all 5 profiles */}
        <div className="mt-12 rounded-2xl bg-neutral-900 px-6 py-8 sm:px-10 sm:py-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Vous avez le projet mais pas la totalité du financement ?
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
              Il est désormais possible d'étudier votre financement pour investir à Abidjan depuis votre pays de résidence.
            </p>
          </div>
          <button
            onClick={onOpenSimulator}
            className="shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-neutral-900 text-xs font-bold tracking-wide hover:bg-neutral-100 transition-all active:scale-98"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>ÉTUDIER MON FINANCEMENT</span>
          </button>
        </div>

      </div>
    </section>
  );
};
