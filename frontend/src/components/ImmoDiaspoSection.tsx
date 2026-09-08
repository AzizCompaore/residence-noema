import React from 'react';
import { Globe, ShieldCheck, FileCheck, Landmark, Users, ArrowRight, Calculator } from 'lucide-react';

interface ImmoDiaspoSectionProps {
  onOpenSimulator: () => void;
}

export const ImmoDiaspoSection: React.FC<ImmoDiaspoSectionProps> = ({ onOpenSimulator }) => {
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
              Investir à Abidjan depuis l'étranger en toute sérénité.
            </h2>

            <p className="text-base text-neutral-600 leading-relaxed">
              Grâce à notre partenaire spécialisé <strong>ImmoDiaspo</strong>, nous simplifions chaque étape de votre acquisition pour les résidents en France, en Europe, aux États-Unis ou au Canada.
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
                <span>Simuler mon projet diaspora</span>
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

      </div>
    </section>
  );
};
