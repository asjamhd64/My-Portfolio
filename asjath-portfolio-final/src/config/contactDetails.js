/**
 * Existing contact details from the portfolio — do not invent values.
 * Phone display: +94 76 367 6848
 * Phone tel/WhatsApp digits: 94763676848
 * Email: asjamhd8@gmail.com
 */
export const contactDetails = {
  phoneDisplay: '+94 76 367 6848',
  phoneTel: '+94763676848',
  /** Digits only for wa.me (no + or spaces) */
  phoneWhatsApp: '94763676848',
  email: 'asjamhd8@gmail.com',
}

export function telHref() {
  return `tel:${contactDetails.phoneTel}`
}

export function mailtoHref() {
  return `mailto:${contactDetails.email}`
}

export function whatsappHref() {
  return `https://wa.me/${contactDetails.phoneWhatsApp}`
}
