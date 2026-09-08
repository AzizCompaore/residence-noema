import React, { useState } from 'react';
import { ArrowRight, Calculator, ChartNoAxesCombined, Home, Landmark, Percent, Wallet } from 'lucide-react';
import { Apartment } from '../types';
import { formatFCFA } from '../services/api';

interface SimulatorSectionProps {
  apartments: Apartment[];
  onOpenSimulator: (apt?: Apartment) => void;
}

const formatCompactFCFA = (value: number) => `${Math.round(value / 1000000).toLocaleString('fr-FR')} M`;

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({ apartments, onOpenSimulator }) => {
  const sampleApartment = apartments[0] || { id: 'apt-t2-noema', ref: 'NOEMA-T2-ETC-01', name: 'T2 étage courant', price_fcfa: 59000000 };
  const price = sampleApartment.price_fcfa;
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [durationYears, setDurationYears] = useState(15);
  const [interestRate, setInterestRate] = useState(6.5);
  const [rentalYield, setRentalYield] = useState(7.8);
  const [horizonYears, setHorizonYears] = useState(10);

  const downPayment = Math.round(price * downPaymentPercent / 100);
  const loanAmount = price - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = durationYears * 12;
  const monthlyPayment = Math.round(loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1));
  const estimatedRent = Math.round(price * rentalYield / 100 / 12);
  const monthlyCashFlow = estimatedRent - monthlyPayment;
  const projectedValue = Math.round(price * Math.pow(1.04, horizonYears));
  const years = Array.from({ length: horizonYears + 1 }, (_, year) => year);
  const propertyValues = years.map((year) => price * Math.pow(1.04, year));
  const investedValues = years.map((year) => downPayment + monthlyPayment * 12 * year);
  const chartMax = Math.max(...propertyValues, ...investedValues) * 1.08;
  const chartPoint = (value: number, year: number) => `${7 + (year / horizonYears) * 90},${88 - (value / chartMax) * 78}`;
  const propertyLine = propertyValues.map(chartPoint).join(' ');
  const investedLine = investedValues.map(chartPoint).join(' ');

  return (
    <section id="simulateur" className="border-y border-stone-200 bg-[#fbfaf8] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#bd5938]"><Calculator className="h-4 w-4" /> Simulateur patrimonial</div>
            <h2 className="font-serif text-3xl font-bold text-stone-900 sm:text-4xl">Projetez votre acquisition à la Résidence NOEMA.</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">Ajustez vos paramètres pour visualiser une première estimation de financement et la valeur potentielle de votre bien.</p>
          </div>
          <button onClick={() => onOpenSimulator(sampleApartment as Apartment)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-stone-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-stone-700">
            Étudier mon dossier complet <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
            <Slider label="Apport personnel" value={downPaymentPercent} display={formatFCFA(downPayment)} min={10} max={50} step={5} onChange={setDownPaymentPercent} icon={Wallet} suffix=" %" />
            <Slider label="Durée du prêt" value={durationYears} display={`${durationYears} ans`} min={5} max={25} step={1} onChange={setDurationYears} icon={Landmark} suffix=" ans" />
            <Slider label="Taux d’intérêt" value={interestRate} display={`${interestRate.toLocaleString('fr-FR')} %`} min={3} max={12} step={0.1} onChange={setInterestRate} icon={Percent} suffix=" %" />
            <Slider label="Rendement locatif" value={rentalYield} display={`${rentalYield.toLocaleString('fr-FR')} %`} min={3} max={12} step={0.1} onChange={setRentalYield} icon={ChartNoAxesCombined} suffix=" %" />
            <div className="sm:col-span-2"><Slider label="Horizon de projection" value={horizonYears} display={`${horizonYears} ans`} min={5} max={20} step={1} onChange={setHorizonYears} icon={Home} suffix=" ans" /></div>
          </div>

          <div className="space-y-5 lg:col-span-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Metric label="Prix d’achat" value={formatFCFA(price)} accent />
              <Metric label="Mensualité estimée" value={formatFCFA(monthlyPayment)} />
              <Metric label="Loyer mensuel cible" value={formatFCFA(estimatedRent)} />
              <Metric label="Flux de trésorerie / mois" value={`${monthlyCashFlow >= 0 ? '+' : ''}${formatFCFA(monthlyCashFlow)}`} positive={monthlyCashFlow >= 0} />
              <Metric label="Rendement brut" value={`${rentalYield.toLocaleString('fr-FR')} %`} />
              <Metric label={`Valeur estimée à ${horizonYears} ans`} value={formatFCFA(projectedValue)} accent />
            </div>

            <div className="rounded-lg border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><h3 className="font-serif text-lg font-bold text-stone-900">Évolution de votre patrimoine</h3><p className="text-xs text-stone-500">Projection sur {horizonYears} ans, hypothèse de valorisation annuelle de 4 %.</p></div>
                <div className="flex gap-4 text-[11px] font-semibold text-stone-600"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#bd5938]" /> Valeur du bien</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-700" /> Capital engagé</span></div>
              </div>
              <svg className="mt-5 h-56 w-full" viewBox="0 0 104 100" role="img" aria-label="Courbe de projection patrimoniale">
                {[20, 40, 60, 80].map((y) => <line key={y} x1="7" x2="97" y1={y} y2={y} stroke="#e7e2db" strokeDasharray="1.5 2" vectorEffect="non-scaling-stroke" />)}
                <polyline points={propertyLine} fill="none" stroke="#bd5938" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                <polyline points={investedLine} fill="none" stroke="#176b55" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
                {years.filter((year) => year === 0 || year === horizonYears || year % 5 === 0).map((year) => <text key={year} x={7 + (year / horizonYears) * 90} y="97" textAnchor="middle" fontSize="3" fill="#8b8178">{year} an{year > 1 ? 's' : ''}</text>)}
              </svg>
              <div className="mt-1 flex justify-between border-t border-stone-100 pt-4 text-xs text-stone-500"><span>Financement estimé : <strong className="font-mono text-stone-800">{formatCompactFCFA(loanAmount)} FCFA</strong></span><span>Apport : <strong className="font-mono text-stone-800">{downPaymentPercent} %</strong></span></div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-xs leading-relaxed text-stone-500">Estimation non contractuelle. Une étude complète de votre situation, de vos revenus et de votre capacité d’emprunt sera réalisée par un conseiller.</p>
      </div>
    </section>
  );
};

const Slider = ({ label, value, display, min, max, step, onChange, icon: Icon, suffix }: { label: string; value: number; display: string; min: number; max: number; step: number; onChange: (value: number) => void; icon: React.ElementType; suffix: string }) => (
  <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3"><span className="flex items-center gap-2 text-sm text-stone-600"><Icon className="h-4 w-4 text-[#bd5938]" />{label}</span><strong className="whitespace-nowrap font-serif text-lg text-stone-900">{display}</strong></div>
    <input aria-label={label} className="mt-5 w-full accent-[#bd5938]" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    <div className="mt-1 flex justify-between text-[10px] font-medium uppercase text-stone-400"><span>{min}{suffix}</span><span>{max}{suffix}</span></div>
  </div>
);

const Metric = ({ label, value, accent = false, positive }: { label: string; value: string; accent?: boolean; positive?: boolean }) => (
  <div className={`rounded-lg border p-5 ${accent ? 'border-[#e9cfc5] bg-[#fff8f5]' : 'border-stone-200 bg-white'}`}>
    <span className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</span>
    <p className={`mt-2 font-serif text-2xl font-bold ${accent ? 'text-[#bd5938]' : positive === false ? 'text-red-600' : 'text-stone-900'}`}>{value}</p>
  </div>
);