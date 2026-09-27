/**
 * Central social / contact link configuration.
 * Leave as "" to hide that network.
 *
 * Do not invent usernames or profile URLs.
 */
const socialLinks = {
  github: '',
  linkedin: '',
  whatsapp: 'https://wa.me/94763676848',
  email: 'asjamhd8@gmail.com',
  facebook: 'https://www.facebook.com/share/1F4DB6vLQZ/',
  instagram: 'https://www.instagram.com/mhd_asja_/',
}

export default socialLinks

/** Resolve href for a given key; returns null if not configured. */
export function resolveSocialHref(key, value) {
  const v = (value || '').trim()
  if (!v) return null
  if (key === 'email') {
    return v.startsWith('mailto:') ? v : `mailto:${v}`
  }
  if (key === 'whatsapp') {
    if (v.startsWith('http')) return v
    const digits = v.replace(/\D/g, '')
    return digits ? `https://wa.me/${digits}` : null
  }
  return v
}
