import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function Home({ onCategorySelect }) {
  const navigate = useNavigate()

  const handleFindLaptop = () => {
    onCategorySelect('laptop')
    navigate('/questionnaire')
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col"
      style={{ backgroundImage: 'radial-gradient(ellipse at 80% 0%, rgba(37, 99, 235, 0.07) 0%, transparent 60%)' }}
    >
      {/* Navigation */}
      <nav className="sticky top-0 z-40 h-16 flex items-center justify-between px-6 border-b border-transparent bg-transparent">
        <Logo />
        <div className="text-sm text-[#8896B3]">AI-Powered Recommendations</div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 fade-in">
        <h1 className="text-5xl md:text-6xl font-display font-bold text-light-bg mb-6 leading-tight">
          Find Your Perfect Laptop in 60 Seconds
        </h1>
        
        <p className="text-xl md:text-2xl text-light-bg/80 mb-12 max-w-2xl leading-relaxed">
          Answer 5 quick questions. Our AI finds the best match from Amazon — personalized for your needs and budget.
        </p>

        <button
          onClick={handleFindLaptop}
          className="bg-accent-blue hover:bg-blue-600 text-navy font-bold py-4 px-12 rounded-lg text-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/50 mb-12"
        >
          Find My Laptop →
        </button>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mt-16">
          <div className="bg-navy/50 border border-accent-blue/30 rounded-lg p-6 hover:border-accent-blue/60 transition-all">
            <div className="text-3xl mb-3">🎯</div>
            <div className="font-display text-lg font-bold text-accent-blue mb-2">Step 1</div>
            <p className="text-light-bg/70">Answer 5 quick questions</p>
          </div>

          <div className="bg-navy/50 border border-accent-blue/30 rounded-lg p-6 hover:border-accent-blue/60 transition-all">
            <div className="text-3xl mb-3">🤖</div>
            <div className="font-display text-lg font-bold text-accent-blue mb-2">Step 2</div>
            <p className="text-light-bg/70">AI analyzes your needs</p>
          </div>

          <div className="bg-navy/50 border border-accent-blue/30 rounded-lg p-6 hover:border-accent-blue/60 transition-all">
            <div className="text-3xl mb-3">✨</div>
            <div className="font-display text-lg font-bold text-accent-blue mb-2">Step 3</div>
            <p className="text-light-bg/70">Get your perfect match</p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap gap-4 justify-center mt-16">
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-2 text-sm text-light-bg/80">
            ✓ Powered by Claude AI
          </div>
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-2 text-sm text-light-bg/80">
            ✓ 100% Free — No signup needed
          </div>
          <div className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-4 py-2 text-sm text-light-bg/80">
            ✓ Amazon Verified Products
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy/50 border-t border-accent-blue/20 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-light-bg/60 text-center mb-4">
            TrueChoice is a participant in the Amazon Associates programme. We earn a small commission when you purchase through our links, at no extra cost to you.
          </p>
          <p className="text-xs text-light-bg/50 text-center">
            © 2024 TrueChoice. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
