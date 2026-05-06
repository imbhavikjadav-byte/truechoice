import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatIndianPrice, formatRating } from '../utils/formatters'
import LogoHeader from '../components/LogoHeader'

function ImageFallback({ name }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#141B2D]">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="18" width="48" height="32" rx="3" stroke="#8896B3" strokeWidth="2" fill="none"/>
        <rect x="20" y="50" width="24" height="3" fill="#8896B3"/>
        <rect x="16" y="53" width="32" height="2" rx="1" fill="#8896B3"/>
        <rect x="12" y="22" width="40" height="24" rx="1" fill="#1E2A45"/>
      </svg>
    </div>
  )
}

function CircleScore({ score }) {
  const radius = 28
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <svg className="rotate-[-90deg]" width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#1E2A45" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
            {score}%
          </span>
        </div>
      </div>
      <span className="text-[#8896B3] text-xs mt-1">Match Score</span>
    </div>
  )
}

function ProductCard({ product, index }) {
  const [imgError, setImgError] = useState(false)

  return (
    <a
      href={product.affiliate_link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col rounded-2xl border overflow-hidden transition-all duration-500 animate-fade-in hover:-translate-y-1 cursor-pointer ${
        product.is_best_pick
          ? 'border-[#2563EB] bg-[#0E1420]'
          : 'border-[#1E2A45] bg-[#0E1420]'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        boxShadow: product.is_best_pick ? '0 0 30px rgba(37, 99, 235, 0.2)' : undefined,
        textDecoration: 'none',
      }}
    >
      {/* Best Pick Badge — always reserves the same height */}
      <div className={`py-2 px-4 text-center text-sm font-bold ${product.is_best_pick ? 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white' : 'invisible'}`}>
        ⭐ Best Pick
      </div>

      {/* Image — reduced height */}
      <div className="h-[160px] w-full bg-[#141B2D] flex items-center justify-center overflow-hidden">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <ImageFallback name={product.name} />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-3">

        {/* Name + Brand inline */}
        <div>
          <h3 className="font-bold text-[#F0F4FF] text-base leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {product.name}
          </h3>
          <span className="text-[#8896B3] text-xs">{product.brand}</span>
        </div>

        {/* Price button + Rating + Match Score — single row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}
            >
              🏷️ Check Price
            </span>
            {product.amazon_rating && (
              <div className="flex items-center gap-1 text-[#8896B3] text-xs">
                <span className="text-[#F59E0B]">⭐</span>
                <span>{product.amazon_rating}</span>
              </div>
            )}
          </div>
          <CircleScore score={product.match_score || 0} />
        </div>

        {/* Reasoning */}
        {product.reasoning && (
          <div className="border-l-2 border-[#2563EB] pl-3">
            <p className="text-[#8896B3] text-[10px] uppercase tracking-wider mb-0.5">Why this suits you</p>
            <p className="text-[#F0F4FF] text-xs leading-relaxed">{product.reasoning}</p>
          </div>
        )}

        {/* Specs Pills */}
        {product.specs && (
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(product.specs).map(([key, value]) => (
              <span
                key={key}
                className="bg-[#141B2D] rounded-md px-2 py-1 text-[11px] flex items-center gap-1"
              >
                <span className="text-[#8896B3]">{key === 'os' ? 'OS' : key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}:</span>
                <span className="text-[#F0F4FF]">{value}</span>
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block w-full text-white font-bold py-2.5 rounded-lg text-center text-sm transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(37,99,235,0.5)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
        >
          🔥 Grab This Deal →
        </a>
      </div>
    </a>
  )
}

const AMAZON_LINKS = {
  laptop:     { url: 'https://amzn.to/48HBnBt', label: '💻 Shop Top Laptop Deals on Amazon →' },
  mobile:     { url: 'https://amzn.to/4f7i0pj', label: '📱 Shop Top Mobile Phone Deals on Amazon →' },
  smartwatch: { url: 'https://amzn.to/3P2GDZQ', label: '⌚ Shop Top Smartwatch Deals on Amazon →' },
}

export default function Results({ recommendations, category, answers }) {
  const navigate = useNavigate()

  if (!recommendations || recommendations.length === 0) {
    const amazonLink = AMAZON_LINKS[category] || AMAZON_LINKS.laptop
    return (
      <div className="min-h-screen bg-[#080C14] flex flex-col">
        <LogoHeader />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="text-5xl mb-6">🛠️</div>
            <h2 className="text-2xl font-display font-bold text-[#F0F4FF] mb-3">We're stocking up!</h2>
            <p className="text-[#8896B3] mb-8 leading-relaxed">
              Our product catalogue is being set up. Check back soon — we're adding top picks for you.
            </p>
            <a
              href={amazonLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-gray-900 font-bold py-3 px-8 rounded-lg mb-4 transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #F97316, #EF4444)' }}
            >
              {amazonLink.label}
            </a>
            <button
              onClick={() => navigate('/tell-us-your-needs', { state: { startAtLast: true, answers } })}
              className="block w-full border border-[#1E2A45] text-[#F0F4FF] font-bold py-3 px-8 rounded-lg mb-4 transition-all hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              ← Back to Questions
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-[#8896B3] hover:text-[#F0F4FF] text-sm transition-colors"
            >
              ← Pick a Different Category
            </button>
          </div>
        </div>
        <footer className="bg-[#0E1420] border-t border-[#1E2A45] px-6 py-6">
          <p className="text-xs text-[#8896B3] text-center">© 2026 TrueChoice. All rights reserved.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col">
      <LogoHeader />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Title */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#F0F4FF] mb-4">
              Your Perfect Matches
            </h1>
            <p className="text-lg text-[#8896B3]">
              Based on your answers, here are your top picks
            </p>
          </div>

          {/* Cards Grid — 3 cols desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 items-start">
            {recommendations.map((product, index) => (
              <ProductCard key={product.id || index} product={product} index={index} />
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center mt-10 mb-12">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 rounded-lg border border-[#1E2A45] text-[#8896B3] hover:text-[#F0F4FF] hover:border-[#2563EB] transition-all"
            >
              🔄 Start Over
            </button>
          </div>

          {/* Affiliate Disclosure */}
          <div className="border border-[#1E2A45] rounded-xl p-6 text-center text-sm text-[#8896B3]">
            💡 TrueChoice participates in the Amazon Associates programme. We earn a small commission when you purchase through our links, at no extra cost to you.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0E1420] border-t border-[#1E2A45] px-6 py-6 mt-auto">
        <p className="text-xs text-[#8896B3] text-center">
          © 2026 TrueChoice. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
