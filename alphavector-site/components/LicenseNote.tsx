import { CcIcon } from './CcIcon'

export const CC_BY_URL = 'https://creativecommons.org/licenses/by/4.0/'

/**
 * The licence note that goes on every page, template, worksheet and framework.
 * `subject` completes "Content on ...", for example "this site", "this page", "this framework", "this worksheet".
 */
export function LicenseNote({ subject = 'this site', className = '' }: { subject?: string; className?: string }) {
  return (
    <p className={`license-note flex items-start gap-2.5 text-[0.9rem] leading-snug text-muted ${className}`}>
      <CcIcon />
      <span>
        Content on {subject} is licensed under a{' '}
        <a className="link" href={CC_BY_URL} rel="license noopener noreferrer" target="_blank">Creative Commons Attribution 4.0 International license</a>.
      </span>
    </p>
  )
}
