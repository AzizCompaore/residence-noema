import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Compass, Handshake, LockKeyhole, Sparkles, TrendingUp } from 'lucide-react';

interface UrielGroupTransitionPageProps {
  onBackToNoema: () => void;
  onOpenVisioAppointment: () => void;
}

const pillars = [
  { icon: Handshake, number: '01', title: 'Accompagner', text: 'Un interlocuteur unique, du besoin jusqu’au patrimoine.' },
  { icon: TrendingUp, number: '02', title: 'Financer', text: 'Une place centrale donnée au financement dans chaque parcours.' },
  { icon: LockKeyhole, number: '03', title: 'Sécuriser', text: 'Des vérifications juridiques, techniques et financières à chaque étape.' }
];

const ecosystem = [
  ['ImmoDiaspo', 'Immobilier, financement et sécurisation des projets de la diaspora.'],
  ['Uriel Group Afrique', 'Présence directe et opérationnelle du Groupe en Côte d’Ivoire.'],
  ['Programme Émergence', 'Les premières réalisations immobilières concrètes du Groupe.'],
  ['Uriel Business Academy', 'La formation et la transmission au service des projets.'],
  ['Signature Tour', 'À la rencontre de la diaspora et de ses opportunités.']
];

export const UrielGroupTransitionPage: React.FC<UrielGroupTransitionPageProps> = ({ onBackToNoema, onOpenVisioAppointment }) => (
  <div id="uriel-group-transition-page" className="min-h-screen bg-[#f7f6f2] text-neutral-900">
    <header className="border-b border-neutral-900/10 bg-white/90 px-5 py-4 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/images/Logo Uriel Groupe.webp" alt="Uriel Group" loading="lazy" decoding="async" className="h-11 w-11 rounded-full object-cover" />
          <div><span className="block text-sm font-bold tracking-[0.2em] text-neutral-950">URIEL GROUP</span><span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">Investir · Bâtir · Pérenniser</span></div>
        </div>
        <button onClick={onBackToNoema} className="inline-flex items-center gap-2 rounded-full border border-neutral-300 px-3.5 py-2.5 text-xs font-bold text-neutral-700 transition-all hover:border-emerald-700 hover:text-emerald-800"><ArrowLeft className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Retour à </span>NOEMA</button>
      </div>
    </header>

    <main>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20 lg:py-24" style={{ width: '100%', boxSizing: 'border-box' }}>
        <div className="max-w-2xl min-w-0 space-y-7">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800"><span className="h-px w-8 bg-emerald-600" /> Maison mère · Depuis 2018</div>
          <h1 className="max-w-full break-words font-serif text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Construire plus qu’un projet. Construire un avenir.</h1>
          <p className="max-w-xl break-words text-base leading-relaxed text-neutral-600 sm:text-lg">Uriel Group accompagne la diaspora afro-caribéenne dans la construction de son patrimoine, entre l’Europe et l’Afrique.</p>
          <div className="flex flex-wrap items-center gap-3 pt-2"><a href="#mission" className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 transition-all hover:bg-emerald-900">Notre mission <ArrowRight className="h-4 w-4" /></a><button onClick={onOpenVisioAppointment} className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 text-xs font-bold text-neutral-700 transition-all hover:border-emerald-700 hover:text-emerald-800"><CalendarDays className="h-4 w-4 text-emerald-700" /> Rendez-vous visio</button></div>
        </div>

        <div className="relative flex min-w-0 items-center justify-center lg:justify-end"><div className="absolute right-0 top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-emerald-800/10 sm:block" /><div className="relative w-full rounded-2xl bg-white p-3 shadow-[0_20px_60px_rgba(27,56,45,0.14)]" style={{ maxWidth: '310px' }}><div className="aspect-[4/5] overflow-hidden rounded-xl"><img src="/images/Madame Mireille Le Bouler.webp" alt="Mme Mireille Le Bouler, fondatrice d’Uriel Group" className="h-full w-full object-cover" /></div><div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4"><div><p className="font-serif text-lg font-bold">Mireille Le Bouler</p><p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-800">Fondatrice</p></div><span className="text-2xl font-serif text-[#c99f42]">“</span></div></div></div>
      </section>

      <section id="mission" className="border-y border-neutral-200 bg-white px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-7xl"><div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end"><div><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">Ce qui nous guide</span><h2 className="mt-4 max-w-lg font-serif text-3xl font-bold leading-tight sm:text-4xl">Accompagner, du besoin jusqu’au patrimoine.</h2></div><p className="max-w-2xl text-sm leading-relaxed text-neutral-600 sm:text-base">Né d’une expérience réelle de la diaspora, Uriel Group coordonne les étapes essentielles d’un projet entre l’Europe et l’Afrique : compréhension, faisabilité, structuration, financement, sécurisation et suivi.</p></div><div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">{pillars.map(({ icon: Icon, number, title, text }) => <article key={title} className="group border-t-2 border-neutral-200 bg-[#f7f6f2] p-6 transition-all hover:-translate-y-1 hover:border-emerald-700 hover:shadow-lg"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-emerald-700" /><span className="font-mono text-xs text-neutral-400">{number}</span></div><h3 className="mt-8 font-serif text-2xl font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-neutral-600">{text}</p></article>)}</div></div></section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:py-24"><div><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">Notre écosystème</span><h2 className="mt-4 max-w-md font-serif text-3xl font-bold leading-tight sm:text-4xl">Une vision. Plusieurs expertises.</h2><p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600">Chaque entité apporte une compétence précise à un parcours pensé pour être simple, lisible et sécurisé.</p></div><div className="divide-y divide-neutral-200 border-y border-neutral-200">{ecosystem.map(([title, text], index) => <div key={title} className="grid grid-cols-[45px_1fr] gap-4 py-5 sm:grid-cols-[55px_180px_1fr] sm:items-center"><span className="font-mono text-xs text-emerald-700">0{index + 1}</span><h3 className="font-serif text-lg font-bold">{title}</h3><p className="col-start-2 text-xs leading-relaxed text-neutral-600 sm:col-start-3">{text}</p></div>)}</div></section>

      <section className="border-y border-emerald-900/10 bg-[#e8f0e9] px-5 py-14 sm:px-8 lg:py-18"><div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><div><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-800">Notre première réalisation</span><h2 className="mt-4 max-w-xl font-serif text-3xl font-bold leading-tight sm:text-4xl">Résidence NOEMA, un projet accompagné par Uriel Group.</h2></div><div className="space-y-4 text-sm leading-relaxed text-neutral-700"><p>Portée par Uriel Group Afrique dans le cadre du Programme Émergence, la Résidence NOEMA est la première réalisation concrète de l’écosystème Uriel Group.</p><p>ImmoDiaspo en assure l’accompagnement immobilier et le parcours de financement, tandis que le Groupe coordonne les partenaires, la sécurisation et le suivi du projet.</p><button onClick={onBackToNoema} className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-900">Découvrir le projet NOEMA <ArrowRight className="h-4 w-4" /></button></div></div></section>

      <section className="bg-[#10251f] px-5 py-14 text-white sm:px-8 lg:py-18"><div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div><span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#e1bd68]">Une promesse simple</span><h2 className="mt-3 max-w-2xl font-serif text-3xl font-bold sm:text-4xl">Créer la confiance. Donner envie d’agir.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">Rassurer → Qualifier → Accompagner → Convertir.</p></div><div className="flex flex-wrap gap-3"><button onClick={onOpenVisioAppointment} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-xs font-bold text-white transition-colors hover:border-white hover:bg-white/10"><CalendarDays className="h-4 w-4" /> Prendre rendez-vous</button><button onClick={onBackToNoema} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#e1bd68] px-5 py-3 text-xs font-bold text-[#10251f] transition-colors hover:bg-[#f2d48e]">Découvrir NOEMA <ArrowRight className="h-4 w-4" /></button></div></div></section>
    </main>

    <footer className="border-t border-neutral-200 bg-[#f7f6f2] px-5 py-6 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-[11px] text-neutral-500 sm:flex-row"><span>© {new Date().getFullYear()} Uriel Group · Tous droits réservés</span><span>Abidjan, Côte d’Ivoire</span></div></footer>
  </div>
);
