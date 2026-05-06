import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecommendations } from '../services/api'

const LOADING_MESSAGES = [
  'Understanding your needs...',
  'Browsing 25+ laptops...',
  'Comparing specs and prices...',
  'Checking Amazon ratings...',
  'Finalising your matches...',
]

export default function Loading({ category, answers, onResultsReady }) {
  const navigate = useNavigate()
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Cycle through messages
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 1500)

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev
        return prev + Math.random() * 30
      })
    }, 400)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const result = await getRecommendations(category, answers)
        setProgress(100)
        
        // Small delay for better UX
        setTimeout(() => {
          onResultsReady(result.recommendations)
          navigate('/results')
        }, 800)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
        // Fallback: show error message
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    }

    fetchRecommendations()
  }, [category, answers, navigate, onResultsReady])

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy to-blue-900 flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="text-6xl font-display font-bold text-accent-blue mb-12 animate-pulse">
        TrueChoice
      </div>

      {/* Loading Message */}
      <div className="text-2xl text-light-bg text-center mb-8 h-8">
        <div className="animate-pulse">{LOADING_MESSAGES[messageIndex]}</div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md w-full mb-8">
        <div className="bg-navy/50 rounded-full h-2 border border-accent-blue/20 overflow-hidden">
          <div
            className="bg-gradient-to-r from-accent-blue to-blue-400 h-2 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-sm text-light-bg/50 mt-3">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Animated Dots */}
      <div className="flex gap-2 justify-center">
        <div className="w-3 h-3 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-3 h-3 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 rounded-full bg-accent-blue animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  )
}
