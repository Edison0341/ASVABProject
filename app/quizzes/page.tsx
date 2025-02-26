'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/supabase/supabase'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/nav/navbar'

interface Quiz {
  id: string
  title: string
  description: string
  difficulty_level: string
  time_limit: number
  passing_score: number
  categories: {
    name: string
  }
}

export default function QuizzesPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const { data, error } = await supabase
          .from('quizzes')
          .select('*, categories(name)')
          .order('created_at', { ascending: false })

        if (error) throw error
        setQuizzes(data as Quiz[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quizzes')
      } finally {
        setLoading(false)
      }
    }

    fetchQuizzes()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Available Quizzes</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="p-6 hover:shadow-lg transition-shadow dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">{quiz.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{quiz.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded text-sm">
                  {quiz.categories.name}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded text-sm">
                  {quiz.difficulty_level}
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 rounded text-sm">
                  {quiz.time_limit} minutes
                </span>
              </div>
              <Button 
                onClick={() => router.push(`/practice?id=${quiz.id}`)}
                className="w-full"
              >
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
} 
