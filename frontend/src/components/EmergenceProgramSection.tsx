import React from 'react';
import { Landmark, Building, Sparkles } from 'lucide-react';

export const EmergenceProgramSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-white border-t border-neutral-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Vision Uriel Group</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              NOEMA, première résidence du Programme Émergence
            </h2>

            <p className="text-base text-neutral-600 leading-relaxed">
              Programme Émergence est une initiative d'URIEL GROUP destinée à faciliter l'accès de la diaspora à un patrimoine immobilier en Afrique. NOEMA constitue la première réalisation de cette vision, qui porte un objectif global de <span className="font-bold text-neutral-900">180 logements</span>.
            </p>

            <p className="text-base text-neutral-600 leading-relaxed">
              NOEMA n'est pas un projet isolé : c'est la première étape d'un programme immobilier beaucoup plus large porté par URIEL GROUP pour la diaspora.
            </p>

            <div className="mt-6 rounded-2xl bg-[#FAFAFA] border border-neutral-200/80 p-6 flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-white border border-neutral-200 flex items-center justify-center">
                <Landmark className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
                  Un programme bénéficiant d'un financement bancaire dédié à sa réalisation
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Le Programme Émergence bénéficie de son propre financement bancaire, ce qui garantit sa solidité financière et la bonne exécution des travaux — une réassurance essentielle pour la diaspora.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-neutral-900 p-8 sm:p-10 text-center space-y-2">
              <Building className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-5xl font-serif font-bold text-white">180</p>
              <p className="text-sm text-neutral-300 uppercase tracking-wider font-semibold">
                Logements visés à terme
              </p>
              <p className="text-xs text-neutral-400 pt-3 leading-relaxed">
                NOEMA en est la première réalisation.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
