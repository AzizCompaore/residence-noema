import React from 'react';
import { Building2, Calculator, MessageCircle, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/utm';

interface FinalCTASectionProps {
  onOpenSimulator: () => void;
  onOpenVisioAppointment: () => void;
  whatsappNumber?: string;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onOpenSimulator,
  onOpenVisioAppointment,
  whatsappNumber = '+2250789001122'
}) => {
  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je souhaite échanger avec un conseiller au sujet de mon projet d\'acquisition à la Résidence NOEMA (Angré Djorogobité, Abidjan).'
  );

  return (
    <section id="contact-cta" className="py-20 lg:py-28 bg-[var(--noema-chocolat)] text-white relative overflow-hidden">

      {/* Subtle architectural background ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(#4b3a30_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-white/10">
            <Building2 className="w-3.5 h-3.5" />
            <span>Votre Avenir à Abidjan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            NOEMA est la résidence conçue par et pour la diaspora.
          </h2>

          <div className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto space-y-1.5">
            <p>Je peux devenir propriétaire à Abidjan même si je vis à l'étranger.</p>
            <p>URIEL GROUP m'accompagne de A à Z, y compris dans l'étude de mon financement.</p>
          </div>
        </div>

        {/* Action Pathways Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto text-left">

          {/* Option 1: Choisir mon appartement */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Étape 1</span>
              <h3 className="text-base font-serif font-bold text-white">Choisir mon appartement</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Plans d'architecte, surfaces et prix en direct promoteur pour les T2 et T3.
              </p>
            </div>

            <a
              href="#appartements"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors pt-2"
            >
              <span>CHOISIR MON APPARTEMENT</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Option 2: Simuler mon financement */}
          <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-between space-y-6 hover:bg-emerald-950/60 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-400">Recommandé</span>
              <h3 className="text-base font-serif font-bold text-white">Simuler mon financement</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Estimez vos mensualités et recevez une étude personnalisée, depuis votre pays de résidence.
              </p>
            </div>

            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-md transition-all active:scale-98"
            >
              <Calculator className="w-4 h-4" />
              <span>SIMULER MON FINANCEMENT</span>
            </button>
          </div>

          {/* Option 3: Être rappelé */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Sans engagement</span>
              <h3 className="text-base font-serif font-bold text-white">Être rappelé</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Planifiez un échange à l'heure qui vous convient, où que vous soyez.
              </p>
            </div>

            <button
              onClick={onOpenVisioAppointment}
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors pt-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>ÊTRE RAPPELÉ</span>
            </button>
          </div>

          {/* Option 4: WhatsApp Direct */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Immédiat</span>
              <h3 className="text-base font-serif font-bold text-white">Parler à un conseiller</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Posez vos questions en direct sur WhatsApp pour un traitement immédiat.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>PARLER À UN CONSEILLER SUR WHATSAPP</span>
            </a>
          </div>

        </div>

        {/* Security Reassurance */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Vente en État Futur d'Achèvement (VEFA) • Garantie Notariée • Titre Foncier Vérifié</span>
        </div>

      </div>
    </section>
  );
};
