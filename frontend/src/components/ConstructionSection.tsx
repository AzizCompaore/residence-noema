import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Camera, 
  Layers, 
  HardHat, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ConstructionMilestone } from '../types';

interface ConstructionSectionProps {
  milestones: ConstructionMilestone[];
}

const fallbackMilestones: ConstructionMilestone[] = [
  {
    id: 'ms-01',
    stage_number: 1,
    title: 'Obtention du titre foncier et validation du projet',
    description: 'Le dossier de construction est consolidé avec le foncier, les autorisations et le cadrage du programme.',
    status: 'completed',
    progress_percent: 100,
    date_display: '2025 — Q1',
    is_3d_render: false,
  },
  {
    id: 'ms-02',
    stage_number: 2,
    title: 'Lancement des fondations et élévation du socle',
    description: 'Les travaux de terrassement, fondations et travaux de structure sont lancés sur le site.',
    status: 'completed',
    progress_percent: 100,
    date_display: '2025 — Q2',
    is_3d_render: false,
  },
  {
    id: 'ms-03',
    stage_number: 3,
    title: 'R+7 en cours d’élévation',
    description: 'La structure principale est élevée progressivement avec les étages, les planchers et les éléments de sécurité.',
    status: 'in_progress',
    progress_percent: 72,
    date_display: '2025 — Q3',
    is_3d_render: false,
  },
  {
    id: 'ms-04',
    stage_number: 4,
    title: 'Finitions intérieures et aménagements',
    description: 'Les espaces communs, la finition des logements, les équipements et les audits de qualité sont engagés.',
    status: 'upcoming',
    progress_percent: 28,
    date_display: '2026 — Q1',
    is_3d_render: false,
  },
  {
    id: 'ms-05',
    stage_number: 5,
    title: 'Livraison, clés et mise en service',
    description: 'La résidence est livrée aux acquéreurs avec la remise des clés et le suivi de la mise en service.',
    status: 'upcoming',
    progress_percent: 8,
    date_display: '2026 — Q2',
    is_3d_render: false,
  }
];

export const ConstructionSection: React.FC<ConstructionSectionProps> = ({ milestones }) => {
  const timelineMilestones = milestones.length > 0 ? milestones : fallbackMilestones;

  return (
    <section id="chantier" className="py-20 lg:py-28 bg-[#FAFAFA] border-t border-neutral-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <HardHat className="w-3.5 h-3.5 text-neutral-700" />
            <span>Preuves & Transparence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900 leading-tight">
            NOEMA, un programme réel en cours d'élévation à Angré Djorogobité.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Parce que la confiance repose sur des faits tangibles, nous partageons l'avancement chronologique certifié des travaux. 
            Nos photos réelles de chantier sont systématiquement distinguées des perspectives 3D.
          </p>
        </div>

        {/* Construction Visual Hero Feature */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-neutral-900 aspect-16/10 border border-neutral-200 shadow-md group">
            <img
              src="./images/noema_construction_site_1788290376970.jpg"
              alt="Chantier réel de la Résidence NOEMA à Angré Djorogobité Abidjan"
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform group-hover:scale-103 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            {/* Real photo badge */}
            <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5" />
              <span>Photo Réelle de Chantier • 2025</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-xs font-semibold text-emerald-300">Élévation de la structure R+7</span>
              <p className="text-sm sm:text-base font-bold">Coulage des planchers & suivi des normes parasismiques</p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-xs">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Contrôles & Sécurité</span>
              <h3 className="text-xl font-serif font-bold text-neutral-900">
                Audits Techniques Indépendants
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Chaque étape clé fait l'objet de contrôles de résistance du béton et d'audits hebdomadaires par un bureau de contrôle agréé en Côte d'Ivoire.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Permis de construire</strong> en règle et titre foncier consolidé.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Comptes notariés séquestres</strong> pour la sécurisation des fonds acquéreurs.</span>
              </div>
              <div className="flex items-start gap-3 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Rapports vidéos mensuels</strong> transmis directement aux acquéreurs de la diaspora.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Timeline Steps */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            Jalons & Planning Prévisionnel de Réalisation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {timelineMilestones.map((m) => {
              const isDone = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';

              return (
                <div
                  key={m.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isInProgress
                      ? 'bg-white border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                      : isDone
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-neutral-200/80 opacity-80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                        Étape 0{m.stage_number}
                      </span>
                      
                      {isDone ? (
                        <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Achevé
                        </span>
                      ) : isInProgress ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> En cours
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-600 font-medium">À venir</span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                      {m.title}
                    </h4>

                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">
                      {m.description}
                    </p>
                  </div>

                  {/* Progress Bar & Date */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-neutral-500 font-medium">{m.date_display}</span>
                      <span className="font-mono font-bold text-neutral-900">{m.progress_percent}%</span>
                    </div>

                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isDone ? 'bg-emerald-600' : isInProgress ? 'bg-emerald-500' : 'bg-neutral-300'
                        }`}
                        style={{ width: `${m.progress_percent}%` }}
                      />
                    </div>

                    {m.is_3d_render && (
                      <span className="text-[9px] uppercase font-semibold text-neutral-600 block text-right">
                        Perspective 3D
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
