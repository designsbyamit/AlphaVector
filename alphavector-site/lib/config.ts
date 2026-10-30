/** Where the AlphaVector app lives. The app is a separate deployment from this site. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3100').replace(/\/$/, '')
export const START_URL = `${APP_URL}/start`
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? ''

export const NAV = [
  { href: '/framework', label: 'Framework' },
  { href: '/method', label: 'Method' },
  { href: '/resources', label: 'Resources' },
  { href: '/workshop', label: 'Workshops' },
] as const
