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

  static async fixMissingOptions(quizId: string) {
    try {
      // Get all questions for the quiz
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_text')
        .eq('quiz_id', quizId)

      if (questionsError) throw questionsError
      if (!questions || questions.length === 0) return { success: false, message: 'No questions found' }

      const fixedQuestions = []

      // Check each question for options
      for (const question of questions) {
        const { data: options, error: optionsError } = await supabase
          .from('options')
          .select('id')
          .eq('question_id', question.id)

        if (optionsError) throw optionsError

        // If no options found, add default options
        if (!options || options.length === 0) {
          console.log(`Adding missing options for question: ${question.question_text}`)
          
          // Create default options
          const defaultOptions = [
            { question_id: question.id, option_text: 'Option A', is_correct: true },
            { question_id: question.id, option_text: 'Option B', is_correct: false },
            { question_id: question.id, option_text: 'Option C', is_correct: false },
            { question_id: question.id, option_text: 'Option D', is_correct: false }
          ]

          const { data: newOptions, error: insertError } = await supabase
            .from('options')
            .insert(defaultOptions)
            .select()

          if (insertError) throw insertError
          fixedQuestions.push(question.id)
        }
      }

      return { 
        success: true, 
        message: fixedQuestions.length > 0 
          ? `Fixed ${fixedQuestions.length} questions with missing options` 
          : 'All questions have options'
      }
    } catch (error) {
      console.error('Error fixing missing options:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Add a method to check and fix a specific quiz
  static async checkAndFixQuiz(quizId: string) {
    try {
      // First get the quiz details to check if it exists
      const { data: quiz, error: quizError } = await this.getQuizDetails(quizId)
      
      if (quizError) throw quizError
      if (!quiz) return { success: false, message: 'Quiz not found' }
      
      // Check for questions without options
      const questionsWithoutOptions = quiz.questions.filter((q: any) => 
        !q.options || q.options.length === 0
      )
      
      if (questionsWithoutOptions.length === 0) {
        return { success: true, message: 'All questions have options' }
      }
      
      // Fix each question without options
      for (const question of questionsWithoutOptions) {
        console.log(`Adding options for question: ${question.question_text}`)
        
        // Create default options
        const defaultOptions = [
          { question_id: question.id, option_text: 'Option A', is_correct: true },
          { question_id: question.id, option_text: 'Option B', is_correct: false },
          { question_id: question.id, option_text: 'Option C', is_correct: false },
          { question_id: question.id, option_text: 'Option D', is_correct: false }
        ]

        const { error: insertError } = await supabase
          .from('options')
          .insert(defaultOptions)

        if (insertError) throw insertError
      }
      
      return { 
        success: true, 
        message: `Fixed ${questionsWithoutOptions.length} questions with missing options` 
      }
    } catch (error) {
      console.error('Error checking and fixing quiz:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Add a method to identify and remove duplicate questions
  static async removeDuplicateQuestions(quizId: string) {
    try {
      // First get the quiz details to check if it exists
      const { data: quiz, error: quizError } = await this.getQuizDetails(quizId)
      
      if (quizError) throw quizError
      if (!quiz) return { success: false, message: 'Quiz not found' }
      
      // Create a map to track questions by text
      const questionMap = new Map<string, any[]>()
      
      // Group questions by their text
      quiz.questions.forEach((question: any) => {
        const text = question.question_text.trim()
        if (!questionMap.has(text)) {
          questionMap.set(text, [])
        }
        questionMap.get(text)?.push(question)
      })
      
      // Find duplicate questions (those with the same text)
      const duplicates: any[] = []
      questionMap.forEach((questions, text) => {
        if (questions.length > 1) {
          // Keep the first one, mark the rest as duplicates
          duplicates.push(...questions.slice(1))
        }
      })
      
      if (duplicates.length === 0) {
        return { success: true, message: 'No duplicate questions found' }
      }
      
      console.log(`Found ${duplicates.length} duplicate questions to remove`)
      
      // Delete the duplicate questions
      for (const question of duplicates) {
        console.log(`Removing duplicate question: ${question.question_text}`)
        
        const { error: deleteError } = await supabase
          .from('questions')
          .delete()
          .eq('id', question.id)
        
        if (deleteError) throw deleteError
      }
      
      return { 
        success: true, 
        message: `Removed ${duplicates.length} duplicate questions` 
      }
    } catch (error) {
      console.error('Error removing duplicate questions:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
} 
