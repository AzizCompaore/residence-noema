import React from 'react';
import { Building2, Calculator, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/utm';

interface MobileStickyBarProps {
  onOpenSimulator: () => void;
  whatsappNumber?: string;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  onOpenSimulator,
  whatsappNumber = '+2250789001122'
}) => {
  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je visite le site de la Résidence NOEMA depuis mon mobile et je souhaite des précisions.'
  );

  return (
    <div 
      id="mobile-sticky-bottom-bar"
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-3 py-2.5 shadow-lg flex items-center justify-between gap-2"
    >
      {/* Button 1: Appartements */}
      <a
        href="#appartements"
        className="flex-1 py-2.5 px-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors"
      >
        <Building2 className="w-3.5 h-3.5 text-neutral-600" />
        <span>Appartements</span>
      </a>

      {/* Button 2: Simulation */}
      <button
        onClick={onOpenSimulator}
        className="flex-1 py-2.5 px-2 rounded-xl bg-neutral-900 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors"
      >
        <Calculator className="w-3.5 h-3.5 text-emerald-400" />
        <span>Simuler</span>
      </button>

      {/* Button 3: WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
      </a>
    </div>
  );
};
