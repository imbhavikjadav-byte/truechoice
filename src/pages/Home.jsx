import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LogoHeader from '../components/LogoHeader'

const WORDS = ['Perfect', 'Ideal', 'Dream', 'Ultimate', 'Smart']

function TypewriterWord() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing') // 'typing' | 'holding' | 'deleting'
  const [cursorVisible, setCursorVisible] = useState(true)

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 500)
    return () => clearInterval(blink)
  }, [])

  // Typewriter state machine
  useEffect(() => {
    const word = WORDS[wordIndex]

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        const t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('holding'), 1500)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'holding') {
      const t = setTimeout(() => setPhase('deleting'), 0)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
        return () => clearTimeout(t)
      } else {
        setWordIndex(i => (i + 1) % WORDS.length)
        setPhase('typing')
      }
    }
  }, [phase, displayed, wordIndex])

  return (
    <span
      style={{
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        borderRadius: '6px',
        padding: '2px 10px',
        color: 'white',
        fontStyle: 'italic',
        display: 'inline-block',
        minWidth: '120px',
        textAlign: 'left',
        verticalAlign: 'baseline',
      }}
    >
      {displayed}
      <span style={{ opacity: cursorVisible ? 1 : 0, color: 'white', fontStyle: 'normal' }}>|</span>
    </span>
  )
}

const CATEGORIES = [
  {
    id: 'laptop',
    label: 'Laptops',
    icon: '💻',
    description: 'Find your perfect laptop for work, study or gaming',
    gradient: 'from-[#2563EB] to-[#1D4ED8]',
  },
  {
    id: 'mobile',
    label: 'Mobile Phones',
    icon: '📱',
    description: 'Discover the smartphone that fits your lifestyle',
    gradient: 'from-[#7C3AED] to-[#6D28D9]',
  },
  {
    id: 'smartwatch',
    label: 'Smartwatches',
    icon: '⌚',
    description: 'Track health, stay connected, look great',
    gradient: 'from-[#0891B2] to-[#0E7490]',
  },
]

export default function Home({ onCategorySelect }) {
  const navigate = useNavigate()

  const handleCategorySelect = (categoryId) => {
    onCategorySelect(categoryId)
    navigate('/tell-us-your-needs')
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col"
      style={{ backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.07) 0%, transparent 60%)' }}
    >
      <LogoHeader />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12 fade-in">
        <h1 className="hero-headline text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[#F0F4FF] mb-4 leading-tight">
          Find Your <TypewriterWord /> Product in{' '}
          <span style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            60 Seconds
          </span>
        </h1>

        <p className="hero-tagline text-xl md:text-2xl text-[#8896B3] mb-10 max-w-2xl leading-relaxed">
          Answer a few quick questions. Our AI finds the best match from Amazon — personalized for your needs and budget.
        </p>

        {/* Category Selection */}
        <div className="w-full max-w-3xl mb-12">
          <p className="text-[#8896B3] text-sm uppercase tracking-widest mb-5">What are you looking for?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="group relative border border-[#1E2A45] bg-[#0E1420] rounded-2xl p-6 text-left hover:border-[#2563EB] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{ boxShadow: 'none' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(37,99,235,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                {/* Gradient accent line at top */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-bold text-[#F0F4FF] text-lg mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cat.label}</div>
                <p className="text-[#8896B3] text-sm leading-relaxed">{cat.description}</p>
                <div
                  className="mt-4 inline-flex items-center gap-2 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all group-hover:opacity-90 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                >
                  Get recommendations →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="w-full max-w-5xl">
          <p className="text-[#8896B3] text-sm uppercase tracking-widest mb-6">How it works</p>
          {/* Desktop: cards + badges in same column. Mobile: just cards in a row, badges below all together */}
          <div className="hidden md:grid md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', step: 'Step 1', desc: 'Pick a category & answer questions', badge: '✓ 100% Free — No signup needed' },
              { icon: '🤖', step: 'Step 2', desc: 'AI analyses & matches your needs', badge: '✓ Powered by Claude AI' },
              { icon: '✨', step: 'Step 3', desc: 'Get your top 3 personalised picks', badge: '✓ Amazon Verified Products' },
            ].map(({ icon, step, desc, badge }) => (
              <div key={step} className="flex flex-col items-center gap-4">
                <div className="w-full bg-navy/50 border border-accent-blue/30 rounded-lg p-6">
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="text-lg font-bold text-accent-blue mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{step}</div>
                  <p className="text-light-bg/70 text-sm whitespace-nowrap">{desc}</p>
                </div>
                <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-2 text-sm text-light-bg/80 whitespace-nowrap">{badge}</div>
              </div>
            ))}
          </div>

          {/* Mobile: same content as desktop */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {[
              { icon: '🎯', step: 'Step 1', desc: 'Pick a category & answer quick questions', badge: '✓ 100% Free — No signup needed' },
              { icon: '🤖', step: 'Step 2', desc: 'AI analyses & matches your needs', badge: '✓ Powered by Claude AI' },
              { icon: '✨', step: 'Step 3', desc: 'Get your top 3 personalised picks', badge: '✓ Amazon Verified Products' },
            ].map(({ icon, step, desc, badge }) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className="w-full bg-navy/50 border border-accent-blue/30 rounded-lg p-6">
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="text-lg font-bold text-accent-blue mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{step}</div>
                  <p className="text-light-bg/70 text-sm">{desc}</p>
                </div>
                <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-2 text-sm text-light-bg/80">{badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0E1420] border-t border-[#1E2A45] px-6 py-6">
        <p className="text-xs text-[#8896B3] text-center">
          © 2026 TrueChoice. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
