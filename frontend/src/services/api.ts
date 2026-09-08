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

export async function fetchResidence(): Promise<ResidenceInfo> {
  const res = await fetch(`${API_BASE}/residence`);
  const data = await res.json();
  return data.data;
}

export async function fetchApartments(type?: string, status?: string): Promise<Apartment[]> {
  const params = new URLSearchParams();
  if (type && type !== 'all') params.append('type', type);
  if (status && status !== 'all') params.append('status', status);

  const res = await fetch(`${API_BASE}/apartments?${params.toString()}`);
  const data = await res.json();
  return data.data;
}

export async function fetchApartmentById(id: string): Promise<Apartment> {
  const res = await fetch(`${API_BASE}/apartments/${id}`);
  const data = await res.json();
  return data.data;
}

export async function fetchConstructionMilestones(): Promise<ConstructionMilestone[]> {
  const res = await fetch(`${API_BASE}/construction`);
  const data = await res.json();
  return data.data;
}

export async function fetchFAQs(category?: string): Promise<FAQItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);

  const res = await fetch(`${API_BASE}/faq?${params.toString()}`);
  const data = await res.json();
  return data.data;
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
