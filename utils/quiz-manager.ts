import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type QuizCreate = Database['public']['Tables']['quizzes']['Insert']
type QuestionCreate = Database['public']['Tables']['questions']['Insert']
type OptionCreate = Database['public']['Tables']['options']['Insert']

interface QuizData {
  categoryName: string
  quiz: Omit<QuizCreate, 'category_id'>
  questions: {
    question: Omit<QuestionCreate, 'quiz_id'>
    options: Omit<OptionCreate, 'question_id'>[]
  }[]
}

export async function addCompleteQuiz(quizData: QuizData) {
  try {
    // 1. Get category ID
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('name', quizData.categoryName)
      .single()

    if (categoryError) throw new Error(`Category error: ${categoryError.message}`)
    if (!categories) throw new Error(`Category not found: ${quizData.categoryName}`)

    // 2. Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        ...quizData.quiz,
        category_id: categories.id
      })
      .select()
      .single()

    if (quizError) throw new Error(`Quiz error: ${quizError.message}`)
    if (!quiz) throw new Error('Failed to create quiz')

    // 3. Add questions and options
    for (const questionData of quizData.questions) {
      // Add question
      const { data: question, error: questionError } = await supabase
        .from('questions')
        .insert({
          ...questionData.question,
          quiz_id: quiz.id
        })
        .select()
        .single()

      if (questionError) throw new Error(`Question error: ${questionError.message}`)
      if (!question) throw new Error('Failed to create question')

      // Add options
      const { error: optionsError } = await supabase
        .from('options')
        .insert(
          questionData.options.map(option => ({
            ...option,
            question_id: question.id
          }))
        )

      if (optionsError) throw new Error(`Options error: ${optionsError.message}`)
    }

    return { success: true, quizId: quiz.id }
  } catch (error) {
    console.error('Error adding quiz:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Example usage:
export const sampleQuizData: QuizData = {
  categoryName: 'Mathematics Knowledge',
  quiz: {
    title: 'ASVAB Mathematics Knowledge Practice Test',
    description: 'Practice test covering basic mathematical concepts and applications',
    difficulty_level: 'beginner',
    time_limit: 30,
    passing_score: 70
  },
  questions: [
    {
      question: {
        question_text: 'What is the square root of 144?',
        explanation: 'The square root of 144 is 12 because 12 × 12 = 144',
        points: 2
      },
      options: [
        { option_text: '10', is_correct: false },
        { option_text: '12', is_correct: true },
        { option_text: '14', is_correct: false },
        { option_text: '16', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'Solve for x: 3x + 7 = 22',
        explanation: 'Subtract 7 from both sides: 3x = 15, then divide both sides by 3: x = 5',
        points: 2
      },
      options: [
        { option_text: '3', is_correct: false },
        { option_text: '4', is_correct: false },
        { option_text: '5', is_correct: true },
        { option_text: '6', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'If 20% of a number is 40, what is the number?',
        explanation: '20% = 0.2, so if 0.2x = 40, then x = 40/0.2 = 200',
        points: 2
      },
      options: [
        { option_text: '100', is_correct: false },
        { option_text: '150', is_correct: false },
        { option_text: '200', is_correct: true },
        { option_text: '250', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'What is the area of a rectangle with length 8 units and width 6 units?',
        explanation: 'Area of a rectangle = length × width = 8 × 6 = 48 square units',
        points: 2
      },
      options: [
        { option_text: '28 square units', is_correct: false },
        { option_text: '48 square units', is_correct: true },
        { option_text: '56 square units', is_correct: false },
        { option_text: '64 square units', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'What is the value of 5² × 5³?',
        explanation: 'When multiplying powers with the same base, add the exponents: 5² × 5³ = 5⁵ = 3,125',
        points: 2
      },
      options: [
        { option_text: '625', is_correct: false },
        { option_text: '1,250', is_correct: false },
        { option_text: '3,125', is_correct: true },
        { option_text: '15,625', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'If a triangle has angles measuring 45°, 45°, and 90°, what type of triangle is it?',
        explanation: 'A triangle with two 45° angles and one 90° angle is an isosceles right triangle',
        points: 2
      },
      options: [
        { option_text: 'Equilateral', is_correct: false },
        { option_text: 'Scalene', is_correct: false },
        { option_text: 'Isosceles Right', is_correct: true },
        { option_text: 'Obtuse', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'What is the slope of a line that passes through the points (2,3) and (4,7)?',
        explanation: 'Slope = (y₂-y₁)/(x₂-x₁) = (7-3)/(4-2) = 4/2 = 2',
        points: 2
      },
      options: [
        { option_text: '1', is_correct: false },
        { option_text: '2', is_correct: true },
        { option_text: '3', is_correct: false },
        { option_text: '4', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'What is the value of 3! (3 factorial)?',
        explanation: '3! = 3 × 2 × 1 = 6',
        points: 2
      },
      options: [
        { option_text: '3', is_correct: false },
        { option_text: '6', is_correct: true },
        { option_text: '9', is_correct: false },
        { option_text: '27', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'If a car travels 120 miles in 2 hours, what is its average speed in miles per hour?',
        explanation: 'Average speed = distance/time = 120/2 = 60 mph',
        points: 2
      },
      options: [
        { option_text: '40 mph', is_correct: false },
        { option_text: '50 mph', is_correct: false },
        { option_text: '60 mph', is_correct: true },
        { option_text: '70 mph', is_correct: false }
      ]
    },
    {
      question: {
        question_text: 'What is the sum of the interior angles of a pentagon?',
        explanation: 'For a polygon with n sides, sum of interior angles = (n-2) × 180°. For a pentagon, n=5, so (5-2) × 180° = 540°',
        points: 2
      },
      options: [
        { option_text: '360°', is_correct: false },
        { option_text: '450°', is_correct: false },
        { option_text: '540°', is_correct: true },
        { option_text: '720°', is_correct: false }
      ]
    }
  ]
} 
