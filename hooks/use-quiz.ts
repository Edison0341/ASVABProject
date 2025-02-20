"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/supabase/supabase'
import { Database } from '@/types/database.types'

type Question = Database['public']['Tables']['questions']['Row'] & {
  options: Database['public']['Tables']['options']['Row'][]
}

type Quiz = Database['public']['Tables']['quizzes']['Row'] & {
  questions: Question[]
}

export function useQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}) // questionId -> selectedOptionId
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  // Fetch quiz data
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*, questions(*, options(*))')
          .eq('id', quizId)
          .single()

        if (quizError) throw quizError
        if (!quizData) throw new Error('Quiz not found')

        setQuiz(quizData as Quiz)
        if (quizData.time_limit) {
          setTimeRemaining(quizData.time_limit * 60) // Convert minutes to seconds
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

  // Timer logic
  useEffect(() => {
    if (!quizStarted || !timeRemaining) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev && prev > 0) {
          return prev - 1
        }
        clearInterval(timer)
        return 0
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeRemaining])

  // Handle answer submission
  const submitAnswer = async (questionId: string, optionId: string) => {
    try {
      setUserAnswers(prev => ({ ...prev, [questionId]: optionId }))

      const { data: option } = await supabase
        .from('options')
        .select('is_correct')
        .eq('id', optionId)
        .single()

      if (!option) throw new Error('Option not found')

      // Record the user's progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          quiz_id: quizId,
          question_id: questionId,
          selected_option_id: optionId,
          is_correct: option.is_correct,
        })

      if (progressError) throw progressError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    }
  }

  // Navigate through questions
  const nextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Start the quiz
  const startQuiz = async () => {
    try {
      setQuizStarted(true)
      // Record quiz start in user_progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .insert({
          quiz_id: quizId,
          started_at: new Date().toISOString(),
        })

      if (progressError) throw progressError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start quiz')
    }
  }

  // Submit the entire quiz
  const submitQuiz = async () => {
    try {
      if (!quiz) return

      // Calculate score
      const totalQuestions = quiz.questions.length
      let correctAnswers = 0

      for (const question of quiz.questions) {
        const selectedOptionId = userAnswers[question.id]
        if (selectedOptionId) {
          const selectedOption = question.options.find(opt => opt.id === selectedOptionId)
          if (selectedOption?.is_correct) {
            correctAnswers++
          }
        }
      }

      const score = Math.round((correctAnswers / totalQuestions) * 100)

      // Update user progress
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          score,
        })
        .eq('quiz_id', quizId)

      if (progressError) throw progressError

      return score
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz')
    }
  }

  return {
    quiz,
    loading,
    error,
    currentQuestionIndex,
    timeRemaining,
    quizStarted,
    userAnswers,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    startQuiz,
    submitQuiz,
  }
} 
