import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, RefreshCw, Database, Users, Building, CheckCircle2, ArrowRight } from 'lucide-react';
import { Apartment, LeadSubmission } from '../types';
import { formatFCFA } from '../services/api';

interface AdminSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartments: Apartment[];
}

export const AdminSyncModal: React.FC<AdminSyncModalProps> = ({
  isOpen,
  onClose,
  apartments
}) => {
  if (!isOpen) return null;

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      setLeads(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div 
      id="admin-sync-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-serif font-bold text-sm">Moniteur CRM & Synchronisation Django</h3>
              <p className="text-[11px] text-neutral-400">Suivi des prospects qualifiés et état des lots en direct</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAFAFA]">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 block">Appartements Gérés</span>
              <span className="text-xl font-mono font-bold text-neutral-900">{apartments.length}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 block">Prospects Captés</span>
              <span className="text-xl font-mono font-bold text-emerald-700">{leads.length}</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
              <span className="text-[11px] text-neutral-500 block">Sync Back-Office</span>
              <span className="text-xs font-bold text-emerald-600 block mt-1.5">Actif (Direct)</span>
            </div>
          </div>

          {/* CRM Leads Table */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <span className="text-xs font-bold uppercase text-neutral-700 tracking-wider">
                Derniers Prospects Enregistrés (API / CRM)
              </span>
              <button 
                onClick={fetchLeads}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-neutral-400 py-4 text-center italic">
                Aucun prospect soumis pour l'instant. Utilisez le simulateur pour en enregistrer un !
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {leads.map((lead) => (
                  <div key={lead.id} className="text-xs bg-[#FAFAFA] p-3 rounded-lg border border-neutral-200/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-neutral-900">{lead.first_name} {lead.last_name || ''}</span>
                      <span className="text-neutral-500 block text-[11px]">
                        {lead.residence_country} • {lead.phone_whatsapp}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-700 text-[11px] block">
                        {lead.interested_apartment_ref || 'Simulation générale'}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Django Backend Architecture Notice & ZIP Download */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold flex items-center gap-1.5 text-sm text-emerald-950">
                <Database className="w-4 h-4 text-emerald-700" />
                <span>Architecture Complète (Backend Django + Frontend React)</span>
              </div>
              <a
                href="/api/download-zip"
                download="noema-residence-code-complet.zip"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>📦 Télécharger le ZIP</span>
              </a>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Le dossier <code>backend/</code> contient les modèles Django complets (<code>Apartment</code>, <code>Lead</code>, <code>ConstructionMilestone</code>, <code>FAQItem</code>, <code>ResidenceInfo</code>) et les configurations <code>admin.py</code>. Le dossier <code>src/</code> contient l'application React complète avec Tailwind CSS et le simulateur de crédit.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAFAFA] border-t border-neutral-200 flex items-center justify-between">
          <a
            href="/api/download-zip"
            download="noema-residence-code-complet.zip"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
          >
            <span>Télécharger l'archive ZIP directe (Backend + Frontend)</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
