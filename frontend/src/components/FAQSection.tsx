import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { FAQItem } from '../types';
import { buildWhatsAppURL } from '../utils/utm';

interface FAQSectionProps {
  faqs: FAQItem[];
  whatsappNumber?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ 
  faqs, 
  whatsappNumber = '+2250789001122' 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const categories = [
    { id: 'all', label: 'Toutes les questions' },
    { id: 'projet', label: 'Projet & Architecture' },
    { id: 'financement', label: 'Financement & Apport' },
    { id: 'diaspora', label: 'Diaspora & Étranger' },
    { id: 'reservation', label: 'Réservation & Notaire' },
    { id: 'chantier', label: 'Chantier & Livraison' },
  ];

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const whatsappUrl = buildWhatsAppURL(
    whatsappNumber,
    'Bonjour, j\'ai une question spécifique concernant la Résidence NOEMA qui ne figure pas dans la FAQ.'
  );

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Foire Aux Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            Tout Ce Que Vous Devez Savoir
          </h2>

          <p className="text-base text-neutral-600 font-normal leading-relaxed">
            Consultez les réponses aux questions les plus fréquemment posées par nos futurs acquéreurs et investisseurs.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé (ex: apport, notaire, diaspora, livraison...)"
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-200 text-sm focus:border-neutral-900 focus:outline-hidden bg-[#FAFAFA]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-[#FAFAFA] text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-[#FAFAFA] rounded-2xl border border-neutral-200 text-neutral-500 text-sm">
              Aucune question trouvée pour votre recherche. Contactez directement nos conseillers.
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-[#FAFAFA] rounded-xl border border-neutral-200/90 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-neutral-900 text-sm sm:text-base hover:bg-neutral-100/60 transition-colors"
                  >
                    <span className="font-serif">{faq.question}</span>
                    <span className="p-1 rounded-md text-neutral-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-200/50 pt-3 animate-in fade-in duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Help Prompt */}
        <div className="mt-12 bg-neutral-50 rounded-2xl p-6 border border-neutral-200 text-center space-y-3">
          <p className="text-xs sm:text-sm text-neutral-600 font-medium">
            Vous avez une question spécifique sur un lot ou une modalité de paiement ?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Poser ma question sur WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
