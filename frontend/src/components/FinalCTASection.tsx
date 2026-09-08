import React from 'react';
import { Building2, Calculator, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/utm';

interface FinalCTASectionProps {
  onOpenSimulator: () => void;
  whatsappNumber?: string;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onOpenSimulator,
  whatsappNumber = '+2250789001122'
}) => {
  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je souhaite échanger avec un conseiller au sujet de mon projet d\'acquisition à la Résidence NOEMA (Angré Djorogobité, Abidjan).'
  );

  return (
    <section id="contact-cta" className="py-20 lg:py-28 bg-[#111827] text-white relative overflow-hidden">
      
      {/* Subtle architectural background ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-white/10">
            <Building2 className="w-3.5 h-3.5" />
            <span>Votre Avenir à Abidjan</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
            Votre futur appartement à Abidjan commence peut-être ici.
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Disponibilités limitées au sein de ce programme d'exception R+7 à Angré Djorogobité.
            Nos conseillers vous accompagnent pour concrétiser votre acquisition dans les meilleures conditions.
          </p>
        </div>

        {/* 3 Action Pathways Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          
          {/* Option 1: Voir les appartements */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Option 1</span>
              <h3 className="text-lg font-serif font-bold text-white">Consulter la Grille des Lots</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Découvrez les plans d'architecte, surfaces et prix en direct promoteur pour les appartements T2 et T3.
              </p>
            </div>

            <a
              href="#appartements"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-400 transition-colors pt-2"
            >
              <span>Voir les appartements</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Option 2: Étudier mon financement */}
          <div className="bg-emerald-950/40 rounded-2xl p-6 border border-emerald-500/30 flex flex-col justify-between space-y-6 hover:bg-emerald-950/60 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-emerald-400">Option 2 (Recommandé)</span>
              <h3 className="text-lg font-serif font-bold text-white">Simuler mon Financement</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Estimez vos mensualités en 2 minutes et recevez une étude personnalisée de notre cellule bancaire.
              </p>
            </div>

            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-md transition-all active:scale-98"
            >
              <Calculator className="w-4 h-4" />
              <span>Lancer ma simulation</span>
            </button>
          </div>

          {/* Option 3: WhatsApp Direct */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 transition-all">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-neutral-400">Option 3</span>
              <h3 className="text-lg font-serif font-bold text-white">Échanger avec un Conseiller</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Posez vos questions en direct sur WhatsApp pour un traitement immédiat et sur mesure.
              </p>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>Contacter sur WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
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
