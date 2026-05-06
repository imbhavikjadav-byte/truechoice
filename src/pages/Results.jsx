import { useNavigate } from 'react-router-dom'
import { formatIndianPrice, formatRating } from '../utils/formatters'

export default function Results({ recommendations, category, answers }) {
  const navigate = useNavigate()

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-blue-900 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-2xl text-light-bg mb-6">No recommendations found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-accent-blue hover:bg-blue-600 text-navy font-bold py-3 px-8 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const handleShare = () => {
    const text = `Check out these AI-recommended laptops from TrueChoice! 🎯`
    if (navigator.share) {
      navigator.share({
        title: 'TrueChoice Recommendations',
        text: text,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-blue-900 flex flex-col">
      {/* Header */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-accent-blue/20">
        <button
          onClick={() => navigate('/')}
          className="text-2xl font-display font-bold text-accent-blue hover:text-blue-400 transition"
        >
          TrueChoice
        </button>
        <div className="text-sm text-light-bg/70">Your Perfect Matches</div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-light-bg mb-4">
              Your Perfect Matches
            </h1>
            <p className="text-xl text-light-bg/70">
              Based on your answers, here are your top 3 picks
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {recommendations.map((product, index) => (
              <div
                key={product.id}
                className={`rounded-lg border-2 overflow-hidden transition-all duration-500 fade-in hover:shadow-lg hover:shadow-accent-blue/30 ${
                  product.is_best_pick
                    ? 'bg-accent-blue/10 border-accent-blue md:scale-105 md:z-10'
                    : 'bg-navy/30 border-accent-blue/20'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Best Pick Badge */}
                {product.is_best_pick && (
                  <div className="bg-gradient-to-r from-accent-blue to-blue-400 text-navy font-bold py-2 px-4 text-center">
                    ⭐ Best Pick
                  </div>
                )}

                {/* Image */}
                <div className="aspect-video bg-navy/50 overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-4xl">💻</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Name and Brand */}
                  <h3 className="text-xl font-bold text-light-bg mb-2">{product.name}</h3>
                  <div className="inline-block bg-accent-blue/20 border border-accent-blue/30 rounded-full px-3 py-1 text-sm text-accent-blue mb-4">
                    {product.brand}
                  </div>

                  {/* Price and Rating */}
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-accent-blue mb-2">
                      {formatIndianPrice(product.price)}
                    </div>
                    {product.amazon_rating && (
                      <div className="text-light-bg/70">
                        {formatRating(product.amazon_rating)}
                      </div>
                    )}
                  </div>

                  {/* Match Score */}
                  <div className="bg-navy/50 rounded-lg px-3 py-2 mb-4 text-center">
                    <div className="text-sm text-light-bg/60">Match Score</div>
                    <div className="text-2xl font-bold text-accent-blue">{product.match_score}%</div>
                  </div>

                  {/* Reasoning */}
                  <p className="text-light-bg/80 text-sm mb-6 leading-relaxed">
                    <strong>Why this is perfect for you:</strong> {product.reasoning}
                  </p>

                  {/* Specs Pills */}
                  {product.specs && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                        <span key={key} className="bg-accent-blue/10 border border-accent-blue/30 rounded-full px-3 py-1 text-xs text-light-bg/70">
                          {value}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* CTA Button */}
                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-accent-blue hover:bg-blue-600 text-navy font-bold py-3 rounded-lg text-center transition-all duration-300 hover:shadow-lg hover:shadow-accent-blue/50"
                  >
                    View on Amazon →
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 rounded-lg border-2 border-accent-blue/30 text-light-bg hover:border-accent-blue/60 hover:bg-accent-blue/10 transition-all"
            >
              🔄 Start Over
            </button>
            <button
              onClick={() => navigate('/questionnaire')}
              className="px-6 py-3 rounded-lg border-2 border-accent-blue/30 text-light-bg hover:border-accent-blue/60 hover:bg-accent-blue/10 transition-all"
            >
              ✏️ Refine My Search
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 rounded-lg bg-accent-blue/10 border-2 border-accent-blue/30 text-light-bg hover:bg-accent-blue/20 hover:border-accent-blue/60 transition-all"
            >
              📤 Share Results
            </button>
          </div>

          {/* Affiliate Disclosure */}
          <div className="bg-navy/50 border border-accent-blue/20 rounded-lg p-6 text-center text-sm text-light-bg/60">
            <p>
              💡 TrueChoice is a participant in the Amazon Associates programme. We earn a small commission when you purchase through our links, at no extra cost to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
