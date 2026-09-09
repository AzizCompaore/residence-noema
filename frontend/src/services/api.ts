import { 
  ResidenceInfo, 
  Apartment, 
  ConstructionMilestone, 
  FAQItem, 
  LeadSubmission, 
  SimulationResult 
} from '../types';

export const API_BASE = '/api';

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

interface AuthResponse {
  success?: boolean;
  authenticated?: boolean;
  user?: AuthUser | null;
  error?: string;
  message?: string;
}

function getCookie(name: string): string | undefined {
  return document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`))?.split('=').slice(1).join('=');
}

export async function ensureCsrfToken(): Promise<void> {
  await fetch(`${API_BASE}/auth/csrf/`, { credentials: 'include' });
}

async function authRequest(path: string, options: RequestInit = {}): Promise<AuthResponse> {
  await ensureCsrfToken();
  const csrfToken = getCookie('csrftoken');
  const response = await fetch(`${API_BASE}/auth/${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || 'Une erreur est survenue.');
  return payload;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${API_BASE}/auth/me/`, { credentials: 'include' });
  const payload = await response.json() as AuthResponse;
  return payload.authenticated ? payload.user || null : null;
}

export async function loginUser(email: string, password: string, rememberMe: boolean): Promise<AuthUser> {
  const payload = await authRequest('login/', { method: 'POST', body: JSON.stringify({ email, password, remember_me: rememberMe }) });
  return payload.user as AuthUser;
}

export async function registerUser(payload: { first_name: string; last_name: string; email: string; password: string }): Promise<AuthUser> {
  const response = await authRequest('register/', { method: 'POST', body: JSON.stringify(payload) });
  return response.user as AuthUser;
}

export async function logoutUser(): Promise<void> {
  await authRequest('logout/', { method: 'POST' });
}

export async function requestPasswordReset(email: string): Promise<string> {
  const response = await authRequest('password-reset/request/', { method: 'POST', body: JSON.stringify({ email }) });
  return response.message || 'Si cette adresse existe, un lien sera envoyé.';
}

export async function confirmPasswordReset(uid: string, token: string, password: string): Promise<void> {
  await authRequest('password-reset/confirm/', { method: 'POST', body: JSON.stringify({ uid, token, password }) });
}

export async function startGoogleLogin(): Promise<void> {
  await ensureCsrfToken();
  const response = await fetch(`${API_BASE}/auth/google/start/`, { credentials: 'include' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'La connexion Google est indisponible.');
  window.location.assign(payload.url);
}

const fallbackResidence: ResidenceInfo = {
  id: 'residence-noema',
  name: 'Résidence NOEMA',
  tagline: 'Vivre Angré Djorogobité',
  city: 'Abidjan',
  district: 'Angré Djorogobité',
  country: 'Côte d’Ivoire',
  description: 'Une résidence résidentielle de qualité, pensée pour la diaspora, la famille et les investisseurs.',
  architectural_concept: 'Une résidence moderne, sécurisée et connectée à la vie d’Angré Djorogobité.',
  total_units: 80,
  floors: 'R+7',
  delivery_date_estimated: '2029-02-09',
  status: 'En construction',
  hero_image: './images/photo actuel du chantier.jpeg',
  whatsapp_number: '+2250789001122',
  phone_number: '+2250789001122',
  email_contact: 'contact@noema.ci',
  financing_partners: 'Diaspora Immo',
  financing_notes: 'Financement adapté au projet immobilier.',
  indicative_interest_rate: 7.5,
  indicative_debt_ratio_limit: 33,
  address_details: 'Angré Djorogobité, Abidjan',
  gps_coordinates: { lat: 5.347, lng: -4.016 }
};

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
    price_launch_fcfa: 59000000,
    price_structure_fcfa: 65000000,
    price_closed_fcfa: 69000000,
    status: 'available',
    description: 'T2 de 50,01 m² comprenant séjour, cuisine, buanderie et chambre avec salle d’eau.',
    key_features: ['Séjour + coin repas', 'Cuisine et buanderie', '1 chambre avec salle d’eau', 'Aucun balcon'],
    photos: [
      './images/Dossier T2/Rendus F2/Salon 1.webp',
      './images/Dossier T2/Rendus F2/Salon 2.webp',
      './images/Dossier T2/Rendus F2/Cuisine 1.webp',
      './images/Dossier T2/Rendus F2/Chambre 1.webp'
    ],
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
    price_launch_fcfa: 109000000,
    price_structure_fcfa: 115000000,
    price_closed_fcfa: 129000000,
    status: 'available',
    description: 'T3 de 100,10 m² comprenant séjour, balcon, cuisine et deux chambres avec salle d’eau.',
    key_features: ['Séjour + coin repas', 'Balcon de 4,56 m²', 'Cuisine et buanderie', '2 chambres avec salle d’eau'],
    photos: [
      './images/Dossier T3/Rendus F3\'/Salon 1 F3\'.webp',
      './images/Dossier T3/Rendus F3\'/Salon 2 F3\'.webp',
      './images/Dossier T3/Rendus F3\'/Cuisine 1.webp',
      './images/Dossier T3/Rendus F3\'/Chambre Master 1 F3\'.webp'
    ],
    display_order: 2,
    is_featured: true
  }
];

const fallbackMilestones: ConstructionMilestone[] = [
  {
    id: 'ms-01',
    stage_number: 1,
    title: 'Obtention du titre foncier et validation du projet',
    description: 'Le dossier de construction est consolidé avec le foncier, les autorisations et le cadrage du programme.',
    status: 'completed',
    progress_percent: 100,
    date_display: '2026 — Q1',
    is_3d_render: false,
  },
  {
    id: 'ms-02',
    stage_number: 2,
    title: 'Lancement des fondations et élévation du socle',
    description: 'Le chantier est actuellement à la phase de lancement des fondations et d’élévation du socle.',
    status: 'in_progress',
    progress_percent: 58,
    date_display: '2026 — Q2',
    is_3d_render: false,
  },
  {
    id: 'ms-03',
    stage_number: 3,
    title: 'R+7 en cours d’élévation',
    description: 'La structure principale est élevée progressivement avec les étages, les planchers et les éléments de sécurité.',
    status: 'upcoming',
    progress_percent: 0,
    date_display: '2026 — Q3',
    is_3d_render: false,
  },
  {
    id: 'ms-04',
    stage_number: 4,
    title: 'Finitions intérieures et aménagements',
    description: 'Les espaces communs, la finition des logements, les équipements et les audits de qualité sont engagés.',
    status: 'upcoming',
    progress_percent: 0,
    date_display: '2026 — Q4',
    is_3d_render: false,
  },
  {
    id: 'ms-05',
    stage_number: 5,
    title: 'Livraison, clés et mise en service',
    description: 'La résidence est livrée aux acquéreurs avec la remise des clés et le suivi de la mise en service.',
    status: 'upcoming',
    progress_percent: 0,
    date_display: '2029 — Q1',
    is_3d_render: false,
  }
];

const fallbackFaqs: FAQItem[] = [
  {
    id: 'faq-01',
    category: 'projet',
    question: 'Où se situe la résidence NOEMA ?',
    answer: 'La résidence NOEMA se trouve à Angré Djorogobité, commune de la ville d’Abidjan.',
    display_order: 1,
    is_published: true
  },
  {
    id: 'faq-02',
    category: 'chantier',
    question: 'Quel est le niveau d’avancement du chantier ?',
    answer: 'La structure est en phase d’élévation avec les lots T2 et T3 visibles depuis la grille publiée.',
    display_order: 2,
    is_published: true
  }
];

export async function fetchResidence(): Promise<ResidenceInfo> {
  try {
    const res = await fetch(`${API_BASE}/residence`);
    if (!res.ok) throw new Error('Residence API unavailable');
    const data = await res.json();
    return data.data;
  } catch {
    return fallbackResidence;
  }
}

export async function fetchApartments(type?: string, status?: string): Promise<Apartment[]> {
  const params = new URLSearchParams();
  if (type && type !== 'all') params.append('type', type);
  if (status && status !== 'all') params.append('status', status);

  try {
    const res = await fetch(`${API_BASE}/apartments?${params.toString()}`);
    if (!res.ok) throw new Error('Apartments API unavailable');
    const data = await res.json();
    return data.data;
  } catch {
    return fallbackApartments;
  }
}

export async function fetchApartmentById(id: string): Promise<Apartment> {
  try {
    const res = await fetch(`${API_BASE}/apartments/${id}`);
    if (!res.ok) throw new Error('Apartment detail API unavailable');
    const data = await res.json();
    return data.data;
  } catch {
    return fallbackApartments.find((apt) => apt.id === id) || fallbackApartments[0];
  }
}

export async function fetchConstructionMilestones(): Promise<ConstructionMilestone[]> {
  try {
    const res = await fetch(`${API_BASE}/construction`);
    if (!res.ok) throw new Error('Construction API unavailable');
    const data = await res.json();
    return data.data;
  } catch {
    return fallbackMilestones;
  }
}

export async function fetchFAQs(category?: string): Promise<FAQItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);

  try {
    const res = await fetch(`${API_BASE}/faq?${params.toString()}`);
    if (!res.ok) throw new Error('FAQ API unavailable');
    const data = await res.json();
    return data.data;
  } catch {
    return fallbackFaqs;
  }
}

export async function calculateSimulation(payload: {
  apartment_id?: string;
  apartment_price: number;
  down_payment: number;
  duration_years: number;
  monthly_net_income: number;
  existing_monthly_loans: number;
  additional_monthly_income?: number;
  co_borrower_monthly_income?: number;
  interest_rate?: number;
}): Promise<{ data: SimulationResult; legal_disclaimer: string }> {
  const res = await fetch(`${API_BASE}/simulations/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function submitLead(payload: LeadSubmission): Promise<{ success: boolean; message: string; data?: any }> {
  const res = await fetch(`${API_BASE}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json();
}

export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export function formatEUR(fcfa: number): string {
  // Fixed standard parity 1 EUR = ~655.957 FCFA
  const eur = Math.round(fcfa / 655.957);
  return new Intl.NumberFormat('fr-FR').format(eur) + ' €';
}
