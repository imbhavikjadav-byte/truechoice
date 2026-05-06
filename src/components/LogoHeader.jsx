import Logo from './Logo'
import { useNavigate } from 'react-router-dom'

export default function LogoHeader({ showBadge = false, extra = null }) {
  const navigate = useNavigate()

  return (
    <div className="sticky top-0 z-40 flex flex-col items-center">
      <div className="pt-6 pb-5 flex flex-col items-center gap-2 w-full bg-[#0E1420]">
        <button onClick={() => navigate('/')} className="no-lift hover:opacity-80 transition-opacity">
          <Logo showText showBadge={showBadge} size={36} fontSize={28} gap={10} />
        </button>
        <p className="text-[#8896B3] whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: '13px', letterSpacing: '0.08em' }}>
          AI-Powered Product Recommendations
        </p>
        {extra && <div className="mt-1">{extra}</div>}
      </div>
      <div className="w-full h-px" style={{ background: 'linear-gradient(90deg, transparent, #2563EB 20%, #7C3AED 80%, transparent)' }} />
    </div>
  )
}
