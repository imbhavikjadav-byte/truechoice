import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const LAPTOP_QUESTIONS = [
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
    question: 'What\'s your budget?',
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
      { label: 'HP', icon: '🏢', value: 'HP' },
      { label: 'Dell', icon: '🏢', value: 'Dell' },
      { label: 'Lenovo', icon: '🏢', value: 'Lenovo' },
      { label: 'ASUS', icon: '🏢', value: 'ASUS' },
    ]
  },
  {
    id: 'battery',
    question: 'How important is battery life?',
    options: [
      { label: 'Very Important (8+ hours)', icon: '🔋', value: 'Very Important' },
      { label: 'Somewhat (5-7 hours)', icon: '🔌', value: 'Somewhat' },
      { label: 'Not Much — I\'ll mostly use plugged in', icon: '⚡', value: 'Not Important' },
    ]
  },
]

export default function Questionnaire({ category, onAnswersSubmit }) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  const questions = LAPTOP_QUESTIONS
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
        navigate('/loading')
      }
      setIsTransitioning(false)
    }, 300)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
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
        <div className="text-sm text-light-bg/70">Question {currentStep + 1} of {totalSteps}</div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-navy/30 px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="w-full bg-navy/50 rounded-full h-1 border border-accent-blue/20">
            <div
              className="bg-accent-blue h-1 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {/* Question */}
            <h2 className="text-4xl md:text-5xl font-display font-bold text-light-bg text-center mb-12 leading-tight fade-in">
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

          {/* Navigation */}
          <div className="flex gap-4 justify-center mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-lg border-2 border-accent-blue/30 text-light-bg/70 hover:border-accent-blue/60 hover:text-light-bg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Back
            </button>
            <button
              disabled={!answers[currentQuestion.id]}
              className="px-6 py-3 rounded-lg bg-accent-blue/20 border-2 border-accent-blue/30 text-light-bg/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              (Select an option to continue)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
