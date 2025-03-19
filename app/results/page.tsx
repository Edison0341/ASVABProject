'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/nav/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trophy, Target } from 'lucide-react'

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const score = searchParams?.get('score')

  if (!score) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">No Results Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please complete a quiz to see results</p>
          <Button onClick={() => router.push('/quizzes')}>
            View Available Quizzes
          </Button>
        </div>
      </div>
    )
  }

  const scoreNum = parseInt(score)
  const isPassing = scoreNum >= 70 // Standard passing score

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 dark:text-white">Quiz Results</h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isPassing ? 'Congratulations!' : 'Keep practicing!'}
              </p>
            </div>

            {/* Score Display */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  <div className="text-4xl font-bold dark:text-white">{score}%</div>
                </div>
                <div className="absolute -top-2 -right-2">
                  {isPassing ? (
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  ) : (
                    <Target className="w-12 h-12 text-blue-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                {isPassing ? 'You Passed!' : 'Almost There!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {isPassing
                  ? 'Great job! You&apos;ve demonstrated a good understanding of the material.'
                  : 'Keep practicing! You&apos;re making progress.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              <Button onClick={() => router.push('/quizzes')}>
                Try Another Quiz
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Review Previous Quiz
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
} 
