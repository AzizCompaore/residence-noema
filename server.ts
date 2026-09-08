import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { 
  ResidenceInfo, 
  Apartment, 
  ConstructionMilestone, 
  FAQItem, 
  LeadRecord, 
  LeadSubmission, 
  SimulationResult 
} from './frontend/src/types';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env'), override: false });

const app = express();
const PORT = 3000;
const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000/api';
const DJANGO_BASE_URL = DJANGO_API_URL.replace(/\/api\/?$/, '');

app.use(express.json());

app.use('/admin', (req: Request, res: Response) => {
  res.redirect(`${DJANGO_BASE_URL}${req.originalUrl}`);
});

app.use('/api/auth', async (req: Request, res: Response) => {
  try {
    const target = `${DJANGO_API_URL}/auth${req.originalUrl.replace('/api/auth', '')}`;
    const headers: Record<string, string> = {};
    if (req.headers.cookie) headers.cookie = req.headers.cookie;
    if (req.headers['x-csrftoken']) headers['x-csrftoken'] = String(req.headers['x-csrftoken']);
    if (req.headers.host) headers['x-forwarded-host'] = req.headers.host;
    if (req.headers['x-forwarded-proto']) headers['x-forwarded-proto'] = String(req.headers['x-forwarded-proto']);
    else headers['x-forwarded-proto'] = req.protocol;
    if (req.method !== 'GET' && req.method !== 'HEAD') headers['content-type'] = 'application/json';

    const response = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : JSON.stringify(req.body || {}),
      redirect: 'manual'
    });
    const responseHeaders = response.headers as Headers & { getSetCookie?: () => string[] };
    const setCookies = responseHeaders.getSetCookie?.() || (responseHeaders.get('set-cookie') ? [responseHeaders.get('set-cookie') as string] : []);
    if (setCookies?.length) res.setHeader('set-cookie', setCookies);
    const location = response.headers.get('location');
    if (location) res.setHeader('location', location);
    res.status(response.status).send(await response.text());
  } catch {
    res.status(502).json({ error: 'Le service d’authentification est momentanément indisponible.' });
  }
});

async function getDjangoCollection<T>(resource: string): Promise<T[] | null> {
  try {
    const response = await fetch(`${DJANGO_API_URL}/${resource}/`);
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload) ? payload as T[] : null;
  } catch {
    return null;
  }
}

// In-Memory Database Store with Verified NOEMA Data (Syncable with Django Admin)
let residenceData: ResidenceInfo = {
  id: 'noema-angre-01',
  name: 'Résidence NOEMA',
  tagline: 'Programme Immobilier d\'Exception à Angré Djorogobité, Abidjan',
  city: 'Abidjan',
  district: 'Angré Djorogobité',
  country: 'Côte d\'Ivoire',
  description: 'Une signature architecturale unique à Angré Djorogobité : une élégante tour résidentielle R+7 de standing, dotée d\'aménagements contemporains haut de gamme, menuiseries premium et d\'une sécurité totale.',
  architectural_concept: 'Clarté géométrique épurée : façades blanches contemporaines, menuiseries haute performance, matériaux nobles et design minimaliste.',
  total_units: 30,
  floors: 'R+7 avec parking sécurisé au rez-de-chaussée',
  delivery_date_estimated: '30 mois',
  status: 'Chantier en cours — Structure & Gros Œuvre',
  hero_image: '/images/noema%20façade.png',
  whatsapp_number: '+2250789001122',
  phone_number: '+225 27 22 00 11 22',
  email_contact: 'contact@laresidencenoema.com',
  financing_partners: 'BHCI — partenariat VEFA confirmé. Autres banques à vérifier.',
  financing_notes: "Taux, apport minimum, durée de prêt et seuil d'endettement à confirmer.",
  indicative_interest_rate: 6.5,
  indicative_debt_ratio_limit: 33.0,
  address_details: 'Angré Djorogobité, à 5 min du Boulevard Latrille et à proximité des grands axes vers Cocody et le Plateau, Abidjan.',
  gps_coordinates: {
    lat: 5.399806,
    lng: -3.943556
  }
};

let apartmentsData: Apartment[] = [
  {
    id: 'apt-t2-noema',
    ref: 'NOEMA-T2-01',
    name: 'T2 étage courant',
    type: 't2',
    rooms_count: 2,
    bedrooms_count: 1,
    bathrooms_count: 1,
    surface_sqm: 50.01,
    balcony_surface_sqm: 0,
    floor: 'RDC à R+2, selon lot',
    price_fcfa: 59000000,
    price_launch_fcfa: 59000000,
    price_structure_fcfa: 65000000,
    price_closed_fcfa: 69000000,
    status: 'available',
    description: "T2 de 50,01 m² comprenant séjour et coin repas, cuisine, buanderie, dégagement, toilette et chambre avec salle d'eau. Lot sans balcon.",
    key_features: [
      'Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau', 'Aucun balcon'
    ],
    composition: ['Séjour + coin repas', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '1 chambre', '1 salle d’eau chambre'],
    photos: [
      '/images/Dossier T2/Rendus salon F2 modifié/Salon 1.png',
      '/images/Dossier T2/Rendus F2/Chambre 1.png',
      '/images/Dossier T2/Rendus F2/Cuisine 1.png',
      '/images/Dossier T2/Rendus F2/Douche.png',
      '/images/Dossier T2/Rendus F2/Entrée.png'
    ],
    display_order: 1,
    is_featured: true
  },
  {
    id: 'apt-t3-noema',
    ref: 'NOEMA-T3-01',
    name: 'T3 étage courant',
    type: 't3',
    rooms_count: 3,
    bedrooms_count: 2,
    bathrooms_count: 2,
    surface_sqm: 100.10,
    balcony_surface_sqm: 4.56,
    floor: 'RDC à R+2, selon lot',
    price_fcfa: 109000000,
    price_launch_fcfa: 109000000,
    price_structure_fcfa: 115000000,
    price_closed_fcfa: 129000000,
    status: 'available',
    description: "T3 de 100,10 m² comprenant séjour et coin repas, balcon de 4,56 m², cuisine, buanderie, dégagement, toilette et deux chambres avec salle d'eau privative.",
    key_features: [
      'Séjour + coin repas', 'Balcon de 4,56 m²', 'Cuisine et buanderie', '2 chambres avec salle d’eau'
    ],
    composition: ['Séjour + coin repas', 'Balcon', 'Cuisine', 'Buanderie', 'Dégagement', 'Toilette', '2 chambres avec salle d’eau chacune'],
    photos: [
      '/images/Dossier T3/Salon F3 modifié/Salon 1.png',
      "/images/Dossier T3/Rendus F3'/Chambre Master 1 F3'.png",
      "/images/Dossier T3/Rendus F3'/Cuisine 1.png",
      "/images/Dossier T3/Rendus F3'/Douche Suite Master 1 F3'.png",
      '/images/Dossier T3/Salon F3 modifié/Couloir d’entrée.png'
    ],
    display_order: 2,
    is_featured: true
  }
];

let constructionMilestones: ConstructionMilestone[] = [
  {
    id: 'milestone-1',
    stage_number: 1,
    title: 'Études géotechniques, permis & Fondations spéciales',
    description: 'Validation des sondages de sol, obtention intégrale du Permis de Construire officiel et réalisation des pieux forés en béton armé.',
    status: 'completed',
    progress_percent: 100,
    date_display: 'T1 2024 - Achevé',
    is_3d_render: false
  },
  {
    id: 'milestone-2',
    stage_number: 2,
    title: 'Élévation de la structure Gros Œuvre (R+7)',
    description: 'Coulage des dalles et poteaux jusqu\'au 8ème niveau. Respect strict des normes parasismiques et contrôles hebdomadaires de laboratoire agréé.',
    status: 'in_progress',
    progress_percent: 75,
    date_display: 'En cours — 2025',
    photo: '/images/noema-construction.jpg',
    is_3d_render: false
  },
  {
    id: 'milestone-3',
    stage_number: 3,
    title: 'Maçonnerie, Cloisons & Réseaux techniques',
    description: 'Pose des briques, gainage électrique, plomberie multicouche, pré-câblage fibre optique et climatisation.',
    status: 'upcoming',
    progress_percent: 15,
    date_display: 'Fin 2025',
    is_3d_render: false
  },
  {
    id: 'milestone-4',
    stage_number: 4,
    title: 'Façades épurées, Menuiseries & Finitions',
    description: 'Enduits extérieurs étanches haute durabilité, baies vitrées aluminium double vitrage et finitions premium haut de gamme.',
    status: 'upcoming',
    progress_percent: 0,
    date_display: 'T2 2026',
    is_3d_render: true
  },
  {
    id: 'milestone-5',
    stage_number: 5,
    title: 'Finitions intérieures & Livraison prévisionnelle',
    description: 'Carrelages grand format, sanitaires suspendus, menuiseries intérieures, essais d\'équipements et remise solennelle des clés aux acquéreurs.',
    status: 'upcoming',
    progress_percent: 0,
    date_display: 'T4 2026',
    is_3d_render: true
  }
];

let faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'projet',
    question: 'Où se situe exactement la Résidence NOEMA à Abidjan ?',
    answer: 'La Résidence NOEMA est située au cœur du quartier résidentiel et prisé d\'Angré Djorogobité, dans la commune de Cocody à Abidjan. Elle bénéficie d\'un accès rapide aux grands axes (Boulevard Latrille, voie express Y4), aux écoles internationales, cliniques de référence et centres commerciaux.',
    display_order: 1,
    is_published: true
  },
  {
    id: 'faq-2',
    category: 'diaspora',
    question: 'Peut-on acheter un appartement en vivant à l\'étranger (France, Europe, USA, Canada) ?',
    answer: 'Absolument. Le programme NOEMA a été spécialement calibré pour la diaspora et les investisseurs internationaux. Grâce à l\'accompagnement ImmoDiaspo, l\'intégralité des démarches peut être réalisée à distance de manière 100% sécurisée : signature électronique notariée, webcam direct de suivi de chantier, paiements bancaires traçables et assistance juridique complète.',
    display_order: 2,
    is_published: true
  },
  {
    id: 'faq-3',
    category: 'financement',
    question: 'Quel apport personnel minimum faut-il prévoir pour réserver ?',
    answer: 'L\'apport personnel recommandé se situe généralement entre 10% et 30% du montant de l\'acquisition. Nous proposons des échelonnements de paiement calqués sur l\'avancement des travaux (VEFA standard) ainsi que des passerelles de financement bancaire avec nos partenaires.',
    display_order: 3,
    is_published: true
  },
  {
    id: 'faq-4',
    category: 'financement',
    question: 'Comment fonctionne le simulateur de financement sur le site ?',
    answer: 'Le simulateur calcule une estimation indicative de mensualité et d\'effort d\'épargne basée sur le prix de l\'appartement choisi, votre apport et vos revenus nets. Il ne constitue pas un accord bancaire ferme, mais permet à nos conseillers de préparer une étude personnalisée et sur-mesure pour votre dossier.',
    display_order: 4,
    is_published: true
  },
  {
    id: 'faq-5',
    category: 'reservation',
    question: 'Quelles sont les étapes officielles pour réserver un appartement ?',
    answer: '1. Sélection de votre typologie (T2 ou T3) et validation de la disponibilité.\n2. Étude financière et remise du contrat de réservation préliminaire.\n3. Dépôt de garantie séquestré sur compte notaire.\n4. Échelonnement des appels de fonds selon l\'avancement certifié des travaux.\n5. Réception et remise des clés avec titre foncier.',
    display_order: 5,
    is_published: true
  },
  {
    id: 'faq-6',
    category: 'chantier',
    question: 'Comment suivre l\'avancement du chantier en temps réel ?',
    answer: 'Chaque acquéreur dispose d\'un accès direct aux rapports d\'avancement photographiques et vidéos mensuels. Les étapes de gros œuvre et de finitions sont systématiquement auditées par un bureau de contrôle indépendant.',
    display_order: 6,
    is_published: true
  },
  {
    id: 'faq-7',
    category: 'chantier',
    question: 'Quand la livraison de la Résidence NOEMA est-elle prévue ?',
    answer: 'La durée réelle de livraison annoncée pour la Résidence NOEMA est de 30 mois. Le planning est suivi par la direction des travaux.',
    display_order: 7,
    is_published: true
  }
];

let leadsDatabase: LeadRecord[] = [];

// Seed an initial demo lead so CRM shows live pipeline
leadsDatabase.push({
  id: 'lead-init-01',
  first_name: 'Moussa',
  last_name: 'Konaté',
  phone_whatsapp: '+33 6 12 34 56 78',
  email: 'moussa.konate@example.com',
  residence_country: 'France (Paris)',
  age: 38,
  employment_status: 'cadre',
  monthly_net_income: 4200,
  down_payment: 25000,
  existing_monthly_loans: 450,
  desired_duration_years: 15,
  interested_apartment_id: 'apt-t2-noema',
  interested_apartment_ref: 'NOEMA-T2-01',
  interested_apartment_price: 42000000,
  pipeline_stage: 'meeting_scheduled',
  utm_source: 'instagram_diaspora',
  utm_medium: 'cpc',
  utm_campaign: 'diaspora_europe_t1',
  consent_marketing: true,
  consent_data_processing: true,
  notes: 'Intéressé par le 3 pièces Harmonie pour investissement locatif à Angré Djorogobité. Réside à Paris.',
  created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  updated_at: new Date().toISOString(),
  follow_up_count: 1
});

// Helper for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!geminiClient && apiKey && !/MY_GEMINI_API_KEY|your|YOUR|CHANGE/i.test(apiKey)) {
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return geminiClient;
}

async function generateGeminiReply(systemInstruction: string, history: Array<{ role?: string; content?: string }>, message: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || /MY_GEMINI_API_KEY|your|YOUR|CHANGE/i.test(apiKey)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const contents = [
      ...history.slice(-8).map((item) => ({
        role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
        parts: [{ text: String(item.content || '') }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 700,
          thinkingConfig: { thinkingBudget: 0 }
        }
      }),
      signal: controller.signal
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini REST request failed with status ${response.status}: ${errorText.slice(0, 500)}`);
      return null;
    }
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('').trim() || null;
  } catch (error) {
    console.error('Gemini REST request failed:', error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ----------------------------------------------------
// REST API ENDPOINTS
// ----------------------------------------------------

// 1. Residence Details
app.get('/api/residence', async (req: Request, res: Response) => {
  const residences = await getDjangoCollection<any>('residence');
  const residence = residences?.[0];
  const data = residence ? {
    ...residenceData,
    ...residence,
    hero_image: residence.hero_image || residenceData.hero_image,
    gps_coordinates: { lat: Number(residence.latitude), lng: Number(residence.longitude) }
  } : residenceData;
  res.json({
    success: true,
    data
  });
});

// 2. Apartments List & Filters
app.get('/api/apartments', async (req: Request, res: Response) => {
  const { type, status } = req.query;
  const djangoApartments = await getDjangoCollection<any>('apartments');
  const publishedApartments: Apartment[] = djangoApartments?.length ? djangoApartments.map((apartment) => ({
    id: String(apartment.id),
    ref: apartment.reference,
    name: apartment.name,
    type: apartment.apartment_type,
    commercial_segment: apartment.commercial_segment,
    is_public: apartment.is_public,
    rooms_count: apartment.rooms_count,
    bedrooms_count: apartment.bedrooms_count,
    bathrooms_count: apartment.bathrooms_count,
    surface_sqm: apartment.surface_sqm,
    balcony_surface_sqm: apartment.balcony_surface_sqm,
    floor: apartment.floor,
    price_fcfa: Number(apartment.price_fcfa),
    price_launch_fcfa: apartment.price_launch_fcfa ? Number(apartment.price_launch_fcfa) : null,
    price_structure_fcfa: apartment.price_structure_fcfa ? Number(apartment.price_structure_fcfa) : null,
    price_closed_fcfa: apartment.price_closed_fcfa ? Number(apartment.price_closed_fcfa) : null,
    status: apartment.status,
    description: apartment.description,
    key_features: apartment.key_features || [],
    composition: apartment.composition || [],
    parking_notes: apartment.parking_notes || '',
    orientation_notes: apartment.orientation_notes || '',
    view_notes: apartment.view_notes || '',
    photos: apartment.photos || [],
    floor_plan_image: apartment.floor_plan_image || undefined,
    display_order: apartment.display_order,
    is_featured: apartment.is_featured
  })) : apartmentsData;
  let filtered = [...publishedApartments];

  if (type && type !== 'all') {
    filtered = filtered.filter(a => a.type === type);
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(a => a.status === status);
  }

  // Sort by display order
  filtered.sort((a, b) => a.display_order - b.display_order);

  res.json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// 3. Single Apartment by ID
app.get('/api/apartments/:id', async (req: Request, res: Response) => {
  const djangoApartments = await getDjangoCollection<any>('apartments');
  const publishedApartments: Apartment[] = djangoApartments?.length ? djangoApartments.map((apartment) => ({
    id: String(apartment.id), ref: apartment.reference, name: apartment.name, type: apartment.apartment_type,
    commercial_segment: apartment.commercial_segment, is_public: apartment.is_public,
    rooms_count: apartment.rooms_count, bedrooms_count: apartment.bedrooms_count, bathrooms_count: apartment.bathrooms_count,
    surface_sqm: apartment.surface_sqm, balcony_surface_sqm: apartment.balcony_surface_sqm, floor: apartment.floor,
    price_fcfa: Number(apartment.price_fcfa),
    price_launch_fcfa: apartment.price_launch_fcfa ? Number(apartment.price_launch_fcfa) : null,
    price_structure_fcfa: apartment.price_structure_fcfa ? Number(apartment.price_structure_fcfa) : null,
    price_closed_fcfa: apartment.price_closed_fcfa ? Number(apartment.price_closed_fcfa) : null,
    status: apartment.status, description: apartment.description,
    key_features: apartment.key_features || [], photos: apartment.photos || [], floor_plan_image: apartment.floor_plan_image || undefined,
    composition: apartment.composition || [], parking_notes: apartment.parking_notes || '',
    orientation_notes: apartment.orientation_notes || '', view_notes: apartment.view_notes || '',
    display_order: apartment.display_order, is_featured: apartment.is_featured
  })) : apartmentsData;
  const apartment = publishedApartments.find(a => a.id === req.params.id || a.ref === req.params.id);
  if (!apartment) {
    res.status(404).json({ success: false, error: 'Appartement non trouvé' });
    return;
  }
  res.json({
    success: true,
    data: apartment
  });
});

// 4. Construction Timeline & Proof of progress
app.get('/api/construction', async (req: Request, res: Response) => {
  const djangoMilestones = await getDjangoCollection<any>('construction');
  const publishedMilestones: ConstructionMilestone[] = djangoMilestones?.length ? djangoMilestones.map((milestone) => ({
    id: String(milestone.id), stage_number: milestone.stage_number, title: milestone.title, description: milestone.description,
    status: milestone.status, progress_percent: milestone.progress_percent, date_display: milestone.date_display,
    photo: milestone.photo || undefined, is_3d_render: milestone.is_3d_render, video_url: milestone.video_url || undefined
  })) : constructionMilestones;
  const sorted = [...publishedMilestones].sort((a, b) => a.stage_number - b.stage_number);
  res.json({
    success: true,
    data: sorted
  });
});

// 5. FAQ Items
app.get('/api/faq', async (req: Request, res: Response) => {
  const { category } = req.query;
  const djangoFaqItems = await getDjangoCollection<any>('faq');
  const publishedFaqItems: FAQItem[] = djangoFaqItems?.length ? djangoFaqItems.map((item) => ({
    id: String(item.id), category: item.category, question: item.question, answer: item.answer,
    display_order: item.display_order, is_published: item.is_published
  })) : faqItems;
  let list = publishedFaqItems.filter(f => f.is_published);
  if (category && category !== 'all') {
    list = list.filter(f => f.category === category);
  }
  list.sort((a, b) => a.display_order - b.display_order);
  res.json({
    success: true,
    data: list
  });
});

// 6. Financial Simulation Calculation Endpoint
app.post('/api/simulations/calculate', (req: Request, res: Response) => {
  try {
    const {
      apartment_id,
      apartment_price,
      down_payment = 0,
      duration_years = 15,
      monthly_net_income = 0,
      existing_monthly_loans = 0,
      additional_monthly_income = 0,
      co_borrower_monthly_income = 0,
      interest_rate = residenceData.indicative_interest_rate
    } = req.body;

    const apt = apartmentsData.find(a => a.id === apartment_id);
    const finalPrice = apt ? apt.price_fcfa : (Number(apartment_price) || 59000000);
    const downPayment = Math.min(finalPrice, Math.max(0, Number(down_payment) || 0));
    const loanAmount = Math.max(0, finalPrice - downPayment);

    // Standard Amortization Formula: M = P * [ r*(1+r)^n ] / [ (1+r)^n - 1 ]
    const annualRateDecimal = (Number(interest_rate) || 6.5) / 100;
    const monthlyRate = annualRateDecimal / 12;
    const totalMonths = (Number(duration_years) || 15) * 12;

    let monthlyPayment = 0;
    if (loanAmount > 0) {
      if (monthlyRate > 0) {
        monthlyPayment = Math.round(
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1)
        );
      } else {
        monthlyPayment = Math.round(loanAmount / totalMonths);
      }
    }

    const income = Math.max(0, Number(monthly_net_income) || 0)
      + Math.max(0, Number(additional_monthly_income) || 0)
      + Math.max(0, Number(co_borrower_monthly_income) || 0);
    const existingLoans = Number(existing_monthly_loans) || 0;
    const availableMonthlyIncome = Math.max(0, income - existingLoans);
    const recommendedMonthlyBudget = Math.round(availableMonthlyIncome * residenceData.indicative_debt_ratio_limit / 100);
    const loanToValuePercent = finalPrice > 0 ? Math.round((loanAmount / finalPrice) * 100) : 0;
    const totalMonthlyCommitment = monthlyPayment + existingLoans;
    
    let debtRatioPercent = 0;
    if (income > 0) {
      debtRatioPercent = Math.round((totalMonthlyCommitment / income) * 100 * 10) / 10;
    }

    const isDebtRatioHealthy = debtRatioPercent > 0 
      ? debtRatioPercent <= residenceData.indicative_debt_ratio_limit 
      : true;

    const result: SimulationResult = {
      apartment_id: apt?.id,
      apartment_ref: apt?.ref,
      apartment_price: finalPrice,
      down_payment: downPayment,
      loan_amount: loanAmount,
      duration_years: Number(duration_years),
      interest_rate: Number(interest_rate),
      monthly_payment: monthlyPayment,
      monthly_income: income,
      existing_loans: existingLoans,
      available_monthly_income: availableMonthlyIncome,
      recommended_monthly_budget: recommendedMonthlyBudget,
      loan_to_value_percent: loanToValuePercent,
      debt_ratio_percent: debtRatioPercent,
      is_debt_ratio_healthy: isDebtRatioHealthy
    };

    res.json({
      success: true,
      data: result,
      legal_disclaimer: 'Ces informations nous permettent de réaliser une première estimation. Votre situation doit maintenant être étudiée par notre équipe afin de déterminer les solutions de financement pouvant correspondre à votre projet.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors du calcul de simulation' });
  }
});

// 7. Lead Capture & CRM Pipeline Integration (Deduplication by phone/email)
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const payload: LeadSubmission = req.body;

    if (!payload.first_name || !payload.email || !payload.phone_whatsapp) {
      res.status(400).json({
        success: false,
        error: 'Prénom, email et numéro WhatsApp sont obligatoires.'
      });
      return;
    }

    // Check for existing lead by email or phone (Deduplication requirement)
    const existingIndex = leadsDatabase.findIndex(
      l => (payload.email && l.email.toLowerCase() === payload.email.toLowerCase()) ||
           (payload.phone_whatsapp && l.phone_whatsapp.replace(/\D/g, '') === payload.phone_whatsapp.replace(/\D/g, ''))
    );

    let record: LeadRecord;
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing lead record
      const existing = leadsDatabase[existingIndex];
      record = {
        ...existing,
        ...payload,
        id: existing.id,
        pipeline_stage: existing.pipeline_stage === 'new' ? 'qualified' : existing.pipeline_stage,
        updated_at: now,
        follow_up_count: (existing.follow_up_count || 0) + 1,
        notes: payload.notes 
          ? `${existing.notes || ''}\n[Update ${new Date().toLocaleDateString('fr-FR')}]: ${payload.notes}`
          : existing.notes
      };
      leadsDatabase[existingIndex] = record;
    } else {
      // Determine initial stage based on qualification info
      const hasFinancialData = Boolean(payload.monthly_net_income || payload.down_payment || payload.simulation);
      const initialStage = hasFinancialData ? 'qualified' : 'new';

      record = {
        ...payload,
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        pipeline_stage: initialStage,
        created_at: now,
        updated_at: now,
        follow_up_count: 0
      };
      leadsDatabase.unshift(record);
    }

    res.status(201).json({
      success: true,
      message: 'Votre demande a été enregistrée avec succès. Notre équipe dédiée vous contactera dans les plus brefs délais.',
      data: {
        lead_id: record.id,
        pipeline_stage: record.pipeline_stage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur lors de l\'enregistrement du prospect' });
  }
});

app.post('/api/appointments', (req: Request, res: Response) => {
  const { first_name, last_name, email, phone_whatsapp, appointment_date, appointment_time, timezone } = req.body;
  const today = new Date();
  const todayValue = today.toISOString().slice(0, 10);
  const lastAvailableDate = new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  if (!first_name || !last_name || !email || !phone_whatsapp || !appointment_date || !appointment_time) {
    res.status(400).json({ success: false, error: 'Tous les champs du rendez-vous sont obligatoires.' });
    return;
  }
  const [appointmentHour, appointmentMinute] = String(appointment_time).split(':').map(Number);
  const isWorkingHour = Number.isInteger(appointmentHour) && Number.isInteger(appointmentMinute)
    && appointmentHour >= 9 && appointmentHour < 18
    && !(appointmentHour >= 12 && appointmentHour < 14);
  if (appointment_date < todayValue || appointment_date > lastAvailableDate || !isWorkingHour) {
    res.status(400).json({ success: false, error: 'Choisissez une date dans les 7 prochains jours et un créneau ouvré proposé.' });
    return;
  }

  const now = new Date().toISOString();
  const appointmentLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    first_name,
    last_name,
    email,
    phone_whatsapp,
    residence_country: 'Côte d’Ivoire',
    pipeline_stage: 'meeting_scheduled' as const,
    consent_marketing: false,
    consent_data_processing: true,
    notes: `Rendez-vous visio demandé le ${appointment_date} à ${appointment_time} (heure d’Abidjan, GMT).`,
    appointment_date,
    appointment_time,
    appointment_timezone: 'Africa/Abidjan',
    created_at: now,
    updated_at: now,
    follow_up_count: 0
  };

  leadsDatabase.unshift(appointmentLead);
  res.status(201).json({
    success: true,
    message: 'Votre demande de rendez-vous visio a été enregistrée.',
    data: { lead_id: appointmentLead.id, pipeline_stage: appointmentLead.pipeline_stage }
  });
});

// 8. CRM Leads List with Statistics (For internal preview & admin review)
app.get('/api/leads', (req: Request, res: Response) => {
  const { stage, source } = req.query;
  let list = [...leadsDatabase];

  if (stage && stage !== 'all') {
    list = list.filter(l => l.pipeline_stage === stage);
  }
  if (source && source !== 'all') {
    list = list.filter(l => l.utm_source === source);
  }

  // Summary metrics
  const stats = {
    total_leads: leadsDatabase.length,
    qualified_leads: leadsDatabase.filter(l => l.pipeline_stage === 'qualified' || l.pipeline_stage === 'meeting_scheduled' || l.pipeline_stage === 'file_review').length,
    meetings_scheduled: leadsDatabase.filter(l => l.pipeline_stage === 'meeting_scheduled').length,
    reservations: leadsDatabase.filter(l => l.pipeline_stage === 'reserved' || l.pipeline_stage === 'sold').length,
    sources: {} as Record<string, number>
  };

  leadsDatabase.forEach(l => {
    const src = l.utm_source || 'direct_web';
    stats.sources[src] = (stats.sources[src] || 0) + 1;
  });

  res.json({
    success: true,
    stats,
    data: list
  });
});

// 9. Update Lead Pipeline Stage
app.patch('/api/leads/:id/stage', (req: Request, res: Response) => {
  const { stage, notes } = req.body;
  const lead = leadsDatabase.find(l => l.id === req.params.id);

  if (!lead) {
    res.status(404).json({ success: false, error: 'Prospect non trouvé' });
    return;
  }

  lead.pipeline_stage = stage;
  lead.updated_at = new Date().toISOString();
  if (notes) {
    lead.notes = `${lead.notes || ''}\n[${new Date().toLocaleDateString('fr-FR')}]: ${notes}`;
  }

  res.json({
    success: true,
    data: lead
  });
});

// 10. Update Apartment (Django Admin simulation sync)
app.patch('/api/admin/apartment/:id', (req: Request, res: Response) => {
  const { price_fcfa, status, surface_sqm, is_featured } = req.body;
  const apt = apartmentsData.find(a => a.id === req.params.id);

  if (!apt) {
    res.status(404).json({ success: false, error: 'Appartement non trouvé' });
    return;
  }

  if (price_fcfa !== undefined) apt.price_fcfa = Number(price_fcfa);
  if (status !== undefined) apt.status = status;
  if (surface_sqm !== undefined) apt.surface_sqm = Number(surface_sqm);
  if (is_featured !== undefined) apt.is_featured = Boolean(is_featured);

  res.json({
    success: true,
    message: 'Appartement mis à jour avec succès.',
    data: apt
  });
});

// 11. AI Commercial Assistant Concierge ("INFORMER -> ORIENTER -> QUALIFIER -> CONVERTIR -> PASSER LA MAIN")
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  res.status(410).json({ success: false, error: 'Assistant IA désactivé.' });
  return;

  try {
    const { message, history = [], current_apartment_id } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message requis' });
      return;
    }

    const normalizedMessage = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (normalizedMessage.includes('etage') || normalizedMessage.includes('niveau') || normalizedMessage.includes('r+7') || normalizedMessage.includes('combien de niveaux')) {
      res.json({
        success: true,
        reply: 'La Résidence NOEMA est un bâtiment contemporain R+7, avec un rez-de-chaussée dédié notamment au stationnement. Le niveau exact de chaque appartement doit être confirmé lot par lot.',
        suggested_actions: [{ label: 'Voir les lots disponibles', actionType: 'select_apartment' }]
      });
      return;
    }

    const djangoApartments = await getDjangoCollection<any>('apartments');
    const catalogue: Apartment[] = djangoApartments?.length ? djangoApartments
      .filter((apartment) => apartment.is_public !== false)
      .map((apartment) => ({
        id: String(apartment.id),
        ref: apartment.reference,
        name: apartment.name,
        type: apartment.apartment_type,
        commercial_segment: apartment.commercial_segment,
        rooms_count: apartment.rooms_count,
        bedrooms_count: apartment.bedrooms_count,
        bathrooms_count: apartment.bathrooms_count,
        surface_sqm: Number(apartment.surface_sqm),
        balcony_surface_sqm: Number(apartment.balcony_surface_sqm),
        floor: apartment.floor,
        price_fcfa: Number(apartment.price_fcfa),
        price_launch_fcfa: apartment.price_launch_fcfa ? Number(apartment.price_launch_fcfa) : null,
        price_structure_fcfa: apartment.price_structure_fcfa ? Number(apartment.price_structure_fcfa) : null,
        price_closed_fcfa: apartment.price_closed_fcfa ? Number(apartment.price_closed_fcfa) : null,
        status: apartment.status,
        description: apartment.description,
        key_features: apartment.key_features || [],
        composition: apartment.composition || [],
        photos: apartment.photos || [],
        display_order: apartment.display_order,
        is_featured: apartment.is_featured
      })) : apartmentsData;
    const activeApt = catalogue.find(a => a.id === String(current_apartment_id) || a.ref === current_apartment_id);
    const residenceCollection = await getDjangoCollection<any>('residence');
    const residence = residenceCollection?.[0];
    const [constructionCollection, faqCollection] = await Promise.all([
      getDjangoCollection<any>('construction'),
      getDjangoCollection<any>('faq')
    ]);
    const catalogueFacts = catalogue.map((apartment) => [
      `${apartment.name} (${apartment.type.toUpperCase()}, ${apartment.surface_sqm.toLocaleString('fr-FR')} m²)`,
      `statut ${apartment.status}, sans balcon` + (apartment.balcony_surface_sqm > 0 ? ` / balcon ${apartment.balcony_surface_sqm.toLocaleString('fr-FR')} m²` : ''),
      `prix lancement ${apartment.price_launch_fcfa ? apartment.price_launch_fcfa.toLocaleString('fr-FR') : 'non renseigné'} FCFA`,
      `prix gros œuvre ${apartment.price_structure_fcfa ? apartment.price_structure_fcfa.toLocaleString('fr-FR') : 'non renseigné'} FCFA`,
      `prix hors d'eau-air ${apartment.price_closed_fcfa ? apartment.price_closed_fcfa.toLocaleString('fr-FR') : 'non renseigné'} FCFA`,
      `composition: ${(apartment.composition || []).join(', ')}`
    ].join(' | ')).join('\n');
    const constructionFacts = (constructionCollection || constructionMilestones).map((milestone: any) =>
      `${milestone.title}: ${milestone.description} (${milestone.status}, ${milestone.progress_percent || 0} %, ${milestone.date_display})`
    ).join('\n');
    const faqFacts = (faqCollection || faqItems).map((item: any) => `Question: ${item.question}\nRéponse: ${item.answer}`).join('\n');

    // Build the prompt from the back-office catalogue so the assistant stays current.
    const contextPrompt = `
Tu es l'assistant commercial officiel et conseiller immobilier de la RÉSIDENCE NOEMA à Angré Djorogobité, Abidjan (programme développé avec ImmoDiaspo / Uriel Group).

RÈGLES COMMERCIALES STRICTES :
1. Rôle : INFORMER -> ORIENTER -> QUALIFIER -> CONVERTIR -> PASSER LA MAIN À L'HUMAIN / WHATSAPP.
2. Ton : Chaleureux, élégant, courtois, hautement professionnel, rassurant.
3. Données réelles vérifiées de NOEMA :
  - Localisation : ${residence?.district || 'Angré Djorogobité'}, ${residence?.city || 'Abidjan'}, ${residence?.country || "Côte d'Ivoire"}.
  - Livraison annoncée : ${residence?.delivery_date_estimated || '30 mois'}.
  - Banques partenaires : ${residence?.financing_partners || 'BHCI — partenariat VEFA confirmé. Autres banques à vérifier.'}
  - Taux, apport minimum, durée de prêt et seuil d'endettement : ${residence?.financing_notes || 'à confirmer'}
  - Lots actuellement publiés :
${catalogueFacts}
  - Avancement communiqué :
${constructionFacts}
  - Questions fréquentes validées :
${faqFacts}
  - Diaspora : accompagnement à distance, sous réserve de confirmation des modalités par un conseiller.
4. INTERDICTIONS ABSOLUES :
   - NE JAMAIS dire qu'un crédit ou financement est accepté ou garanti.
   - NE JAMAIS inventer un chiffre ou un rendement financier arbitraire.
   - Proposer toujours de lancer une simulation indicative ou de poursuivre l'échange directement avec un conseiller via WhatsApp.
`;

    const promptWithContext = `${activeApt ? `[Lot consulté: ${activeApt.name} (${activeApt.ref})]\n` : ''}${message}`;
    const generatedReply = await generateGeminiReply(contextPrompt, history, promptWithContext);
    if (generatedReply) {
      res.json({
        success: true,
        reply: generatedReply,
        suggested_actions: [
          { label: 'Découvrir les appartements', actionType: 'select_apartment' },
          { label: 'Simuler mon financement', actionType: 'open_simulator' },
          { label: 'Parler à un conseiller WhatsApp', actionType: 'open_whatsapp' }
        ]
      });
      return;
    }

    // Accurate fallback when Gemini is unavailable; it uses the same live catalogue.
    const lower = message.toLowerCase();
    let reply = '';
    const suggested_actions: any[] = [];
    const formatPrice = (value?: number | null) => value ? `${value.toLocaleString('fr-FR')} FCFA` : 'à confirmer';
    const describeApartment = (apartment: Apartment) => {
      const balcony = apartment.balcony_surface_sqm > 0
        ? `avec un balcon de ${apartment.balcony_surface_sqm.toLocaleString('fr-FR')} m²`
        : 'sans balcon';
      const composition = apartment.composition?.length
        ? apartment.composition.join(', ')
        : apartment.description;
      return `${apartment.name} fait ${apartment.surface_sqm.toLocaleString('fr-FR')} m², ${balcony}. Composition : ${composition}. Prix : lancement ${formatPrice(apartment.price_launch_fcfa)}, gros œuvre ${formatPrice(apartment.price_structure_fcfa)}, hors d'eau-air ${formatPrice(apartment.price_closed_fcfa)}.`;
    };
    const requestedApartment = activeApt || catalogue.find((apartment) => {
      const searchable = `${apartment.name} ${apartment.type} ${apartment.ref}`.toLowerCase();
      return searchable.includes('t2') && lower.includes('t2') || searchable.includes('t3') && lower.includes('t3');
    });
    const isCatalogueRequest = lower.includes('lot') || lower.includes('lots') || lower.includes('appartement') || lower.includes('typologie') || lower.includes('disponib') || lower.includes('présente') || lower.includes('présent') || lower.includes('montre');

    if (requestedApartment && (lower.includes('composition') || lower.includes('surface') || lower.includes('balcon') || lower.includes('pièce') || lower.includes('prix') || lower.includes('tarif') || lower.includes('coût'))) {
      reply = describeApartment(requestedApartment);
      suggested_actions.push({ label: 'Voir la fiche du lot', actionType: 'select_apartment', payload: requestedApartment.id });
      suggested_actions.push({ label: 'Simuler ce bien', actionType: 'open_simulator', payload: requestedApartment.id });
    } else if (isCatalogueRequest) {
      reply = `Voici les lots actuellement commercialisés à la Résidence NOEMA :\n\n${catalogue.map((apartment) => `• ${describeApartment(apartment)}`).join('\n\n')}\n\nLes étages, orientations, vues et le nombre de places de parking sont à confirmer lot par lot.`;
      suggested_actions.push({ label: 'Voir les appartements', actionType: 'select_apartment' });
      suggested_actions.push({ label: 'Simuler mon financement', actionType: 'open_simulator' });
    } else if (lower.includes('étage') || lower.includes('niveau') || lower.includes('r+7') || lower.includes('combien de niveaux')) {
      reply = `La Résidence NOEMA est un bâtiment contemporain R+7, avec un rez-de-chaussée dédié notamment au stationnement. Les lots sont répartis selon les étages et le niveau exact de chaque appartement doit être confirmé lot par lot.`;
      suggested_actions.push({ label: 'Voir les lots disponibles', actionType: 'select_apartment' });
    } else if (lower.includes('famille') || lower.includes('familial') || lower.includes('confort') || lower.includes('équipement') || lower.includes('ascenseur') || lower.includes('sécurité')) {
      const familyApartment = catalogue.find((apartment) => apartment.type === 't3') || catalogue[0];
      reply = familyApartment ? `Pour une famille, le ${describeApartment(familyApartment)} La résidence prévoit aussi un ascenseur sécurisé et des espaces communs contemporains. Les détails d'orientation, de vue et de stationnement sont à confirmer avec le conseiller.` : `Le catalogue public est en cours de mise à jour. Un conseiller peut vous orienter vers le lot le plus adapté à votre famille.`;
      suggested_actions.push({ label: 'Voir le T3', actionType: 'select_apartment', payload: familyApartment?.id });
      suggested_actions.push({ label: 'Simuler mon financement', actionType: 'open_simulator' });
    } else if ((lower.includes('prix') || lower.includes('combien') || lower.includes('tarif') || lower.includes('coût')) && !lower.includes('parking') && !lower.includes('stationnement') && !lower.includes('place')) {
      reply = `Le catalogue actuel comprend ${catalogue.map((apartment) => `${apartment.name} à partir de ${apartment.price_fcfa.toLocaleString('fr-FR')} FCFA`).join(' et ')}. Les prix varient selon la phase du chantier. Souhaitez-vous consulter une fiche ou lancer une simulation ?`;
      suggested_actions.push({ label: 'Voir les typologies', actionType: 'select_apartment' });
      suggested_actions.push({ label: 'Simuler mes mensualités', actionType: 'open_simulator' });
    } else if (lower.includes('financement') || lower.includes('banque') || lower.includes('apport') || lower.includes('prêt') || lower.includes('crédit') || lower.includes('simuler')) {
      reply = `Nous vous accompagnons dans le montage financier de votre acquisition, que vous résidiez en Côte d'Ivoire ou à l'étranger. Le simulateur de la Résidence NOEMA vous permet d'estimer vos mensualités en quelques clics à partir de votre apport et durée souhaitée.`;
      suggested_actions.push({ label: 'Ouvrir le simulateur', actionType: 'open_simulator' });
      suggested_actions.push({ label: 'Échanger sur WhatsApp', actionType: 'open_whatsapp' });
    } else if (lower.includes('étranger') || lower.includes('diaspora') || lower.includes('france') || lower.includes('distance') || lower.includes('paris')) {
      reply = `Un accompagnement à distance est prévu pour les acquéreurs de la diaspora, avec les modalités juridiques et bancaires à confirmer par notre équipe. La BHCI est partenaire du montage VEFA. Je peux vous orienter vers un conseiller ou le simulateur.`;
      suggested_actions.push({ label: 'Faire étudier mon dossier', actionType: 'open_simulator' });
      suggested_actions.push({ label: 'Contacter un conseiller', actionType: 'open_whatsapp' });
    } else if (lower.includes('penthouse') || lower.includes('t7') || lower.includes('grand appartement')) {
      reply = `La résidence comprend trois lots penthouse (un T2, un T3 et un T7). Ils sont conservés par la maîtrise d’ouvrage et ne sont pas commercialisés sur le site. Le T7 de 321,08 m² est réservé à la promotrice.`;
      suggested_actions.push({ label: 'Voir les lots commercialisés', actionType: 'select_apartment' });
    } else if (lower.includes('parking') || lower.includes('stationnement') || lower.includes('place')) {
      reply = `Le rez-de-chaussée comprend trois zones de stationnement : Parking 1 et Parking 2 de 42,68 m² chacun, ainsi qu’un Parking 3 de 21,10 m². Le nombre exact de places incluses par lot et leur attribution doivent encore être confirmés.`;
      suggested_actions.push({ label: 'Parler à un conseiller', actionType: 'open_whatsapp' });
    } else if (lower.includes('contact') || lower.includes('téléphone') || lower.includes('whatsapp') || lower.includes('email') || lower.includes('mail')) {
      reply = `Pour obtenir une réponse commerciale personnalisée, utilisez le bouton WhatsApp du site ou demandez à être mis en relation avec un conseiller. Le numéro et l’adresse e-mail commerciaux doivent être confirmés avant publication définitive.`;
      suggested_actions.push({ label: 'Parler à un humain', actionType: 'open_whatsapp' });
    } else if (lower.includes('combien de pièce') || lower.includes('nombre de pièce') || lower.includes('chambre')) {
      reply = `Le catalogue public comprend un T2 avec 1 chambre et un T3 avec 2 chambres, chacune avec sa salle d’eau pour le T3. Les lots penthouse sont internes et non commercialisés.`;
      suggested_actions.push({ label: 'Voir les lots', actionType: 'select_apartment' });
    } else if (lower.includes('où') || lower.includes('situe') || lower.includes('localisation') || lower.includes('adresse') || lower.includes('quartier') || lower.includes('angré') || lower.includes('cocody')) {
      reply = `La Résidence NOEMA se situe à Angré Djorogobité, dans la commune de Cocody à Abidjan, en Côte d’Ivoire. Elle est proche du Boulevard Latrille et des principaux commerces et établissements du quartier. Pour une adresse exacte ou une visite, je peux vous mettre en relation avec un conseiller commercial.`;
      suggested_actions.push({ label: 'Prendre rendez-vous', actionType: 'book_call' });
      suggested_actions.push({ label: 'Échanger sur WhatsApp', actionType: 'open_whatsapp' });
    } else if (lower.includes('chantier') || lower.includes('avancement') || lower.includes('livraison') || lower.includes('date') || lower.includes('quand')) {
      reply = `Le chantier de la Résidence NOEMA est actuellement en cours (élévation du gros œuvre R+7). La livraison est annoncée sous 30 mois avec un suivi rigoureux des normes techniques.`;
      suggested_actions.push({ label: 'Voir les photos du chantier', actionType: 'select_apartment' });
    } else {
      reply = `Bienvenue à la Résidence NOEMA à Angré Djorogobité, Abidjan. Je peux vous présenter les lots T2 et T3 actuellement publiés, leurs compositions et leurs prix par phase, ou vous orienter vers le simulateur et un conseiller commercial.`;
      suggested_actions.push({ label: 'Découvrir les appartements', actionType: 'select_apartment' });
      suggested_actions.push({ label: 'Étudier mon financement', actionType: 'open_simulator' });
      suggested_actions.push({ label: 'Échanger sur WhatsApp', actionType: 'open_whatsapp' });
    }

    res.json({
      success: true,
      reply,
      suggested_actions
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Erreur assistant IA' });
  }
});

// ----------------------------------------------------
// CODE EXPORT / ZIP DOWNLOAD ROUTE
// ----------------------------------------------------
app.get('/api/download-zip', (req: Request, res: Response) => {
  const zipPath = path.join(process.cwd(), 'frontend', 'public', 'noema-residence-code-complet.zip');
  res.download(zipPath, 'noema-residence-code-complet.zip', (err) => {
    if (err) {
      console.error('Error sending zip:', err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Fichier ZIP non trouvé ou en cours de génération' });
      }
    }
  });
});

// ----------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: path.join(process.cwd(), 'frontend'),
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'frontend', 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Résidence NOEMA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
