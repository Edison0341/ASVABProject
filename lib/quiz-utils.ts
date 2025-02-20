import { Database } from '@/types/database.types'
import { supabase } from '@/supabase/supabase'

type QuizWithProgress = Database['public']['Tables']['quizzes']['Row'] & {
  user_progress: Database['public']['Tables']['user_progress']['Row'][]
}

export async function getUserQuizzes(userId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      user_progress!inner(*)
    `)
    .eq('user_progress.user_id', userId)

  if (error) throw error
  return data as QuizWithProgress[]
}

export async function getQuizzesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('category_id', categoryId)

  if (error) throw error
  return data
}

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      quiz:quizzes(
        title,
        category_id,
        difficulty_level
      )
    `)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return data
}

export function calculateTimeSpent(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime()
  const end = new Date(endTime).getTime()
  return Math.round((end - start) / 1000) // Convert to seconds
}

export function formatTimeRemaining(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function calculateQuizScore(
  userAnswers: Record<string, string>,
  questions: Database['public']['Tables']['questions']['Row'] & {
    options: Database['public']['Tables']['options']['Row'][]
  }[]
): number {
  let correctAnswers = 0
  let totalPoints = 0

  for (const question of questions) {
    const selectedOptionId = userAnswers[question.id]
    if (selectedOptionId) {
      const selectedOption = question.options.find(opt => opt.id === selectedOptionId)
      if (selectedOption?.is_correct) {
        correctAnswers += question.points
      }
    }
    totalPoints += question.points
  }

  return Math.round((correctAnswers / totalPoints) * 100)
}

export async function getQuizStatistics(quizId: string) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('score, time_spent')
    .eq('quiz_id', quizId)
    .eq('completed', true)

  if (error) throw error

  const scores = data.map(d => d.score).filter((s): s is number => s !== null)
  const times = data.map(d => d.time_spent).filter((t): t is number => t !== null)

  return {
    averageScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    averageTime: times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0,
    totalAttempts: data.length,
  }
}

export async function getRecommendedQuizzes(userId: string) {
  // Get user's completed quizzes and their scores
  const { data: progress, error: progressError } = await supabase
    .from('user_progress')
    .select(`
      quiz_id,
      score,
      quiz:quizzes(
        difficulty_level,
        category_id
      )
    `)
    .eq('user_id', userId)
    .eq('completed', true)

  if (progressError) throw progressError

  // Calculate average score per difficulty level
  const difficultyScores: Record<string, number[]> = {}
  progress.forEach(p => {
    if (p.score && p.quiz) {
      const difficulty = p.quiz.difficulty_level
      if (!difficultyScores[difficulty]) {
        difficultyScores[difficulty] = []
      }
      difficultyScores[difficulty].push(p.score)
    }
  })

  // Determine appropriate difficulty level
  let targetDifficulty: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  const avgBeginnerScore = difficultyScores['beginner']?.reduce((a, b) => a + b, 0) / (difficultyScores['beginner']?.length || 1)
  
  if (avgBeginnerScore > 80) {
    targetDifficulty = 'intermediate'
  }
  
  const avgIntermediateScore = difficultyScores['intermediate']?.reduce((a, b) => a + b, 0) / (difficultyScores['intermediate']?.length || 1)
  if (avgIntermediateScore > 80) {
    targetDifficulty = 'advanced'
  }

  // Get recommended quizzes
  const { data: recommendedQuizzes, error: quizzesError } = await supabase
    .from('quizzes')
    .select('*')
    .eq('difficulty_level', targetDifficulty)
    .not('id', 'in', `(${progress.map(p => p.quiz_id).join(',')})`)
    .limit(5)

  if (quizzesError) throw quizzesError
  return recommendedQuizzes
} 
