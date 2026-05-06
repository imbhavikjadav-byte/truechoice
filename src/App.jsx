import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Home from './pages/Home'
import Questionnaire from './pages/Questionnaire'
import Loading from './pages/Loading'
import Results from './pages/Results'
import Admin from './pages/Admin'
import './App.css'

function App() {
  const [quizAnswers, setQuizAnswers] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('laptop')
  const [recommendations, setRecommendations] = useState(null)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onCategorySelect={(cat) => setSelectedCategory(cat)} />} />
        <Route 
          path="/tell-us-your-needs" 
          element={
            <Questionnaire 
              category={selectedCategory}
              onAnswersSubmit={(answers) => {
                setQuizAnswers(answers)
              }}
            />
          } 
        />
        <Route 
          path="/finding-your-picks" 
          element={
            <Loading 
              category={selectedCategory}
              answers={quizAnswers}
              onResultsReady={(recs) => setRecommendations(recs)}
            />
          } 
        />
        <Route 
          path="/your-top-picks" 
          element={
            <Results 
              recommendations={recommendations}
              category={selectedCategory}
              answers={quizAnswers}
            />
          } 
        />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
