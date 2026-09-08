import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calculator, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  ShieldCheck, 
  MessageCircle, 
  Info,
  TrendingUp,
  Sparkles,
  Building,
  DollarSign,
  AlertCircle,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Apartment, LeadSubmission, SimulationResult } from '../types';
import { calculateSimulation, submitLead, formatFCFA, formatEUR } from '../services/api';
import { captureUTMParams, buildWhatsAppURL } from '../utils/utm';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedApartment: Apartment | null;
  allApartments: Apartment[];
  onSelectApartment: (apt: Apartment) => void;
  whatsappNumber?: string;
}

const fallbackApartments: Apartment[] = [
  {
    id: 'fallback-t2-noema',
    ref: 'NOEMA-T2-ETC-01',
    name: 'T2 étage courant',
    type: 't2',
    rooms_count: 2,
    bedrooms_count: 1,
    bathrooms_count: 1,
    surface_sqm: 50.01,
    balcony_surface_sqm: 0,
    floor: 'Selon lot — étage à confirmer',
    price_fcfa: 59000000,
    status: 'available',
    description: 'T2 de 50,01 m² avec séjour, cuisine, buanderie et chambre avec salle d’eau.',
    key_features: ['Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau'],
    photos: [],
    display_order: 1,
    is_featured: true
  },
  {
    id: 'fallback-t3-noema',
    ref: 'NOEMA-T3-ETC-01',
    name: 'T3 étage courant',
    type: 't3',
    rooms_count: 3,
    bedrooms_count: 2,
    bathrooms_count: 2,
    surface_sqm: 100.1,
    balcony_surface_sqm: 4.56,
    floor: 'Selon lot — étage à confirmer',
    price_fcfa: 109000000,
    status: 'available',
    description: 'T3 de 100,10 m² avec séjour, balcon, cuisine et deux chambres avec salle d’eau.',
    key_features: ['Séjour + coin repas', 'Balcon de 4,56 m²', '2 chambres avec salle d’eau'],
    photos: [],
    display_order: 2,
    is_featured: true
  }
];

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  selectedApartment,
  allApartments,
  onSelectApartment,
  whatsappNumber = '+2250789001122'
}) => {
  const availableApartments = allApartments.length > 0 ? allApartments : fallbackApartments;

  // Active Apartment Context
  const [currentApartment, setCurrentApartment] = useState<Apartment>(
    selectedApartment || availableApartments[0]
  );

  // Progressive Step State: 1 to 7, then 8 is Result & Lead Form, 9 is Success
  const [step, setStep] = useState<number>(1);

  // Simulation Form Data
  const [residenceCountry, setResidenceCountry] = useState<string>('France');
  const [customCountry, setCustomCountry] = useState<string>('');
  const [age, setAge] = useState<number>(35);
  const [employmentStatus, setEmploymentStatus] = useState<string>('Cadre / Salarié');
  const [professionalSeniorityYears, setProfessionalSeniorityYears] = useState<number>(5);
  const [monthlyIncomeEUR, setMonthlyIncomeEUR] = useState<string>('');
  const [additionalMonthlyIncome, setAdditionalMonthlyIncome] = useState<string>('');
  const [currency, setCurrency] = useState<'EUR' | 'FCFA'>('EUR');
  const [downPaymentEUR, setDownPaymentEUR] = useState<string>('');
  const [existingLoansEUR, setExistingLoansEUR] = useState<string>('');
  const [durationYears, setDurationYears] = useState<number>(15);
  const [projectPurpose, setProjectPurpose] = useState('Résidence principale');
  const [fundsAvailability, setFundsAvailability] = useState('Disponible immédiatement');

  // Calculated Simulation Result
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Lead Contact Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneWhatsApp, setPhoneWhatsApp] = useState('');
  const [email, setEmail] = useState('');
  const [consentDataProcessing, setConsentDataProcessing] = useState(true);
  const [consentMarketing, setConsentMarketing] = useState(true);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [needsApartmentSelection, setNeedsApartmentSelection] = useState(!selectedApartment);
  const rateConversion = 655.957;

  const convertAmount = (value: string, factor: number) => value === '' ? '' : String(Math.round(Number(value) * factor));
  const maximumDownPayment = currency === 'EUR'
    ? Math.floor(currentApartment.price_fcfa / rateConversion)
    : currentApartment.price_fcfa;
  const updateDownPayment = (value: string) => {
    if (value === '') {
      setDownPaymentEUR('');
      return;
    }
    setDownPaymentEUR(String(Math.min(Math.max(0, Number(value)), maximumDownPayment)));
  };

  const changeCurrency = (nextCurrency: 'EUR' | 'FCFA') => {
    if (nextCurrency === currency) return;
    const factor = nextCurrency === 'FCFA' ? rateConversion : 1 / rateConversion;
    setMonthlyIncomeEUR((value) => convertAmount(value, factor));
    setAdditionalMonthlyIncome((value) => convertAmount(value, factor));
    setDownPaymentEUR((value) => convertAmount(value, factor));
    setExistingLoansEUR((value) => convertAmount(value, factor));
    setCurrency(nextCurrency);
  };

  // Update current apartment when prop changes
  useEffect(() => {
    if (!isOpen) return;
    setResidenceCountry('France');
    setCustomCountry('');
    setAge(35);
    setEmploymentStatus('Cadre / Salarié');
    setProfessionalSeniorityYears(5);
    setMonthlyIncomeEUR('');
    setAdditionalMonthlyIncome('');
    setCurrency('EUR');
    setDownPaymentEUR('');
    setExistingLoansEUR('');
    setDurationYears(15);
    setProjectPurpose('Résidence principale');
    setFundsAvailability('Disponible immédiatement');
    setSimulationResult(null);
    setFirstName('');
    setLastName('');
    setPhoneWhatsApp('');
    setEmail('');
    setConsentDataProcessing(true);
    setConsentMarketing(true);
    setLeadSubmitted(false);
    setErrorMessage('');
    if (selectedApartment) {
      setCurrentApartment(selectedApartment);
      setNeedsApartmentSelection(false);
      setStep(1);
    } else {
      setCurrentApartment(availableApartments[0]);
      setNeedsApartmentSelection(true);
      setStep(0);
    }
  }, [isOpen, selectedApartment, availableApartments]);

  // Trigger simulation calculation whenever financial parameters update
  useEffect(() => {
    async function runCalc() {
      if (!currentApartment) return;

      const priceFCFA = currentApartment.price_fcfa;
      
      const downPaymentFCFA = currency === 'EUR' 
        ? Math.round(Number(downPaymentEUR) * rateConversion)
        : Number(downPaymentEUR);

      const monthlyIncomeFCFA = currency === 'EUR'
        ? Math.round(Number(monthlyIncomeEUR) * rateConversion)
        : Number(monthlyIncomeEUR);

      const existingLoansFCFA = currency === 'EUR'
        ? Math.round(Number(existingLoansEUR) * rateConversion)
        : Number(existingLoansEUR);

      const additionalIncomeFCFA = currency === 'EUR'
        ? Math.round(Number(additionalMonthlyIncome) * rateConversion)
        : Number(additionalMonthlyIncome);

      try {
        setIsCalculating(true);
        const res = await calculateSimulation({
          apartment_id: currentApartment.id,
          apartment_price: priceFCFA,
          down_payment: downPaymentFCFA,
          duration_years: durationYears,
          monthly_net_income: monthlyIncomeFCFA,
          existing_monthly_loans: existingLoansFCFA,
          additional_monthly_income: additionalIncomeFCFA
        });
        if (res.data) {
          setSimulationResult(res.data);
        }
      } catch (err) {
        console.error('Calculation error', err);
      } finally {
        setIsCalculating(false);
      }
    }

    runCalc();
  }, [currentApartment, downPaymentEUR, monthlyIncomeEUR, additionalMonthlyIncome, existingLoansEUR, durationYears, currency]);

  // Handle Form Submission to CRM
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!firstName.trim() || !phoneWhatsApp.trim() || !email.trim()) {
      setErrorMessage('Veuillez renseigner votre prénom, email et téléphone WhatsApp.');
      return;
    }

    if (!consentDataProcessing) {
      setErrorMessage('Le consentement au traitement des données est requis pour l\'étude de votre dossier.');
      return;
    }

    setIsSubmittingLead(true);
    const utm = captureUTMParams();

    const payload: LeadSubmission = {
      first_name: firstName,
      last_name: lastName,
      phone_whatsapp: phoneWhatsApp,
      email: email,
      residence_country: residenceCountry === 'Autre' ? customCountry : residenceCountry,
      age: Number(age),
      employment_status: employmentStatus,
      professional_seniority_years: professionalSeniorityYears,
      has_co_borrower: false,
      co_borrower_monthly_income: 0,
      additional_monthly_income: currency === 'EUR' ? Number(additionalMonthlyIncome) * 656 : Number(additionalMonthlyIncome),
      project_purpose: projectPurpose,
      funds_availability: fundsAvailability,
      monthly_net_income: currency === 'EUR' ? Number(monthlyIncomeEUR) * 656 : Number(monthlyIncomeEUR),
      down_payment: currency === 'EUR' ? Number(downPaymentEUR) * 656 : Number(downPaymentEUR),
      existing_monthly_loans: currency === 'EUR' ? Number(existingLoansEUR) * 656 : Number(existingLoansEUR),
      desired_duration_years: durationYears,
      interested_apartment_id: currentApartment.id,
      interested_apartment_ref: currentApartment.ref,
      interested_apartment_price: currentApartment.price_fcfa,
      simulation: simulationResult || undefined,
      utm_source: utm.utm_source || 'direct_site_simulator',
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      consent_marketing: consentMarketing,
      consent_data_processing: consentDataProcessing
    };

    try {
      const res = await submitLead(payload);
      if (res.success) {
        setLeadSubmitted(true);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore if canvas unavailable
        }
      } else {
        setErrorMessage(res.message || 'Une erreur est survenue lors de l\'envoi.');
      }
    } catch (err) {
      setErrorMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const countriesList = [
    'France', 
    'Côte d\'Ivoire', 
    'Europe (Belgique, Suisse, Allemagne, UK...)', 
    'Amérique du Nord (USA, Canada)', 
    'Autre'
  ];

  const totalSteps = 7;
  const progressPercent = Math.round((step / totalSteps) * 100);

  const whatsappMessage = simulationResult 
    ? `Bonjour, je viens de réaliser une simulation pour l'appartement ${currentApartment.name} (${currentApartment.ref}) à la Résidence NOEMA.\n- Prix: ${formatFCFA(currentApartment.price_fcfa)}\n- Apport: ${formatFCFA(simulationResult.down_payment)}\n- Mensualité estimée: ${formatFCFA(simulationResult.monthly_payment)} / mois\nJe souhaite faire étudier mon dossier par un conseiller.`
    : `Bonjour, je souhaite faire étudier mon financement pour la Résidence NOEMA.`;

  const whatsappUrl = buildWhatsAppURL(whatsappNumber, whatsappMessage);

  const selectApartmentForSimulation = (apartment: Apartment) => {
    setCurrentApartment(apartment);
    onSelectApartment(apartment);
    setNeedsApartmentSelection(false);
    setStep(1);
  };

  const downloadSimulation = () => {
    if (!simulationResult) return;
    const escapeHtml = (value: string | number) => String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
    const rows = [
      ['LE BIEN SÉLECTIONNÉ', ''],
      ['Appartement', currentApartment.name],
      ['Référence', currentApartment.ref],
      ['Prix indicatif', formatFCFA(currentApartment.price_fcfa)],
      ['LOCALISATION', ''],
      ['Résidence', 'Résidence NOEMA'],
      ['Quartier', 'Angré Djorogobité, Abidjan'],
      ['VOTRE FINANCEMENT', ''],
      ['Apport personnel', formatFCFA(simulationResult.down_payment)],
      ['Montant à financer', formatFCFA(simulationResult.loan_amount)],
      ['Durée de remboursement', `${simulationResult.duration_years} ans`],
      ['Taux annuel indicatif', `${simulationResult.interest_rate.toLocaleString('fr-FR')} %`],
      ['Mensualité estimée', `${formatFCFA(simulationResult.monthly_payment)} / mois`],
      ['CAPACITÉ DE REMBOURSEMENT', ''],
      ['Revenus mensuels retenus', formatFCFA(simulationResult.monthly_income)],
      ['Charges mensuelles déclarées', formatFCFA(simulationResult.existing_loans)],
      ['Taux d’endettement indicatif', `${simulationResult.debt_ratio_percent.toLocaleString('fr-FR')} %`],
      ['Statut de l’estimation', simulationResult.is_debt_ratio_healthy ? 'Dans le seuil indicatif de 33 %' : 'À étudier avec un conseiller'],
    ];
    const tableRows = rows.map(([label, value]) => value === ''
      ? `<tr class="section"><td colspan="2">${escapeHtml(label)}</td></tr>`
      : `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`
    ).join('');
    const report = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body { font-family: Arial, sans-serif; color: #24332d; }
      table { border-collapse: collapse; width: 760px; }
      td { border-bottom: 1px solid #dfe6e1; padding: 11px 14px; font-size: 12pt; }
      td:first-child { width: 45%; color: #5d6b64; font-weight: bold; }
      td:last-child { font-weight: bold; color: #183a30; }
      .title td { background: #17352d; color: #ffffff; border: 0; font-size: 22pt; font-weight: bold; padding: 20px 18px 8px; }
      .subtitle td { background: #17352d; color: #b9e5d1; border: 0; font-size: 11pt; padding: 0 18px 20px; }
      .section td { background: #e7f3ed; color: #176b55; border: 0; font-size: 10pt; font-weight: bold; padding: 9px 14px; }
      .notice td { background: #fff8e8; color: #765c20; border: 0; font-size: 9pt; font-weight: normal; padding: 14px; }
    </style></head><body><table>
      <tr class="title"><td colspan="2">RÉSIDENCE NOEMA</td></tr>
      <tr class="subtitle"><td colspan="2">Simulation de financement personnalisée</td></tr>
      ${tableRows}
      <tr class="notice"><td colspan="2">Estimation non contractuelle établie le ${new Date().toLocaleDateString('fr-FR')}. Une étude complète de votre dossier est nécessaire avant toute décision de financement.</td></tr>
    </table></body></html>`;
    const link = document.createElement('a');
    const downloadUrl = URL.createObjectURL(new Blob([`\uFEFF${report}`], { type: 'application/vnd.ms-excel;charset=utf-8;' }));
    link.href = downloadUrl;
    link.download = `simulation-noema-${currentApartment.ref}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  };

  const amortizationYears = simulationResult
    ? Array.from(new Set([0, 1, 2, 3, 4, 5, simulationResult.duration_years].filter((year) => year <= simulationResult.duration_years))).sort((first, second) => first - second)
    : [];
  const getOutstandingBalance = (year: number) => {
    if (!simulationResult || simulationResult.loan_amount <= 0) return 0;
    const monthsElapsed = Math.min(year * 12, simulationResult.duration_years * 12);
    const monthlyRate = simulationResult.interest_rate / 100 / 12;
    if (monthlyRate === 0) {
      return Math.max(0, simulationResult.loan_amount - simulationResult.monthly_payment * monthsElapsed);
    }
    const growth = Math.pow(1 + monthlyRate, monthsElapsed);
    return Math.max(0, simulationResult.loan_amount * growth - simulationResult.monthly_payment * ((growth - 1) / monthlyRate));
  };
  const amortizationData = amortizationYears.map((year) => {
    const outstandingBalance = getOutstandingBalance(year);
    return { year, outstandingBalance, repaidCapital: Math.max(0, simulationResult ? simulationResult.loan_amount - outstandingBalance : 0) };
  });
  const chartPoint = (value: number, index: number) => {
    const maxLoan = simulationResult?.loan_amount || 1;
    const x = 7 + (index / Math.max(1, amortizationData.length - 1)) * 90;
    const y = 84 - (value / maxLoan) * 66;
    return `${x},${y}`;
  };
  const outstandingLine = amortizationData.map((item, index) => chartPoint(item.outstandingBalance, index)).join(' ');
  const repaidLine = amortizationData.map((item, index) => chartPoint(item.repaidCapital, index)).join(' ');

  if (!isOpen) return null;

  return (
    <div 
      id="simulator-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-4 max-h-[94vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header: Apartment Context Banner (Crucial Requirement: zero retyping) */}
        <div className="bg-[#17352d] text-white px-5 sm:px-7 py-5 flex items-center justify-between">
          <div className="min-w-0 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 shrink-0 rounded-lg border border-emerald-300/30 bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-950/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-semibold">
                  Étude de financement
                </span>
                {!needsApartmentSelection && (
                  <>
                    <span className="text-emerald-100/40">•</span>
                    <span className="text-xs text-emerald-100 font-mono font-bold">
                      {currentApartment.ref}
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 truncate text-sm sm:text-base font-bold text-white">
                {needsApartmentSelection ? (
                  'Sélectionnez le bien à financer'
                ) : (
                  <>{currentApartment.name} <span className="hidden sm:inline text-emerald-200/60">—</span> <span className="font-mono text-emerald-300">{formatFCFA(currentApartment.price_fcfa)}</span></>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-3 shrink-0 p-2 rounded-lg text-emerald-100/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!leadSubmitted && (
          <div className="border-b border-neutral-200 bg-[#fbfaf8] px-5 sm:px-7 py-3">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider">
              <span className="text-neutral-500">Votre dossier</span>
              <span className="text-emerald-800">{needsApartmentSelection ? 'Choix du bien' : `Étape ${Math.min(step, totalSteps)} sur ${totalSteps}`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div 
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{ width: `${needsApartmentSelection ? 0 : progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white">
          
          {leadSubmitted ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-8 space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-2xl font-serif font-bold text-neutral-900">
                  Demande d'Étude Transmise !
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Merci <span className="font-bold text-neutral-900">{firstName}</span>. Votre simulation pour le lot <span className="font-bold text-neutral-900">{currentApartment.ref}</span> a été transmise à notre cellule commerciale dédiée.
                </p>
              </div>

              {/* Summary card */}
              {simulationResult && (
                <div className="bg-[#FAFAFA] rounded-xl p-5 border border-neutral-200 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Bien ciblé :</span>
                    <span className="font-bold text-neutral-900">{currentApartment.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Prix indicatif :</span>
                    <span className="font-mono font-bold text-neutral-900">{formatFCFA(currentApartment.price_fcfa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Mensualité estimée :</span>
                    <span className="font-mono font-bold text-emerald-700">{formatFCFA(simulationResult.monthly_payment)} / mois</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Durée indicative :</span>
                    <span className="font-bold text-neutral-900">{simulationResult.duration_years} ans</span>
                  </div>
                </div>
              )}

              {/* Direct WhatsApp Action with pre-filled context */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Accélérer mon dossier sur WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            /* STEP-BY-STEP PROGRESSIVE FLOW */
            <div className="space-y-6">
              {needsApartmentSelection ? (
                <div className="animate-in fade-in space-y-5">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Avant de commencer</span>
                    <h3 className="font-serif text-2xl font-bold text-neutral-900">Quel bien souhaitez-vous financer ?</h3>
                    <p className="text-sm text-neutral-500">Sélectionnez un appartement afin de calculer une estimation adaptée à son prix.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {availableApartments.map((apartment) => (
                      <button
                        key={apartment.id}
                        type="button"
                        onClick={() => selectApartmentForSimulation(apartment)}
                        className="group rounded-xl border border-neutral-200 bg-[#FAFAFA] p-4 text-left transition-all hover:border-emerald-500 hover:bg-emerald-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="font-mono text-[11px] font-bold text-emerald-700">{apartment.ref}</span>
                            <h4 className="mt-1 text-sm font-bold text-neutral-900 group-hover:text-emerald-900">{apartment.name}</h4>
                          </div>
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400 transition-transform group-hover:translate-x-1 group-hover:text-emerald-700" />
                        </div>
                        <p className="mt-3 font-mono text-base font-bold text-neutral-900">{formatFCFA(apartment.price_fcfa)}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
              
              {/* STEP 1: Pays de Résidence */}
              {step === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 1 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Où résidez-vous actuellement ?
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500">
                      Pour adapter les solutions de financement (résidents locaux ou diaspora internationale).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {countriesList.map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => {
                          setResidenceCountry(country);
                          if (country !== 'Autre') setStep(2);
                        }}
                        className={`p-4 rounded-xl border text-left font-semibold text-sm transition-all ${
                          residenceCountry === country
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200 bg-[#FAFAFA] hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>

                  {residenceCountry === 'Autre' && (
                    <div className="pt-2">
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">Précisez votre pays de résidence :</label>
                      <input
                        type="text"
                        value={customCountry}
                        onChange={(e) => setCustomCountry(e.target.value)}
                        placeholder="Ex: Sénégal, Gabon, Canada, etc."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-neutral-900 focus:outline-hidden text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Âge & Situation Pro */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 2 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Votre profil professionnel & âge
                    </h3>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                        Situation professionnelle principale :
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {['Cadre / Salarié CDI', 'Profession Libérale / Indépendant', 'Chef d\'Entreprise', 'Fonctionnaire', 'Autre'].map((stat) => (
                          <button
                            key={stat}
                            type="button"
                            onClick={() => setEmploymentStatus(stat)}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                              employmentStatus === stat
                                ? 'border-neutral-900 bg-neutral-900 text-white'
                                : 'border-neutral-200 bg-[#FAFAFA] hover:bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {stat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-semibold text-neutral-700">Votre âge :</label>
                        <span className="font-mono font-bold text-sm text-neutral-900">{age} ans</span>
                      </div>
                      <input
                        type="range"
                        min="22"
                        max="70"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full accent-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Revenus Mensuels Nets */}
              {step === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 3 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Vos revenus mensuels nets
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Revenus nets de votre foyer ou de l'emprunteur principal.
                    </p>
                  </div>

                  {/* Currency toggle */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-neutral-600 font-medium">Devise de saisie :</span>
                    <div className="inline-flex rounded-lg p-0.5 bg-neutral-100 border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => changeCurrency('EUR')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                          currency === 'EUR' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        Euros (€)
                      </button>
                      <button
                        type="button"
                        onClick={() => changeCurrency('FCFA')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                          currency === 'FCFA' ? 'bg-white shadow-2xs text-neutral-900' : 'text-neutral-500'
                        }`}
                      >
                        FCFA
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <label className="text-xs font-semibold text-neutral-700 block">Revenu net principal :</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={monthlyIncomeEUR}
                        onChange={(e) => setMonthlyIncomeEUR(e.target.value)}
                        placeholder="Saisissez votre revenu"
                        className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 font-mono text-xl font-bold text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-neutral-400">
                        {currency === 'EUR' ? '€ / mois' : 'FCFA / mois'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500">
                      Équivalence : {currency === 'EUR' 
                        ? formatFCFA(Number(monthlyIncomeEUR) * 656) + ' / mois' 
                        : formatEUR(Number(monthlyIncomeEUR)) + ' / mois'}
                    </p>

                    <div className="border-t border-neutral-100 pt-4 space-y-3">
                      <div className="relative">
                        <label className="mb-1.5 block text-xs font-semibold text-neutral-700">Revenus nets complémentaires mensuels <span className="font-normal text-neutral-400">(facultatif)</span> :</label>
                        <input
                          type="number"
                          min="0"
                          value={additionalMonthlyIncome}
                          onChange={(event) => setAdditionalMonthlyIncome(event.target.value)}
                          placeholder="Saisissez le revenu"
                          className="w-full rounded-xl border border-neutral-300 px-4 py-3 font-mono text-base font-bold text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                        />
                        <span className="absolute bottom-3.5 right-4 text-sm font-bold text-neutral-400">{currency === 'EUR' ? '€ / mois' : 'FCFA / mois'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Apport Personnel Disponible */}
              {step === 4 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 4 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Quel est votre apport personnel disponible ?
                    </h3>
                    <p className="text-xs text-neutral-500">
                      L'apport recommandé est de 10% à 30% du prix du bien ({formatFCFA(currentApartment.price_fcfa)}).
                    </p>
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={downPaymentEUR}
                        max={maximumDownPayment}
                        onChange={(e) => updateDownPayment(e.target.value)}
                        placeholder="Saisissez votre apport"
                        className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 font-mono text-xl font-bold text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-neutral-400">
                        {currency === 'EUR' ? '€ d\'apport' : 'FCFA d\'apport'}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {[10, 20, 50, 70].map((percentage) => {
                        const amountFCFA = Math.round(currentApartment.price_fcfa * percentage / 100);
                        const amount = currency === 'EUR' ? Math.round(amountFCFA / rateConversion) : amountFCFA;
                        return (
                          <button
                            key={percentage}
                            type="button"
                            onClick={() => updateDownPayment(String(amount))}
                            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-semibold text-neutral-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                          >
                            {percentage} %
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs text-neutral-500">L'apport ne peut pas dépasser le prix du bien.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: Crédits / Charges en cours */}
              {step === 5 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 5 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Vos charges ou crédits mensuels en cours
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Crédits immobiliers, crédits conso ou loyers résiduels. (Mettre 0 si aucune charge).
                    </p>
                  </div>

                  <div className="pt-2 space-y-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={existingLoansEUR}
                        onChange={(e) => setExistingLoansEUR(e.target.value)}
                        placeholder="Saisissez vos charges"
                        className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 font-mono text-xl font-bold text-neutral-900 focus:border-neutral-900 focus:outline-hidden"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-sm text-neutral-400">
                        {currency === 'EUR' ? '€ / mois' : 'FCFA / mois'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setExistingLoansEUR(0)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold"
                      >
                        Aucune charge en cours (0 {currency === 'EUR' ? '€' : 'FCFA'})
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Durée Souhaitée */}
              {step === 6 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Étape 6 sur {totalSteps}</span>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-neutral-900">
                      Durée de remboursement souhaitée
                    </h3>
                  </div>

                  <div className="pt-3 space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-neutral-700">Durée du financement :</span>
                      <span className="text-2xl font-bold font-mono text-emerald-700">{durationYears} ans ({durationYears * 12} mois)</span>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={durationYears}
                      onChange={(e) => setDurationYears(Number(e.target.value))}
                      className="w-full accent-neutral-900 h-2 bg-neutral-200 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-xs text-neutral-600 font-medium">
                      <span>5 ans</span>
                      <span>10 ans</span>
                      <span>15 ans</span>
                      <span>20 ans</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: RÉSULTAT INDICATIF & FORMULAIRE DE COLLECTE DU PROSPECT */}
              {step === 7 && simulationResult && (
                <div className="space-y-6 animate-in fade-in">
                  
                  {/* Results Summary Box */}
                  <div className="bg-[#FAFAFA] rounded-2xl p-5 sm:p-6 border border-neutral-200 space-y-5">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Synthèse de votre estimation
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {currentApartment.ref}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
                        <span className="text-[11px] text-neutral-500 block">Montant à financer</span>
                        <span className="text-base sm:text-lg font-bold font-mono text-neutral-900 block mt-0.5">
                          {formatFCFA(simulationResult.loan_amount)}
                        </span>
                        <span className="text-[10px] text-neutral-600">≈ {formatEUR(simulationResult.loan_amount)}</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs">
                        <span className="text-[11px] text-emerald-800 font-semibold block">Mensualité estimée</span>
                        <span className="text-base sm:text-lg font-bold font-mono text-emerald-800 block mt-0.5">
                          {formatFCFA(simulationResult.monthly_payment)} / mois
                        </span>
                        <span className="text-[10px] text-emerald-700">≈ {formatEUR(simulationResult.monthly_payment)} / mois</span>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
                        <span className="text-[11px] text-neutral-500 block">Taux d'endettement indicatif</span>
                        <span className={`text-base sm:text-lg font-bold font-mono block mt-0.5 ${
                          simulationResult.is_debt_ratio_healthy ? 'text-emerald-700' : 'text-amber-600'
                        }`}>
                          {simulationResult.debt_ratio_percent > 0 ? `${simulationResult.debt_ratio_percent}%` : 'À évaluer'}
                        </span>
                        <span className="text-[10px] text-neutral-600">Seuil bancaire ref: 33%</span>
                      </div>

                    </div>

                    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
                      <div className="flex flex-col gap-2 border-b border-neutral-100 pb-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="font-serif text-base font-bold text-neutral-900">Progression de votre financement</h4>
                          <p className="mt-0.5 text-[11px] text-neutral-500">Projection du capital emprunté sur {simulationResult.duration_years} ans.</p>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-neutral-600">
                          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-neutral-800" /> Restant dû</span>
                          <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-emerald-600" /> Capital remboursé</span>
                        </div>
                      </div>
                      <svg className="mt-4 h-40 w-full" viewBox="0 0 104 100" role="img" aria-label="Courbe d'amortissement du prêt">
                        {[18, 40, 62, 84].map((y) => <line key={y} x1="7" x2="97" y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="1.5 2" vectorEffect="non-scaling-stroke" />)}
                        <polyline points={outstandingLine} fill="none" stroke="#171717" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
                        <polyline points={repaidLine} fill="none" stroke="#059669" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
                        {amortizationData.map((item, index) => <circle key={item.year} cx={7 + (index / Math.max(1, amortizationData.length - 1)) * 90} cy={84 - (item.outstandingBalance / (simulationResult.loan_amount || 1)) * 66} r="1.15" fill="#171717" />)}
                        {amortizationData.map((item, index) => <text key={`year-${item.year}`} x={7 + (index / Math.max(1, amortizationData.length - 1)) * 90} y="96" textAnchor="middle" fontSize="3.2" fill="#737373">{item.year} an{item.year > 1 ? 's' : ''}</text>)}
                      </svg>
                      <div className="mt-1 flex flex-wrap justify-between gap-2 border-t border-neutral-100 pt-3 text-[11px] text-neutral-500">
                        <span>Capital emprunté : <strong className="font-mono text-neutral-800">{formatFCFA(simulationResult.loan_amount)}</strong></span>
                        <span>Restant dû à {simulationResult.duration_years} ans : <strong className="font-mono text-emerald-700">0 FCFA</strong></span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={downloadSimulation}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-xs font-bold text-neutral-800 transition-colors hover:border-emerald-600 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger ma simulation
                    </button>

                    {/* MANDATORY LEGAL DISCLAIMER - STRICTLY ENFORCED */}
                    <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
                      <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Avertissement légal : </span>
                        Ces informations nous permettent de réaliser une première estimation. 
                        Votre situation doit maintenant être étudiée par notre équipe afin de déterminer les solutions de financement pouvant correspondre à votre projet.
                      </div>
                    </div>
                  </div>

                  {/* Prospect Capture Form */}
                  <form onSubmit={handleFinalSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <h4 className="text-base font-serif font-bold text-neutral-900">
                        Recevoir mon étude personnalisée & être recontacté
                      </h4>
                      <p className="text-xs text-neutral-500">
                        Renseignez vos coordonnées pour qu'un conseiller financier NOEMA prépare votre dossier.
                      </p>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">Prénom *</label>
                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Ex: Jean-Marc"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">Nom</label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ex: Koffi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">Téléphone / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          value={phoneWhatsApp}
                          onChange={(e) => setPhoneWhatsApp(e.target.value)}
                          placeholder="+33 6 12 34 56 78 ou +225..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">Email *</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="votre.email@domaine.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-neutral-900 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    {/* RGPD & Marketing Consents */}
                    <div className="space-y-2 pt-1">
                      <label className="flex items-start gap-2 text-[11px] text-neutral-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentDataProcessing}
                          onChange={(e) => setConsentDataProcessing(e.target.checked)}
                          className="mt-0.5 rounded text-neutral-900 accent-neutral-900"
                        />
                        <span>
                          J'accepte que mes données soient traitées par la Résidence NOEMA pour l'étude de mon dossier de financement conformément à la politique de confidentialité (RGPD). *
                        </span>
                      </label>

                      <label className="flex items-start gap-2 text-[11px] text-neutral-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentMarketing}
                          onChange={(e) => setConsentMarketing(e.target.checked)}
                          className="mt-0.5 rounded text-neutral-900 accent-neutral-900"
                        />
                        <span>
                          J'accepte de recevoir les informations exclusives sur l'avancement du programme et les nouvelles disponibilités.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingLead ? (
                        <span>Transmission en cours...</span>
                      ) : (
                        <>
                          <span>FAIRE ÉTUDIER MON DOSSIER</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Navigation Buttons for Steps 1 to 6 */}
              {step < 7 && (
                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                  <button
                    type="button"
                    disabled={step === 1}
                    onClick={() => setStep((s) => Math.max(1, s - 1))}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:text-neutral-500"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.min(7, s + 1))}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-xs active:scale-98"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              )}
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
