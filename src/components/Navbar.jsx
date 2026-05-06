import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'

export default function Navbar({ showAdminBadge = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav
      className={`sticky top-0 z-40 h-16 flex items-center px-6 border-b transition-all ${
        isHome
          ? 'bg-transparent border-transparent'
          : 'bg-[#0E1420] border-[#1E2A45]'
      }`}
    >
      <button
        onClick={() => navigate('/')}
        className="hover:opacity-80 transition-opacity"
      >
        <Logo showText showBadge={showAdminBadge} />
      </button>

      <div className="flex-1" />

      {showAdminBadge && (
        <button
          onClick={() => {
            navigate('/')
          }}
          className="text-[#8896B3] hover:text-[#F0F4FF] text-sm font-semibold transition-colors border border-[#1E2A45] hover:border-[#2563EB] px-4 py-2 rounded-lg"
        >
          ← Exit Admin
        </button>
      )}
    </nav>
  )
}
