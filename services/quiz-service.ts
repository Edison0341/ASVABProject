import { Database } from '@/types/database.types'
import { supabase } from '@/supabase/supabase'

type QuizCreate = Database['public']['Tables']['quizzes']['Insert']
type QuestionCreate = Database['public']['Tables']['questions']['Insert']
type OptionCreate = Database['public']['Tables']['options']['Insert']

export class QuizService {
  static async createQuiz(quiz: QuizCreate) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quiz)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async addQuestion(question: QuestionCreate, options: Omit<OptionCreate, 'question_id'>[]) {
    const { data: questionData, error: questionError } = await supabase
      .from('questions')
      .insert(question)
      .select()
      .single()

    if (questionError) throw questionError

    const optionsWithQuestionId = options.map(option => ({
      ...option,
      question_id: questionData.id
    }))

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsWithQuestionId)

    if (optionsError) throw optionsError

    return questionData
  }

  static async updateQuiz(quizId: string, quiz: Partial<QuizCreate>) {
    const { data, error } = await supabase
      .from('quizzes')
      .update(quiz)
      .eq('id', quizId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async deleteQuiz(quizId: string) {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId)

    if (error) throw error
  }

  static async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data
  }

  static async searchQuizzes(query: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*, categories(name)')
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getQuizDetails(quizId: string) {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        categories(name, description),
        questions(
          *,
          options(*)
        )
      `)
      .eq('id', quizId)
      .single()

    if (error) throw error
    return data
  }

  static async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: Record<string, string>,
    timeSpent: number
  ) {
    // Get quiz questions and correct answers
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select(`
        questions(
          id,
          points,
          options(id, is_correct)
        )
      `)
      .eq('id', quizId)
      .single()

    if (quizError) throw quizError

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0

    quiz.questions.forEach((question: any) => {
      const selectedOptionId = answers[question.id]
      const correctOption = question.options.find((opt: any) => opt.is_correct)
      
      totalPoints += question.points
      if (selectedOptionId === correctOption?.id) {
        earnedPoints += question.points
      }
    })

    const score = Math.round((earnedPoints / totalPoints) * 100)

    // Record the attempt
    const { error: attemptError } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        score,
        time_spent: timeSpent,
        completed: true,
        completed_at: new Date().toISOString()
      })

    if (attemptError) throw attemptError

    return score
  }
} 
