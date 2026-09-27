/**
 * CV file location (public folder):
 *   public/Asjath_Mubeen_CV.pdf
 *
 * Replace that file with the real PDF when available.
 * Do not invent resume content here.
 */
export const CV_PATH = '/Asjath_Mubeen_CV.pdf'
export const CV_FILENAME = 'Asjath_Mubeen_CV.pdf'

/**
 * @param {'primary' | 'ghost' | 'about'} variant
 * @param {string} [className]
 */
export default function DownloadCV({ variant = 'ghost', className = '' }) {
  const base =
    variant === 'primary'
      ? 'btn btn-primary'
      : variant === 'about'
        ? 'about-cv-btn'
        : 'btn btn-ghost'

  return (
    <a
      href={CV_PATH}
      className={`${base} cv-download ${className}`.trim()}
      download={CV_FILENAME}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download CV as PDF"
      title="Download CV (PDF)"
    >
      <svg
        className="cv-download-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Download CV</span>
    </a>
  )
}
