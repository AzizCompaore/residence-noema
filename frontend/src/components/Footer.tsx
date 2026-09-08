import React from 'react';
import { Building, MapPin, Phone, Mail, MessageCircle, ShieldCheck, ArrowUp, ArrowRight, Sparkles } from 'lucide-react';
import { ResidenceInfo } from '../types';
import { buildWhatsAppURL } from '../utils/utm';

interface FooterProps {
  residence?: ResidenceInfo;
  onToggleUrielGroup: () => void;
  onOpenSimulator: () => void;
  onOpenVisioAppointment: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  residence,
  onToggleUrielGroup,
  onOpenSimulator,
  onOpenVisioAppointment
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappNumber = residence?.whatsapp_number || '+2250789001122';
  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je souhaite entrer en contact avec la direction commerciale de la Résidence NOEMA.'
  );

  return (
    <footer id="main-footer" className="border-t border-emerald-100 bg-[#dcefe6] text-neutral-700 text-xs">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

        <div className="relative mb-14 grid overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffdf9] text-neutral-900 shadow-[0_24px_70px_rgba(38,77,59,0.12)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]">
            <img
              src="./images/famille souriante.webp"
              alt="Famille souriante dans son intérieur"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-800 backdrop-blur-sm sm:left-8 sm:top-8">
              L'esprit NOEMA
            </div>
          </div>

          <div className="flex flex-col justify-between bg-[#fffdf9] px-6 py-8 sm:px-10 sm:py-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Un lieu pour vivre</span>
              </div>
              <h2 className="max-w-md font-serif text-3xl font-bold leading-[1.08] sm:text-4xl">Des moments heureux commencent chez soi.</h2>
              <p className="max-w-md text-sm leading-relaxed text-neutral-600">À NOEMA, nous imaginons une résidence où les familles se retrouvent, grandissent et profitent pleinement de leur quotidien.</p>
            </div>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-5 border-y border-neutral-200 py-4 text-[11px] font-semibold text-neutral-700">
                <span><strong className="mr-1 text-emerald-800">T2</strong> &amp; <strong className="ml-1 text-emerald-800">T3</strong></span>
                <span className="h-1 w-1 rounded-full bg-[#f17657]" />
                <span>Angré, Abidjan</span>
              </div>
              <button
                onClick={onOpenVisioAppointment}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f17657] px-5 py-3.5 text-xs font-bold text-white shadow-lg shadow-[#f17657]/20 transition-all hover:bg-[#dc6044] hover:shadow-xl active:scale-95"
              >
                Prendre rendez-vous en visio
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-10 border-b border-emerald-900/15 pb-12 md:grid-cols-2 lg:grid-cols-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-700 font-serif text-lg font-bold text-white shadow-lg shadow-emerald-900/20">
                N
              </div>
              <span className="font-serif text-lg font-bold tracking-[0.18em] text-neutral-900 uppercase">
                RÉSIDENCE NOEMA
              </span>
            </div>

            <p className="max-w-sm leading-relaxed text-neutral-600">
              Un programme immobilier résidentiel d'exception R+7 situé à Angré Djorogobité, Abidjan.
              Conçu et développé avec l'exigence architecturale d'Uriel Group et l'expertise diaspora d'ImmoDiaspo.
            </p>

            <div className="flex items-center gap-3 pt-2 text-[11px] text-neutral-500">
              <span>Partenaire promoteur : <strong>Uriel Group</strong></span>
              <span>•</span>
              <span>Distribution : <strong>ImmoDiaspo</strong></span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="border-l-2 border-emerald-600 pl-3 font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">Navigation</h4>
            <ul className="space-y-2 text-neutral-600">
              <li><a href="#decouvrir" className="transition-colors hover:text-emerald-800">Découvrir le programme</a></li>
              <li><a href="#appartements" className="transition-colors hover:text-emerald-800">Appartements & Prix</a></li>
              <li><a href="#simulateur" onClick={onOpenSimulator} className="font-semibold text-emerald-800 transition-colors hover:text-emerald-950">Simulateur de Financement</a></li>
              <li><a href="#chantier" className="transition-colors hover:text-emerald-800">Avancement du Chantier</a></li>
              <li><a href="#pourquoi-investir" className="transition-colors hover:text-emerald-800">Pourquoi Investir ?</a></li>
              <li><a href="#localisation" className="transition-colors hover:text-emerald-800">Localisation à Angré Djorogobité</a></li>
              <li><a href="#faq" className="transition-colors hover:text-emerald-800">Questions fréquentes (FAQ)</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <h4 className="border-l-2 border-emerald-600 pl-3 font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">Contact & Bureau de Vente</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>Angré Djorogobité, Cocody — Abidjan, Côte d'Ivoire</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>+225 27 22 00 11 22</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-800 hover:underline">
                  WhatsApp Commercial : {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>contact@laresidencenoema.com</span>
              </div>
            </div>
          </div>

          {/* Transition & Legal Column */}
          <div className="lg:col-span-2 space-y-4 text-left">
            <h4 className="border-l-2 border-emerald-600 pl-3 font-serif text-sm font-bold uppercase tracking-wider text-neutral-900">Groupe</h4>
            <button
              onClick={onToggleUrielGroup}
              className="w-full rounded-xl border border-emerald-900/15 bg-white/60 p-3 text-left text-xs text-neutral-700 transition-all hover:border-emerald-500/60 hover:bg-white"
            >
              <span className="block font-semibold text-neutral-900">Uriel Group</span>
              <span className="text-[10px] text-neutral-500">Page de transition institutionnelle</span>
            </button>

            <div className="space-y-1 text-[11px] text-neutral-500">
              <p>Livraison : {residence?.delivery_date_estimated || '30 mois'}</p>
              <p>Régime : VEFA notariée</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 pt-8 sm:flex-row">
          <p className="text-[11px] text-neutral-500">
            © {new Date().getFullYear()} Résidence NOEMA — Tous droits réservés. Développé par Uriel Group & ImmoDiaspo.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-neutral-500">
            <span>Politique de Confidentialité (RGPD)</span>
            <span>•</span>
            <span>Mentions Légales</span>
            <button
              onClick={scrollToTop}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-neutral-400 transition-colors hover:bg-emerald-600 hover:text-white"
              aria-label="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
