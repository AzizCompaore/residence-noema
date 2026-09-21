export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  const urlParams = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const keys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ];

  keys.forEach(key => {
    const val = urlParams.get(key);
    if (val) {
      utm[key] = val;
      sessionStorage.setItem(`noema_${key}`, val);
    } else {
      const stored = sessionStorage.getItem(`noema_${key}`);
      if (stored) {
        utm[key] = stored;
      }
    }
  });

  return utm;
}

export function buildWhatsAppURL(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
