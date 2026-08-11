const DEFAULT_WHATSAPP = '558599860568';

export function normalizeWhatsappNumber(value?: string) {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (!digits) {
    return DEFAULT_WHATSAPP;
  }

  return digits.startsWith('55') ? digits : `55${digits}`;
}

export const CONTACT = {
  driverName: 'Sampaio',
  whatsapp: normalizeWhatsappNumber(import.meta.env.VITE_DRIVER_WHATSAPP ?? DEFAULT_WHATSAPP)
};

export function hasConfiguredWhatsapp() {
  return /^55\d{10,11}$/.test(CONTACT.whatsapp);
}
