import Logo from './Logo'
import { useNavigate } from 'react-router-dom'

export default function LogoHeader({ showBadge = false, extra = null, rightSlot = null }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-40 flex flex-col">
      <div className="pt-6 pb-5 flex items-center w-full bg-[#0E1420] px-6">
        {/* Mirror of rightSlot — desktop only, keeps logo centered */}
        <div className="hidden md:flex flex-1 justify-start invisible pointer-events-none" aria-hidden="true">
          {rightSlot}
        </div>

        {/* Center: logo + tagline + mobile slot */}
        <div className="flex flex-col items-center gap-2 flex-1 md:flex-none">
          <button onClick={() => navigate('/')} className="no-lift hover:opacity-80 transition-opacity">
            <Logo showText showBadge={showBadge} size={36} fontSize={28} gap={10} />
          </button>
          <p className="text-[#8896B3] whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
            AI-Powered Product Recommendations
          </p>
          {rightSlot && <div className="md:hidden mt-1">{rightSlot}</div>}
          {extra && <div className="mt-1">{extra}</div>}
        </div>

        {/* Right slot — desktop only */}
        <div className="hidden md:flex flex-1 justify-end">
          {rightSlot}
        </div>
      </div>
      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #2563EB 20%, #7C3AED 80%, transparent)' }} />
    </div>
  )
}
