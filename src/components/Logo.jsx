export default function Logo({ showText = true, showBadge = false }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="36"
        height="36"
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
          <span className="text-xl font-display font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            TrueChoice
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
