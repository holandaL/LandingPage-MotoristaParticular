export const CONTACT = {
  driverName: 'Sampaio',
  whatsapp: import.meta.env.VITE_DRIVER_WHATSAPP ?? '55XXXXXXXXXXX'
};

export function hasConfiguredWhatsapp() {
  return /^55\d{10,13}$/.test(CONTACT.whatsapp);
}
