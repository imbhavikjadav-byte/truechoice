export default function Logo({ showText = true, showBadge = false, size = 28, fontSize = 22, gap = 8 }) {
  return (
    <div className="flex items-center" style={{ gap }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="checkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        {/* Circle */}
        <circle cx="18" cy="18" r="16" fill="none" stroke="url(#checkGradient)" strokeWidth="2" />
        {/* Checkmark */}
        <path
          d="M10 18L15 23L26 12"
          stroke="url(#checkGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {showText && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize }}>
            <span style={{ color: '#F0F4FF', fontFamily: 'Playfair Display', fontWeight: 300 }}>True</span><span style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'Playfair Display', fontWeight: 700 }}>Choice</span>
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
