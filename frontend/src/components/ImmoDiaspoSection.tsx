import React from 'react';
import { Globe, ShieldCheck, FileCheck, Landmark, Users, ArrowRight, Calculator, MapPinned, Search, Home, Compass, PlaneTakeoff, KeyRound, Settings2 } from 'lucide-react';

interface ImmoDiaspoSectionProps {
  onOpenSimulator: () => void;
}

export const ImmoDiaspoSection: React.FC<ImmoDiaspoSectionProps> = ({ onOpenSimulator }) => {
  const remoteJourneySteps = [
    { icon: Compass, title: 'Je définis mon projet' },
    { icon: Calculator, title: 'J\u2019étudie ma capacité de financement' },
    { icon: Search, title: 'Je choisis mon appartement' },
    { icon: Users, title: 'Je suis accompagné dans mon acquisition' },
    { icon: MapPinned, title: 'Je suis l\u2019évolution de mon projet à distance' },
    { icon: KeyRound, title: 'Je prends possession de mon appartement' },
    { icon: Settings2, title: 'Je peux confier sa gestion lorsque je suis à l\u2019étranger' }
  ];

  return (
    <section id="financement-diaspora" className="py-20 lg:py-28 bg-[#FAFAFA] border-t border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Diaspora & International</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
              Et si votre projet à Abidjan était finançable depuis l'étranger ?
            </h2>

            <p className="text-base text-neutral-600 leading-relaxed">
              Vous n'avez pas besoin de disposer de 100 % du prix de votre appartement pour commencer votre projet. <strong>URIEL GROUP</strong> accompagne la diaspora dans l'étude et la structuration de son financement immobilier, en fonction de son profil.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Passerelles Bancaires Partenaires</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    Accompagnement dans le montage de dossiers de crédit immobilier auprès d'institutions bancaires de la place.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Signature Notariée Sécurisée</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    Possibilité de signature électronique ou procuration légalisée auprès des représentations consulaires.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-neutral-200/80 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Interlocuteur Dédié & Suivi Visuel</h4>
                  <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    Un conseiller unique vous informe chaque mois de l'avancement effectif de la construction.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenSimulator}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs shadow-md transition-all active:scale-98"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>SIMULER MON FINANCEMENT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-md space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Programme d'Accompagnement</span>
                <h3 className="text-xl font-serif font-bold text-neutral-900 mt-1">
                  Les 4 Étapes de l'Acquisition Sécurisée
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">Choix de l'Appartement & Simulation</span>
                    <span className="text-neutral-500">Sélection du lot (T2 ou T3) et validation de la capacité d'apport.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">Contrat de Réservation Préliminaire (VEFA)</span>
                    <span className="text-neutral-500">Blocage du bien sélectionné et fixation définitive du prix au mètre carré.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">Appels de Fonds Échelonnés Notariés</span>
                    <span className="text-neutral-500">Paiements versés sur compte séquestre notarié au rythme de la progression réelle du chantier.</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-mono shrink-0">
                    4
                  </span>
                  <div>
                    <span className="font-bold text-neutral-900 block text-sm">Remise des Clés & Titre Foncier</span>
                    <span className="text-neutral-500">Visite de conformité, remise des clés et transfert officiel de propriété devant notaire.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Tous les versements sont garantis par acte notarié officiel en Côte d'Ivoire.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Devenir propriétaire à Abidjan depuis l'étranger — parcours client en 7 étapes (brief diaspora) */}
        <div className="mt-16 pt-16 border-t border-neutral-200/80">
          <div className="max-w-2xl mb-10">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 leading-tight">
              Devenir propriétaire à Abidjan depuis l'étranger
            </h3>
            <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
              La distance n'est plus un obstacle à l'investissement immobilier en Côte d'Ivoire.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {remoteJourneySteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="bg-white rounded-xl p-4 border border-neutral-200/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold font-mono text-xs shrink-0">
                      {index + 1}
                    </span>
                    <Icon className="w-4 h-4 text-emerald-700" />
                  </div>
                  <span className="text-xs font-bold text-neutral-900 leading-snug">
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
