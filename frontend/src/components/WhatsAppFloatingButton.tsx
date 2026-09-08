import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../utils/utm';

interface WhatsAppFloatingButtonProps {
  whatsappNumber?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  whatsappNumber = '+2250789001122'
}) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, je consulte le site de la Résidence NOEMA à Angré Djorogobité et je souhaite être renseigné(e).'
  );

  return (
    <div id="floating-actions-dock" className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Main WhatsApp Floating Action Button */}
      <a
        id="floating-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 relative group"
        aria-label="Contacter sur WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
        
        {/* Pulsing online badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </span>
      </a>

    </div>
  );
};
