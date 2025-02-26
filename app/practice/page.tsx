"use client"

import { useState, useEffect } from 'react'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { useQuiz } from '@/hooks/use-quiz'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Question {
  id: string
  question_text: string
  options: {
    id: string
    option_text: string
    is_correct: boolean
  }[]
}

export default function TestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const quizId = searchParams?.get('id')

  // Redirect if no quiz ID is provided
  useEffect(() => {
    if (!quizId) {
      router.push('/quizzes')
    }
  }, [quizId, router])

  const {
    quiz,
    loading,
    error,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    timeRemaining,
    quizStarted,
    userAnswers,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    startQuiz,
    submitQuiz,
    userId,
  } = useQuiz(quizId || '')

  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!quizStarted && !loading && quiz) {
      startQuiz()
    }
  }, [quizStarted, loading, quiz, startQuiz])

  if (!quizId) {
    return null // Will redirect
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Sign In Required</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please sign in to take the quiz</p>
          <Button onClick={() => router.push('/auth')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Quiz not found</div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

  const handleFinish = async () => {
    const score = await submitQuiz()
    if (score !== undefined) {
      // Navigate to results page or show score
      router.push(`/results?score=${score}`)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-full md:w-64 p-4 border-r dark:border-gray-800">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2 dark:text-white">{quiz.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Time Remaining: {formatTime(timeRemaining || 0)}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 dark:text-white">Questions</h3>
            <div className="grid grid-cols-6 gap-1">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`p-2 text-center text-sm ${
                    currentQuestionIndex === index 
                      ? 'bg-blue-500 text-white' 
                      : userAnswers[quiz.questions[index].id]
                        ? 'bg-gray-200 dark:bg-gray-700' 
                        : 'bg-gray-100 dark:bg-gray-800'
                  } hover:bg-blue-200 dark:hover:bg-blue-700`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 dark:bg-gradient-to-b dark:from-black dark:to-gray-900 dark:text-white">
          <div className="max-w-4xl mx-auto">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  {formatTime(timeRemaining || 0)}
                </span>
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                  aria-label={isPaused ? "Resume test" : "Pause test"}
                >
                  {isPaused ? (
                    <PlayIcon size={20} />
                  ) : (
                    <PauseIcon size={20} />
                  )}
                </button>
              </div>

              <div className="text-center">
                {quiz.title} - Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </div>
            </div>

            {/* Question Content */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question_text}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => submitAnswer(currentQuestion.id, option.id)}
                    className={`w-full text-left p-4 rounded ${
                      userAnswers[currentQuestion.id] === option.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option.option_text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="space-x-4">
                <button className="text-blue-500 dark:text-blue-400 hover:underline">Report an error</button>
              </div>

              <div className="space-x-4">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={handleFinish}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Finish
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === quiz.questions.length - 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
