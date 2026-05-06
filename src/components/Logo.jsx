const GRADIENT_STYLE = { background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }

function LogoIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16" fill="none" stroke="url(#checkGradient)" strokeWidth="2" />
      <path d="M10 18L15 23L26 12" stroke="url(#checkGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export default function Logo({ showText = true, showBadge = false, size = 28, fontSize = 22, gap = 8 }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <LogoIcon size={size} />
      {showText && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize, display: 'inline-flex', alignItems: 'baseline', lineHeight: 1 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, color: '#F0F4FF', letterSpacing: '0.5px', verticalAlign: 'baseline' }}>True</span>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontStyle: 'italic', paddingRight: '4px', verticalAlign: 'baseline', ...GRADIENT_STYLE }}>Choice</span>
          </span>
          {showBadge && (
            <span className="px-2 py-1 bg-[#141B2D] text-[#8896B3] text-xs font-semibold rounded-full">
              Admin
            </span>
          )}
        </div>
      )}
    </div>
  )
}
