import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LogoHeader from '../components/LogoHeader'

const QUESTIONS_BY_CATEGORY = {
  laptop: [
    {
      id: 'use_case',
      question: 'What will you mainly use your laptop for?',
      options: [
        { label: 'College & Study', icon: '🎓', value: 'College & Study' },
        { label: 'Office & Work', icon: '💼', value: 'Office & Work' },
        { label: 'Gaming', icon: '🎮', value: 'Gaming' },
        { label: 'Video Editing & Design', icon: '🎬', value: 'Video Editing & Design' },
      ]
    },
    {
      id: 'budget',
      question: "What's your budget?",
      options: [
        { label: 'Under ₹30,000', icon: '💚', value: 'Under 30000' },
        { label: '₹30,000 – ₹50,000', icon: '💛', value: '30000-50000' },
        { label: '₹50,000 – ₹80,000', icon: '🧡', value: '50000-80000' },
        { label: '₹80,000 and above', icon: '❤️', value: '80000+' },
      ]
    },
    {
      id: 'priority',
      question: 'What matters more to you?',
      options: [
        { label: 'Ultra Lightweight & Portable', icon: '🪶', value: 'Lightweight & Portable' },
        { label: 'Balanced — Good all-rounder', icon: '⚖️', value: 'Balanced' },
        { label: 'Maximum Performance', icon: '⚡', value: 'Maximum Performance' },
      ]
    },
    {
      id: 'brand',
      question: 'Any brand preference?',
      options: [
        { label: 'No Preference', icon: '🤷', value: 'No Preference' },
        { label: 'HP', icon: '🔵', value: 'HP' },
        { label: 'Dell', icon: '🔵', value: 'Dell' },
        { label: 'Lenovo', icon: '🔵', value: 'Lenovo' },
        { label: 'ASUS', icon: '🔵', value: 'ASUS' },
      ]
    },
    {
      id: 'battery',
      question: 'How important is battery life?',
      options: [
        { label: 'Very Important (8+ hours)', icon: '🔋', value: 'Very Important' },
        { label: 'Somewhat (5–7 hours)', icon: '🔌', value: 'Somewhat' },
        { label: "Not Much — I'll mostly use plugged in", icon: '⚡', value: 'Not Important' },
      ]
    },
  ],

  mobile: [
    {
      id: 'use_case',
      question: 'How do you mainly use your phone?',
      options: [
        { label: 'Social Media & Everyday Use', icon: '📲', value: 'Everyday Use' },
        { label: 'Photography & Videos', icon: '📸', value: 'Photography' },
        { label: 'Mobile Gaming', icon: '🎮', value: 'Gaming' },
        { label: 'Business & Productivity', icon: '💼', value: 'Business' },
      ]
    },
    {
      id: 'budget',
      question: "What's your budget?",
      options: [
        { label: 'Under ₹15,000', icon: '💚', value: 'Under 15000' },
        { label: '₹15,000 – ₹30,000', icon: '💛', value: '15000-30000' },
        { label: '₹30,000 – ₹50,000', icon: '🧡', value: '30000-50000' },
        { label: '₹50,000 and above', icon: '❤️', value: '50000+' },
      ]
    },
    {
      id: 'priority',
      question: 'What do you care about most?',
      options: [
        { label: 'Best Camera', icon: '📷', value: 'Camera' },
        { label: 'Long Battery Life', icon: '🔋', value: 'Battery Life' },
        { label: 'Top Performance', icon: '⚡', value: 'Performance' },
        { label: 'Beautiful Display', icon: '🖥️', value: 'Display' },
      ]
    },
    {
      id: 'brand',
      question: 'Any brand preference?',
      options: [
        { label: 'No Preference', icon: '🤷', value: 'No Preference' },
        { label: 'Samsung', icon: '🔵', value: 'Samsung' },
        { label: 'Apple', icon: '🍎', value: 'Apple' },
        { label: 'OnePlus', icon: '🔴', value: 'OnePlus' },
        { label: 'Poco / Redmi', icon: '🟠', value: 'Poco/Redmi' },
      ]
    },
    {
      id: 'storage',
      question: 'How much storage do you need?',
      options: [
        { label: '128GB is enough', icon: '📦', value: '128GB' },
        { label: '256GB for safety', icon: '🗄️', value: '256GB' },
        { label: '512GB+ for lots of media', icon: '💾', value: '512GB+' },
      ]
    },
  ],

  smartwatch: [
    {
      id: 'use_case',
      question: 'What will you mainly use the watch for?',
      options: [
        { label: 'Fitness & Workouts', icon: '🏃', value: 'Fitness Tracking' },
        { label: 'Health Monitoring', icon: '❤️', value: 'Health Monitoring' },
        { label: 'Notifications & Productivity', icon: '🔔', value: 'Notifications' },
        { label: 'Style & Fashion', icon: '✨', value: 'Style' },
      ]
    },
    {
      id: 'budget',
      question: "What's your budget?",
      options: [
        { label: 'Under ₹5,000', icon: '💚', value: 'Under 5000' },
        { label: '₹5,000 – ₹15,000', icon: '💛', value: '5000-15000' },
        { label: '₹15,000 – ₹30,000', icon: '🧡', value: '15000-30000' },
        { label: '₹30,000 and above', icon: '❤️', value: '30000+' },
      ]
    },
    {
      id: 'priority',
      question: 'What feature matters most to you?',
      options: [
        { label: 'Long Battery Life (7+ days)', icon: '🔋', value: 'Battery Life' },
        { label: 'Advanced Health Sensors', icon: '🩺', value: 'Health Sensors' },
        { label: 'Always-on Display', icon: '🖥️', value: 'Display' },
        { label: 'GPS & Sports Modes', icon: '📍', value: 'GPS & Sports' },
      ]
    },
    {
      id: 'compatibility',
      question: 'Which phone do you use?',
      options: [
        { label: 'iPhone', icon: '🍎', value: 'iPhone' },
        { label: 'Android', icon: '🤖', value: 'Android' },
        { label: "Doesn't matter", icon: '🤷', value: 'Any' },
      ]
    },
    {
      id: 'brand',
      question: 'Any brand preference?',
      options: [
        { label: 'No Preference', icon: '🤷', value: 'No Preference' },
        { label: 'Apple Watch', icon: '🍎', value: 'Apple' },
        { label: 'Samsung', icon: '🔵', value: 'Samsung' },
        { label: 'Garmin', icon: '🟠', value: 'Garmin' },
        { label: 'boAt / Noise', icon: '🟢', value: 'boAt/Noise' },
      ]
    },
  ],
}

export default function Questionnaire({ category, onAnswersSubmit }) {
  const navigate = useNavigate()
  const location = useLocation()
  const questions = QUESTIONS_BY_CATEGORY[category] || QUESTIONS_BY_CATEGORY.laptop
  const initialStep = location.state?.startAtLast ? questions.length - 1 : 0
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [answers, setAnswers] = useState(location.state?.answers || {})
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion = questions[currentStep]
  const totalSteps = questions.length

  const handleSelectOption = (value) => {
    setIsTransitioning(true)
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: value,
    }
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // All questions answered
        onAnswersSubmit(newAnswers)
        navigate('/finding-your-picks')
      }
      setIsTransitioning(false)
    }, 300)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#080C14] flex flex-col">
      {/* Centered logo header */}
      <LogoHeader />

      {/* Progress bar section */}
      <div className="px-8 pt-20 pb-6">
        <div className="max-w-2xl mx-auto">
          {/* Label above bar */}
          <p className="text-center text-[#8896B3] mb-2" style={{ fontSize: '13px' }}>
            Question {currentStep + 1} of {totalSteps}
          </p>
          {/* Segmented bar */}
          <div className="flex gap-[3px]">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-[6px] transition-all duration-500"
                style={{
                  borderRadius: '3px',
                  background:
                    i < currentStep
                      ? 'linear-gradient(90deg, #2563EB, #7C3AED)'
                      : i === currentStep
                      ? 'linear-gradient(90deg, rgba(37,99,235,0.6), rgba(124,58,237,0.6))'
                      : '#141B2D',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-display font-bold text-light-bg text-center mb-12 leading-tight fade-in md:whitespace-nowrap">
              {currentQuestion.question}
            </h2>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 fade-in">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectOption(option.value)}
                  className={`p-6 rounded-lg border-2 transition-all duration-300 text-left group ${
                    answers[currentQuestion.id] === option.value
                      ? 'bg-accent-blue/20 border-accent-blue text-light-bg'
                      : 'bg-navy/30 border-accent-blue/20 text-light-bg/80 hover:border-accent-blue/60 hover:bg-navy/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {option.icon}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{option.label}</div>
                    </div>
                    {answers[currentQuestion.id] === option.value && (
                      <span className="text-accent-blue text-xl">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hint text */}
          {!answers[currentQuestion.id] && (
            <p className="text-center text-[#8896B3]/60 text-xs mt-6 mb-2">
              Select an option above to continue
            </p>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg border-2 border-accent-blue/30 text-light-bg/70 hover:border-accent-blue/60 hover:text-light-bg transition-all text-sm whitespace-nowrap"
            >
              ← Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-[#8896B3] hover:text-[#F0F4FF] text-sm transition-colors whitespace-nowrap"
            >
              ← Pick a Different Category
            </button>
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
