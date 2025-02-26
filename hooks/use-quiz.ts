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
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionLoaded, setSessionLoaded] = useState(false)

  // Get user session - separate from quiz loading
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('Getting session...')
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }
        
        if (!session?.user?.id) {
          console.log('No active session found')
          setUserId(null)
          setSessionLoaded(true)
          return
        }

        console.log('Found session with user:', session.user)

        // Try to get user record first
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id, email, username')
          .eq('id', session.user.id)
          .single()

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('Error checking user:', userCheckError)
          throw userCheckError
        }

        if (!existingUser) {
          console.log('Creating new user record for:', session.user.id)
          const { error: createError } = await supabase.rpc('create_user_record', {
            user_id: session.user.id,
            user_email: session.user.email || '',
            user_name: session.user.email?.split('@')[0] || 'user_' + session.user.id.slice(0, 8)
          })

          if (createError) {
            console.error('Error creating user record:', createError)
            throw createError
          }
          console.log('User record created successfully')
        } else {
          console.log('Found existing user record:', existingUser)
        }

        console.log('Setting user ID:', session.user.id)
        setUserId(session.user.id)
        setSessionLoaded(true)
      } catch (err) {
        console.error('Error getting session:', err)
        setError(err instanceof Error ? err.message : 'Failed to get user session')
        setUserId(null)
        setSessionLoaded(true)
      }
    }

    // Call getSession immediately
    getSession()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session?.user?.id)
      
      if (!session?.user?.id) {
        console.log('No user in auth state change')
        setUserId(null)
        return
      }

      try {
        // Try to get user record first
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id, email, username')
          .eq('id', session.user.id)
          .single()

        if (userCheckError && userCheckError.code !== 'PGRST116') {
          console.error('Error checking user:', userCheckError)
          setUserId(null)
          return
        }

        if (!existingUser) {
          console.log('Creating new user record on auth change for:', session.user.id)
          const { error: createError } = await supabase.rpc('create_user_record', {
            user_id: session.user.id,
            user_email: session.user.email || '',
            user_name: session.user.email?.split('@')[0] || 'user_' + session.user.id.slice(0, 8)
          })

          if (createError) {
            console.error('Error creating user record:', createError)
            setUserId(null)
            return
          }
          console.log('User record created successfully on auth change')
        } else {
          console.log('Found existing user record on auth change:', existingUser)
        }

        console.log('Setting user ID from auth change:', session.user.id)
        setUserId(session.user.id)
      } catch (err) {
        console.error('Error in auth state change:', err)
        setUserId(null)
      }
    })

    return () => {
      console.log('Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, []) // Remove quizId dependency

  // Fetch quiz data
  useEffect(() => {
    async function fetchQuiz() {
      try {
        console.log('Fetching quiz:', quizId)
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*, questions(*, options(*))')
          .eq('id', quizId)
          .single()

        if (quizError) {
          console.error('Quiz fetch error:', quizError)
          throw quizError
        }
        
        if (!quizData) {
          console.error('No quiz data found')
          throw new Error('Quiz not found')
        }

        console.log('Quiz data fetched:', quizData)
        setQuiz(quizData as Quiz)
        if (quizData.time_limit) {
          setTimeRemaining(quizData.time_limit * 60)
        }
      } catch (err) {
        console.error('Error in fetchQuiz:', err)
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }

    if (quizId) {
      fetchQuiz()
    }
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
      if (!userId) {
        console.error('No user ID found when submitting answer')
        throw new Error('Please sign in to submit answers')
      }
      
      setUserAnswers(prev => ({ ...prev, [questionId]: optionId }))

      console.log('Submitting answer:', { questionId, optionId, userId })
      const { data: option, error: optionError } = await supabase
        .from('options')
        .select('is_correct')
        .eq('id', optionId)
        .single()

      if (optionError) {
        console.error('Option fetch error:', optionError)
        throw optionError
      }

      if (!option) {
        console.error('Option not found')
        throw new Error('Option not found')
      }

      // Record the user's progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          quiz_id: quizId,
          question_id: questionId,
          selected_option_id: optionId,
          is_correct: option.is_correct,
          started_at: new Date().toISOString(),
          completed: false
        }, {
          onConflict: 'user_id,quiz_id,question_id'
        })
        .select()

      if (progressError) {
        console.error('Progress update error:', progressError.message, progressError.details, progressError.hint)
        throw progressError
      }

      console.log('Answer submitted successfully:', progressData)
    } catch (err) {
      console.error('Error in submitAnswer:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit answer')
    }
  }

  // Start the quiz
  const startQuiz = async () => {
    try {
      if (!userId) {
        console.error('No user ID found when starting quiz')
        throw new Error('Please sign in to start the quiz')
      }

      if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        console.error('No quiz questions found')
        throw new Error('Quiz has no questions')
      }
      
      console.log('Starting quiz for user:', userId)
      setQuizStarted(true)

      // Record quiz start in user_progress with the first question
      const firstQuestion = quiz.questions[0]
      console.log('First question:', firstQuestion)

      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          quiz_id: quizId,
          question_id: firstQuestion.id,
          started_at: new Date().toISOString(),
          completed: false,
          score: null,
          completed_at: null,
          selected_option_id: null,
          is_correct: false
        }, {
          onConflict: 'user_id,quiz_id,question_id'
        })
        .select()

      if (progressError) {
        console.error('Error recording quiz start:', progressError.message, progressError.details, progressError.hint)
        throw progressError
      }

      console.log('Quiz started successfully:', progressData)
    } catch (err) {
      console.error('Error in startQuiz:', err)
      setError(err instanceof Error ? err.message : 'Failed to start quiz')
      setQuizStarted(false)
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

  // Submit the entire quiz
  const submitQuiz = async () => {
    try {
      if (!quiz) {
        console.error('No quiz data found when submitting')
        return
      }
      
      if (!userId) {
        console.error('No user ID found when submitting quiz')
        throw new Error('Please sign in to submit the quiz')
      }

      console.log('Submitting quiz:', { quizId, userId })
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
      const completedAt = new Date().toISOString()

      // Update all progress entries for this quiz
      const { error: progressError } = await supabase
        .from('user_progress')
        .update({
          completed: true,
          completed_at: completedAt,
          score,
        })
        .eq('user_id', userId)
        .eq('quiz_id', quizId)

      if (progressError) {
        console.error('Progress update error:', progressError)
        throw progressError
      }

      console.log('Quiz submitted successfully with score:', score)
      return score
    } catch (err) {
      console.error('Error in submitQuiz:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit quiz')
      return undefined
    }
  }

  // Update the auto-start effect to wait for session
  useEffect(() => {
    if (!quizStarted && !loading && quiz && sessionLoaded && userId) {
      console.log('Auto-starting quiz with session loaded')
      startQuiz()
    }
  }, [quizStarted, loading, quiz, sessionLoaded, userId])

  return {
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
  }
}
